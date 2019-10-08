import {Backend} from "polar-shared/src/datastore/Backend";
import {GetFileOpts} from "./Datastore";
import {DocFileMeta} from "./DocFileMeta";
import {PersistenceLayerProvider} from "./PersistenceLayer";
import {FileRef} from "polar-shared/src/datastore/FileRef";

/**
 * Create resolvers that can lookup doc meta rather than providing a full
 * PersistenceLayer to make it easier for testing.
 */
export class DocFileResolvers {

    public static createForPersistenceLayer(persistenceLayerProvider: PersistenceLayerProvider) {

        return (backend: Backend, ref: FileRef, opts?: GetFileOpts): DocFileMeta => {
            const persistenceLayer = persistenceLayerProvider();
            return persistenceLayer.getFile(backend, ref, opts);
        };

    }

}


export type DocFileResolver = (backend: Backend, ref: FileRef, opts?: GetFileOpts) => DocFileMeta;

