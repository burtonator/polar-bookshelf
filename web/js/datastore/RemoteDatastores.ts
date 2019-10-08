import {remote} from 'electron';
import {DelegatedDatastore} from './DelegatedDatastore';
import {Datastore} from './Datastore';
import {RemoteDatastore} from './RemoteDatastore';
import {DiskDatastore} from './DiskDatastore';

export class RemoteDatastores {

    public static create() {

        const datastore: DiskDatastore = remote.getGlobal("datastore" );
        return new RemoteDatastore(datastore);

    }
}
