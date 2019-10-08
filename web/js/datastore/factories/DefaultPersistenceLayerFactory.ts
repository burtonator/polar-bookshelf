import {DefaultPersistenceLayer} from '../DefaultPersistenceLayer';
import {Logger} from 'polar-shared/src/logger/Logger';
import {Datastores} from '../Datastores';
import {AdvertisingPersistenceLayer} from '../advertiser/AdvertisingPersistenceLayer';
import {ListenablePersistenceLayer} from '../ListenablePersistenceLayer';

const log = Logger.create();

/**
 * Persistence layer without going through the main process for added throughput
 * and lower IPC but requires node integration.
 */
export class DefaultPersistenceLayerFactory {

    public static async create(): Promise<ListenablePersistenceLayer> {

        log.info("Using persistence layer from renderer process.");

        const datastore = Datastores.create();
        await datastore.init();

        const defaultPersistenceLayer = new DefaultPersistenceLayer(datastore);
        const advertisingPersistenceLayer = new AdvertisingPersistenceLayer(defaultPersistenceLayer);

        // note that we need to always pre-init before we return.
        await advertisingPersistenceLayer.init();

        return advertisingPersistenceLayer;

    }

}
