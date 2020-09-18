import {remote} from 'electron';
import {RemoteDatastore} from './RemoteDatastore';
import {DiskDatastore} from './DiskDatastore';

export class RemoteDatastores {

    public static create() {

        const datastore: DiskDatastore = remote.getGlobal("datastore" );
        return new RemoteDatastore(datastore);

    }
}
