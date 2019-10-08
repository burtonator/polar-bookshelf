import {Datastore, DatastoreID, ErrorListener, InitResult} from './Datastore';
import {BinaryFileData} from './Datastore';
import {WriteFileOpts} from './Datastore';
import {isBinaryFileData} from './Datastore';
import {GetFileOpts} from './Datastore';
import {DocMetaRef} from './DocMetaRef';
import {DiskDatastore} from './DiskDatastore';
import {RemoteDatastore} from './RemoteDatastore';
import {Backend} from 'polar-shared/src/datastore/Backend';
import {DocFileMeta} from './DocFileMeta';
import {Blobs} from 'polar-shared/src/util/Blobs';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {Logger} from 'polar-shared/src/logger/Logger';
import {DatastoreFileCache} from './DatastoreFileCache';
import {DelegatedDatastore} from './DelegatedDatastore';
import {FileRef} from "polar-shared/src/datastore/FileRef";

const log = Logger.create();

/**
 * Basic delegated datastore so that we can resolve files form the local file
 * cache before going to the network version.
 */
export class DataFileCacheDatastore extends DelegatedDatastore {

    constructor(delegate: Datastore) {
        super(delegate);
    }

    public getFile(backend: Backend, ref: FileRef, opts?: GetFileOpts): DocFileMeta {

        const hit = DatastoreFileCache.getFile(backend, ref);

        if (hit.isPresent()) {
            log.debug("Found file in datastore cache: ", {backend, ref});
            return hit.get();
        }

        return super.getFile(backend, ref, opts);

    }

    public async deleteFile(backend: Backend, ref: FileRef): Promise<void> {
        DatastoreFileCache.evictFile(backend, ref);
        return super.deleteFile(backend, ref);
    }

}

