import {LoadDocRequest} from './LoadDocRequest';
import {Preconditions} from 'polar-shared/src/Preconditions';
import {DistRuntime} from '../../../dist_runtime/DistRuntime';
import {ElectronDocLoader} from './electron/ElectronDocLoader';
import {BrowserDocLoader} from './browser/BrowserDocLoader';
import {IProvider} from 'polar-shared/src/util/Providers';
import {PersistenceLayer} from '../../../datastore/PersistenceLayer';
import {IDocLoader, IDocLoadRequest} from './IDocLoader';

export class DocLoader implements IDocLoader {

    private readonly persistenceLayerProvider: IProvider<PersistenceLayer>;

    private readonly electronDocLoader: ElectronDocLoader;
    private readonly browserDocLoader: BrowserDocLoader;

    constructor(persistenceLayerProvider: IProvider<PersistenceLayer>) {
        this.persistenceLayerProvider = persistenceLayerProvider;
        this.electronDocLoader = new ElectronDocLoader(persistenceLayerProvider);
        this.browserDocLoader = new BrowserDocLoader(persistenceLayerProvider);
    }

    public create(loadDocRequest: LoadDocRequest): IDocLoadRequest {

        if (DistRuntime.get() === 'electron') {
            return this.electronDocLoader.create(loadDocRequest);
        } else {
            return this.browserDocLoader.create(loadDocRequest);
        }

    }

}
