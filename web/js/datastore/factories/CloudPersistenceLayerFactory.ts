import {Logger} from 'polar-shared/src/logger/Logger';
import {ListenablePersistenceLayer} from '../ListenablePersistenceLayer';
import {DefaultPersistenceLayer} from '../DefaultPersistenceLayer';
import {AdvertisingPersistenceLayer} from '../advertiser/AdvertisingPersistenceLayer';
import {CloudAwareDatastore} from '../CloudAwareDatastore';
import {FirebaseDatastore} from '../FirebaseDatastore';
import {HybridRemoteDatastores} from '../HybridRemoteDatastores';
import {TracedDatastore} from '../TracedDatastore';

const log = Logger.create();

export class CloudPersistenceLayerFactory {

    public static create(): ListenablePersistenceLayer {

        log.info("Using remote persistence layer and cloud aware data store");

        const local = HybridRemoteDatastores.create();

        const cloud = new TracedDatastore(new FirebaseDatastore(), 'traced-firebase');

        const datastore = new CloudAwareDatastore(local, cloud);

        const defaultPersistenceLayer = new DefaultPersistenceLayer(datastore);

        const advertisingPersistenceLayer = new AdvertisingPersistenceLayer(defaultPersistenceLayer);

        return advertisingPersistenceLayer;

    }

}
