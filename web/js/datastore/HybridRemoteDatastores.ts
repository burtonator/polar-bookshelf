import {Datastore} from './Datastore';
import {HybridRemoteDatastore} from './HybridRemoteDatastore';
import {RemoteDatastores} from './RemoteDatastores';
import {DataFileCacheDatastore} from './DataFileCacheDatastore';

export class HybridRemoteDatastores {

    public static create() {
        const datastore: Datastore = RemoteDatastores.create();
        return new DataFileCacheDatastore(new HybridRemoteDatastore(datastore));
    }

}
