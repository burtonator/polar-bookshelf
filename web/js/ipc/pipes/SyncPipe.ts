import {Pipe, PipeNotification} from './Pipe';
import {Logger} from 'polar-shared/src/logger/Logger';

const log = Logger.create();

/**
 * Provides a pipe that syncs with the remote pipe so that they are both
 * in the ready state.  This can be used to make sure both services are up and
 * running before continuing to go forward sending message which may never be
 * received.
 *
 */
export class SyncPipe {

    private readonly delegate: Pipe<any,string>;

    private readonly type: string;

    private readonly name: string;

    /**
     * The unique channel we're using to establish sync.
     */
    private readonly channel: string;

    /**
     *
     * @param delegate
     * @param type The type for the sync pipe instance. Used for tracing.
     */
    public constructor(delegate: Pipe<any,string>, type: string, name: string) {
        this.delegate = delegate;
        this.type = type;
        this.name = name;
        this.channel = `/sync-establish#${name}`;
    }

    async sync(): Promise<void> {

        // TODO: one issue if what happens if the SECOND client dies and comes
        // back. then this service is still working and alive BUT new / resuming
        // SyncPipe will not be able to work and will block.  Consider adding
        // a permanent listener.

        // must use the create-then-await pattern or else there may be a chance
        // we miss the response notification event if we're the second waiter.
        let establishPromise = this.delegate.when(this.channel);

        this.writeSync();

        await this.awaitSync(establishPromise);

        this.writeSync();

    }

    private writeSync() {

        log.info(`${this.type} write ${this.channel} sync`);

        this.delegate.write(this.channel, 'sync');

    }

    private async awaitSync(establishPromise: Promise<PipeNotification<any, string>>) {


        log.info(`${this.type} await ${this.channel} sync promise...`);

        await establishPromise;

        log.info(`${this.type} await ${this.channel} sync promise...done`);

    }

}
