
export class DocumentReadyStates {

    public static async waitFor(doc: Document,
                                requiredReadyState: DocumentReadyState): Promise<ReadyStateResolution> {

        return this.waitForChanger(doc, requiredReadyState, new DocumentReadyStateChanger(doc));

    }

    /**
     * Wait for the document to hit the given ready state.
     *
     * The ready states go from:
     *
     * "loading" -> "interactive" -> "complete"
     *
     * We're also allows to wait for a minimum state.  So if we wait for interactive
     * but we're already complete it will return immediately.
     *
     */
    public static async waitForChanger(doc: Document,
                                       requiredReadyState: DocumentReadyState,
                                       readyStateChanger: ReadyStateChanger): Promise<ReadyStateResolution> {


        return new Promise<ReadyStateResolution>((resolve, reject) => {

            // always perform two checks.  First using the awaitState and then
            // using the current state. Promises can only be resolved once so even
            // if we call resolve() twice it won't be an issue.
            readyStateChanger.awaitState(requiredReadyState)
                .then(() => {
                    resolve(ReadyStateResolution.EVENT);
                })
                .catch(err => reject(err));

            if (this.meetsRequiredState(requiredReadyState, readyStateChanger.readyState)) {
                resolve(ReadyStateResolution.DIRECT);
            }

        });

    }

    public static meetsRequiredState(requiredReadyState: DocumentReadyState, currentReadyState: DocumentReadyState) {

        const requiredReadyStateCode = this.toReadyStateCode(requiredReadyState);
        const currentReadyStateCode = this.toReadyStateCode(currentReadyState);

        return currentReadyStateCode >= requiredReadyStateCode;

    }

    public static toReadyStateCode(readyState: DocumentReadyState): ReadyStateCode {

        switch (readyState) {

            case 'loading':
                return 1;

            case 'interactive':
                return 2;

            case 'complete':
                return 3;

        }

    }

}

/**
 * The mechanism we used to resolve the ready state.
 */
export enum ReadyStateResolution {
    DIRECT = 'direct',
    EVENT = 'event'
}

type ReadyStateCode = 1 | 2 | 3 ;

/**
 * Interface which allows us to test the transitions between states.
 */
interface ReadyStateChanger {

    readonly readyState: DocumentReadyState;

    awaitState(requiredReadyState: DocumentReadyState): Promise<void>

}

export class DocumentReadyStateChanger implements ReadyStateChanger {

    readonly readyState: DocumentReadyState;

    private readonly doc: Document;

    constructor(doc: Document) {
        this.doc = doc;
        this.readyState = doc.readyState
    }

    async awaitState(requiredReadyState: DocumentReadyState): Promise<void> {

        // TODO: implementing this as an observable would definitely be better.
        // the interface for the mock and the document would be the same I
        // think and would make testing simpler.
        return new Promise<void>(resolve => {

            let listener: () => void = () => {

                if (DocumentReadyStates.meetsRequiredState(requiredReadyState, this.doc.readyState)) {
                    resolve();
                    this.doc.removeEventListener('readystatechange', listener);
                }

            };

            this.doc.addEventListener('readystatechange', listener);

        })


    }

}

export class MockReadyStateChanger implements ReadyStateChanger {

    readonly readyState: DocumentReadyState;

    resolve: () => void = () => {};

    constructor(readyState: DocumentReadyState) {
        this.readyState = readyState;
    }

    awaitState(requiredReadyState: DocumentReadyState): Promise<void> {

        return new Promise<void>(resolve => {
            this.resolve = resolve;
        })

    }
}
