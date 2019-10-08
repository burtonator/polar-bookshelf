import {DocMetaMutation, DocMetaSnapshotEvent, DocMetaSnapshotEventListener} from './Datastore';
import {DocMetaComparisonIndex} from './DocMetaComparisonIndex';
import {IDocInfo} from 'polar-shared/src/metadata/IDocInfo';

export class DocMetaSnapshotEventListeners {

    /**
     * Create a new listener that takes inputs and creates a de-duplicated
     * listener that only emits new or updated documents by the UUID or deleted
     * documents.
     *
     * This work with one ore more listeners which enables us to have
     * existing listeners that sends from IPC as well the firebase listeners
     * and we will just get the earliest one.
     *
     */
    public static createDeduplicatedListener(outputListener: DocMetaSnapshotEventListener,
                                             docMetaComparisonIndex = new DocMetaComparisonIndex()): EventDeduplicator {

        if (!docMetaComparisonIndex) {
            docMetaComparisonIndex = new DocMetaComparisonIndex();
        }

        // TODO: Should we filter on the consistency level?  We need a way to
        // trigger the first sync when we get the committed writes from the
        // FirebaseDatastore so if we get 'written' consistency level from Firebase
        // and the rest are filtered we can't ever trigger the synchronize ...
        //
        // We could have custom filters for the level... so we could support
        // BOTH, committed, or written levels...

        const listener = async (docMetaSnapshotEvent: DocMetaSnapshotEvent) => {

            const acceptedDocMetaMutations: DocMetaMutation[] = [];

            for (const docMetaMutation of docMetaSnapshotEvent.docMetaMutations) {

                const docInfo = await docMetaMutation.docInfoProvider();

                if (docMetaComparisonIndex.handleDocMetaMutation(docMetaMutation, docInfo)) {
                    acceptedDocMetaMutations.push(docMetaMutation);
                }

            }

            // always emit the listener even if we've accepted no mutations
            // because other metadata here including the batch and progress is
            // necessary to handle within the listener for downstream event
            // handlers

            await outputListener({
                ...docMetaSnapshotEvent,
                docMetaMutations: acceptedDocMetaMutations,
            });

        };

        return {
            handleDocMetaMutation: docMetaComparisonIndex.handleDocMetaMutation.bind(docMetaComparisonIndex),
            listener,
        };

    }

}

export interface EventDeduplicator {

    handleDocMetaMutation(docMetaMutation: DocMetaMutation, docInfo: IDocInfo): boolean;

    listener: DocMetaSnapshotEventListener;

}
