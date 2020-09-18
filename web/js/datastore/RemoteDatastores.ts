import {remote} from 'electron';
import {RemoteDatastore} from './RemoteDatastore';
import {DiskDatastore} from './DiskDatastore';

export namespace RemoteDatastores {

    export function create() {
        const datastore: DiskDatastore = remote.getGlobal("datastore" );
        return new RemoteDatastore(datastore);
    }

}
