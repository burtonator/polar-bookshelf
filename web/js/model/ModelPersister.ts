import {DocMeta} from '../metadata/DocMeta';
import {Batcher} from '../datastore/batcher/Batcher';
import {TraceEvent} from '../proxies/TraceEvent';
import {Logger} from 'polar-shared/src/logger/Logger';
import {DocInfo} from '../metadata/DocInfo';
import {Proxies} from '../proxies/Proxies';
import {PersistenceLayerManagers} from '../datastore/PersistenceLayerManagers';
import {PersistenceLayerHandler} from '../datastore/PersistenceLayerHandler';
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";

const log = Logger.create();

export class ModelPersister {

    public nrWrites: number = 0;

    public nrDeferredWrites: number = 0;

    constructor(private readonly persistenceLayerHandler: PersistenceLayerHandler,
                public readonly docMeta: IDocMeta) {

        const batcher = new Batcher(async () => {

            const persistenceLayer = this.persistenceLayerHandler.get();

            await persistenceLayer.write(this.docMeta.docInfo.fingerprint, this.docMeta);
            ++this.nrWrites;
            this.nrDeferredWrites = 0;

        });

        // create a new DocMeta proxy that updates on ANY update.
        this.docMeta = Proxies.create(this.docMeta, (traceEvent: TraceEvent) => {

            if (this.docMeta.docInfo.mutating === 'skip') {
                return;
            }

            if (this.docMeta.docInfo.mutating === 'batch') {

                // skip bulk updates. This is done when we need to mutate multiple
                // fields like setting 5-10 pagemarks at once or setting pagemarks
                // and other metrics metadata.

                ++this.nrDeferredWrites;

                return;
            }

            if (this.isFinalMutatingEvent(traceEvent)) {

                if (this.nrDeferredWrites <= 1) {
                    // we only have one deferred write and this is the toggling
                    // of the mutating field OR we're skipping writes.
                    return;
                }

            }

            log.info(`sync of persistence layer at ${traceEvent.path} : ${traceEvent.property}"`);

            setTimeout(() => {

                batcher.enqueue().run()
                    .catch(err => log.error("Unable to persist: ", err));

            }, 0);

            return true;

        });

        PersistenceLayerManagers.onPersistenceManager(this.persistenceLayerHandler, (persistenceLayer) => {

            // only accept DocInfo updates from the document we've opened.
            persistenceLayer.addEventListenerForDoc(this.docMeta.docInfo.fingerprint, event => {

                log.debug("Received updated DocInfo.");

                if (this.docMeta.docInfo.fingerprint !== event.docInfo.fingerprint) {
                    const detail = `${this.docMeta.docInfo.fingerprint} vs ${event.docInfo.fingerprint}`;
                    throw new Error(`Attempt to update incorrect fingerprint: ` + detail);
                }

                this.docMeta.docInfo = new DocInfo(event.docInfo);

            });

        }, 'changed');

    }

    private isFinalMutatingEvent(traceEvent: TraceEvent) {

        return traceEvent.path === '/docInfo' &&
               traceEvent.property === 'mutating' &&
               traceEvent.value === undefined;

    }

}
