
// noinspection TsLint: array-type
import {Result} from '../../js/util/Result';

export type Transfer = (ArrayBuffer | MessagePort | ImageBitmap)[];

export interface ITypedWorker<In, Out> {
    terminate: () => void;
    onMessage: OnMessageCallback<Out> ;
    postMessage: (workerMessage: In, transfer?: Transfer) => void;
}

type WorkerFunction<In, Out> = (input: In, cb: WorkerCallback<Out>) => void;

type WorkerCallback<Out> = (output: Out, err?: Error, transfer?: Transfer) => void;

type OnMessageCallback<Out> = (output: Result<Out>) => void;

// noinspection TsLint: no-empty
export const NullOnMessageCallback = <Out>(output: Result<Out>) => {};

// noinspection TsLint: max-line-length
export function createWorker<In, Out>(workerFunction: WorkerFunction<In, Out>,
                                      onMessage: OnMessageCallback<Out> = NullOnMessageCallback): ITypedWorker<In, Out> {

    return new TypedWorker(workerFunction, onMessage);

}

/**
 *
 *
 *
 * Internally this indirectly creates a worker by creating a blob URL and then
 * artificially creating a script that is evaluated internally to create the
 * new thread.
 */
class TypedWorker<In, Out> implements ITypedWorker<In, Out> {

    public readonly onMessage: OnMessageCallback<Out> = NullOnMessageCallback;

    private delegate: Worker;
    private readonly workerFunction: WorkerFunction<In, Out>;

    constructor(workerFunction: WorkerFunction<In, Out>,
                onMessage: OnMessageCallback<Out> = NullOnMessageCallback) {

        this.workerFunction = workerFunction;
        this.onMessage = onMessage;

        const script = `


        `;

        // TODO: make this into one multi-line script so that I can also handle try/catch

        const postMessage = `(${workerFunction}).call(this, e.data, postMessage)`;
        const workerFile = `self.onmessage=function(e){${postMessage}}`;
        const blob = new Blob([workerFile], { type: 'application/javascript' });

        this.delegate = new Worker(URL.createObjectURL(blob));

        this.delegate.onmessage = (messageEvent: MessageEvent) => {
            this.onMessage(new Result<Out>(messageEvent.data));
        };

    }

    /**
     * Post message to worker for processing
     * @param workerMessage message to send to worker
     */
    public postMessage(workerMessage: In, transfer?: Transfer): void {
        this.delegate.postMessage(workerMessage, transfer);
    }

    public terminate(): void {
        this.delegate.terminate();
    }

}

export class TypedExecutor<In, Out> {

    private sequence: number = 0;

    private jobQueue = new JobQueue<Out>();

    // https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm

    public execute(input: In): Promise<Out> {

        return new Promise(((resolve, reject) => {

            const id = this.sequence++;

            this.jobQueue.add({
                id,
                resolve,
                reject
            });

        }));

    }

    // public onMessageCallback()

}

class JobQueue<Out> {

    private jobs: {[id: number]: Job<Out>} = {};

    public get(id: number): Job<Out> | undefined {
        return this.jobs[id];
    }

    public add(job: Job<Out>) {
        this.jobs[job.id] = job;
    }

}

export interface Job<Out> {

    readonly id: number;
    readonly resolve: (resolved: Out) => void;
    readonly reject: (err: Error) => void;

}
