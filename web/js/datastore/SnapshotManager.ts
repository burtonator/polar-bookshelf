import {Datastore, DatastoreConsistency, DatastoreID, DocMetaMutation, DocMetaSnapshotBatch, DocMetaSnapshotEvent, DocMetaSnapshotEventListener, ErrorListener, SnapshotProgress, SnapshotResult, SynchronizationEvent} from "./Datastore";
import {Directories} from './Directories';
import {DocMetaFileRef, DocMetaFileRefs} from './DocMetaRef';
import {DatastoreMutation, DefaultDatastoreMutation} from './DatastoreMutation';
import {DiskDeleteResult} from './DiskDatastore';
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';
import {Datastores} from './Datastores';
import {IEventDispatcher, SimpleReactor} from '../reactor/SimpleReactor';
import {ProgressTrackers} from "../util/ProgressTrackers";
import {IDocInfo} from 'polar-shared/src/metadata/IDocInfo';
import {DocMetas} from '../metadata/DocMetas';
import {AsyncProviders} from 'polar-shared/src/util/Providers';

/**
 */
export class SnapshotManager {

    private readonly docMetaSnapshotEventDispatcher: IEventDispatcher<DocMetaSnapshotEvent> = new SimpleReactor();

    private readonly datastore: Datastore;

    constructor(datastore: Datastore) {
        this.datastore = datastore;
    }
    //
    // public onDelete(docMetaFileRef: DocMetaFileRef): void {
    //
    //     const failureProvider = async () => Promise.reject("No reads during delete allowed");
    //
    //     const docMetaSnapshotEvent: DocMetaSnapshotEvent = {
    //         datastore: this.datastore.id,
    //         progress: ProgressTrackers.completed('onDelete'),
    //         consistency: 'committed',
    //         docMetaMutations: [
    //             {
    //                 fingerprint: docMetaFileRef.fingerprint,
    //                 // for deletes do not reference the DocInfo or the DocMeta
    //                 dataProvider: failureProvider,
    //                 docMetaProvider: failureProvider,
    //                 docInfoProvider: failureProvider,
    //                 docMetaFileRefProvider: async () => docMetaFileRef,
    //                 mutationType: 'deleted'
    //             }
    //
    //         ]
    //     };
    //
    //     this.docMetaSnapshotEventDispatcher.dispatchEvent(docMetaSnapshotEvent);
    //
    // }
    //
    // public onWrite(fingerprint: string, data: string, docInfo: IDocInfo): void {
    //
    //     const docMetaSnapshotEvent: DocMetaSnapshotEvent = {
    //         datastore: this.datastore.id,
    //         progress: ProgressTrackers.completed('onWrite'),
    //         consistency: 'committed',
    //         docMetaMutations: [
    //             {
    //                 fingerprint,
    //                 dataProvider: AsyncProviders.of(data),
    //                 docMetaProvider: async () => DocMetas.deserialize(data),
    //                 docInfoProvider: async () => docInfo,
    //                 docMetaFileRefProvider: async () => DocMetaFileRefs.createFromDocInfo(docInfo),
    //                 // TODO: we don't know right now if it's created or updated
    //                 // but for our uses I don't think it matters.
    //                 mutationType: 'updated'
    //             }
    //         ],
    //     };
    //
    //     this.docMetaSnapshotEventDispatcher.dispatchEvent(docMetaSnapshotEvent);
    //
    // }

    public addDocMetaSnapshotEventListener(docMetaSnapshotEventListener: DocMetaSnapshotEventListener) {
        this.docMetaSnapshotEventDispatcher.addEventListener(docMetaSnapshotEventListener);
    }

    public stop() {
        this.docMetaSnapshotEventDispatcher.clear();
    }

}
