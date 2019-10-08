import {DocFileMeta} from './DocFileMeta';
import {Backend} from 'polar-shared/src/datastore/Backend';
import {DocFileURLMeta} from './DocFileMeta';
import {GetFileOpts} from './Datastore';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {Logger} from 'polar-shared/src/logger/Logger';
import {FileRef} from "polar-shared/src/datastore/FileRef";

const log = Logger.create();

/**
 * A simple cache so that we can immediately make the blob ref available locally
 * even though it has NOT been written to the datastore yet to avoid latency
 * when the data is already local. We might want to think about using the
 * browser caches API in the future instead of forcing this into memory but
 * honestly this should be impossible for a user to cause the browser to run
 * out of memory just with their annotations.
 */
export class DatastoreFileCache {

    private static readonly backing: {[key: string]: DocFileMeta} = {};

    public static writeFile(backend: Backend, ref: FileRef, meta: DocFileURLMeta) {
        const key = this.toKey(backend, ref);
        this.backing[key] = {...meta, backend, ref};
    }

    public static getFile(backend: Backend, ref: FileRef, opts?: GetFileOpts): Optional<DocFileMeta> {
        const key = this.toKey(backend, ref);
        const entry = this.backing[key];

        const status = entry ? 'hit' : 'miss';

        log.debug("DatastoreFileCache status: " + status);

        return Optional.of(entry);
    }

    public static evictFile(backend: Backend, ref: FileRef) {
        const key = this.toKey(backend, ref);
        delete this.backing[key];
    }

    private static toKey(backend: Backend, ref: FileRef) {
        return `${backend}:${ref.name}`;
    }

}
