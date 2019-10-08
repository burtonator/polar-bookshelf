/**
 *
 * This is used to prevent duplicate writes in a chain from the event store and
 * only write the first and the last. It doesn't make sense to write
 * intermediate writes because we're going to eventually write he last.
 *
 * https://mechanical-sympathy.blogspot.com/2011/10/smart-batching.html
 */
import {Logger} from 'polar-shared/src/logger/Logger';

const log = Logger.create();

export class Batcher {

    private readonly runnable: AsyncRunnable;

    private tickets: Ticket[] = [];

    constructor(runnable: AsyncRunnable) {
        this.runnable = runnable;
    }

    /**
     * Enqueue the runnable to be executed again as part of a batch.
     */
    public enqueue(): Batch {

        const ticket = new Ticket(this.runnable());

        this.tickets.push(ticket);

        if (this.tickets.length > 1) {

            // Push a ticket on so that the worker thread handling this IO
            // can complete my work for me when it finishes the next write.

            // Note that the count of tickets is unbounded and if this system
            // goes too fast we might use excessive memory.  I'm not sure if
            // there is a way to get around this in Javascript as I need to
            // lock around a variable and I don't think I can do that.

            // NOTE: the excess entry isn't going to change anything.. it's just
            // going to mean that we don't know how many we deleted/injected.

            // NOTE: there's another strategy that we could pursue. We could
            // stick ONE entry into the queue and then that would be an object
            // with a count of the pending /batched items.  The only issue there
            // is that the accounting could be inaccurate as we have a race
            // between the reader and a writer.  In practice I don't think this
            // would run out of memory so this is probably an acceptable
            // strategy.

            const pending = this.tickets.length;

            return new PassiveBatch(pending, ticket);

        }

        return new ActiveBatch(this.tickets, this.runnable, ticket);

    }

}

export interface Batch {

    readonly ticket: Ticket;

    run(): Promise<void>;

}

/**
 * Metadata around the a delayed execution.  IE no work was completed but
 * instead scheduled.
 */
export class PassiveBatch implements Batch {

    public readonly ticket: Ticket;

    /**
     * The number of tickets in the queue at the time this was executed.
     */
    public readonly pending: number;

    constructor(pending: number, ticket: Ticket) {
        this.pending = pending;
        this.ticket = ticket;

    }

    public run(): Promise<void> {
        return Promise.resolve();
    }

}

/**
 * Metdata around the last execution of this batch. Mostly for testing purposes.
 */
export class ActiveBatch implements Batch  {

    /**
     * The total number of batched records written across all batches.
     */
    public batched: number = 0;

    /**
     * The total number of batches executed in the last call to execute()
     */
    public batches: number = 0;

    /**
     * For each batch, the number of tickets executed within that batch.
     */
    public ticketsPerBatch: number[] = [];

    private readonly tickets: Ticket[];

    private readonly runnable: AsyncRunnable;

    public readonly ticket: Ticket;

    constructor(tickets: Ticket[], runnable: AsyncRunnable, ticket: Ticket) {
        this.tickets = tickets;
        this.runnable = runnable;
        this.ticket = ticket;
    }

    public async run(): Promise<void> {

        while (this.tickets.length > 0) {
            // keep writing while we have tickets. The other tickets are when
            // people have been writing while we were blocked.

            await this.iter();

        }

    }

    /**
     * Apply once batch iteration.
     */
    public async iter() {

        const nrTicketsToExecute = this.tickets.length;
        log.debug("Executing request for N tickets: ", nrTicketsToExecute);

        await this.tickets[0].promise;

        const tickets = this.tickets.splice(0, nrTicketsToExecute);

        tickets.forEach(ticket => ticket.executed = true);

        this.ticketsPerBatch.push(nrTicketsToExecute);
        this.batched += nrTicketsToExecute;

        ++this.batches;

    }

}

export class Ticket {


    /**
     * True when the runnable was executed as requested.
     */
    public executed: boolean = false;

    public readonly promise: Promise<void>;

    constructor(promise: Promise<void>) {
        this.promise = promise;
    }

}

/**
 * Interface that just returns a promise and performs work. The results are not
 * needed other than to make sure we execute.
 */
export interface AsyncRunnable {
    (): Promise<void>;
}

/**
 * Async runnable that performs no operation.
 */
export async function nullAsyncRunnable() {

}
