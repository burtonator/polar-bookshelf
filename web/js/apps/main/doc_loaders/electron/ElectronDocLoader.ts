import {ElectronIPCPipe} from '../../../../ipc/handler/ElectronIPCPipe';
import {ElectronRendererPipe} from '../../../../ipc/pipes/ElectronRendererPipe';
import {IPCClient} from '../../../../ipc/handler/IPCClient';
import {LoadDocRequest} from '../LoadDocRequest';
import {Preconditions} from 'polar-shared/src/Preconditions';
import {IProvider} from 'polar-shared/src/util/Providers';
import {PersistenceLayer} from '../../../../datastore/PersistenceLayer';
import {IDocLoader, IDocLoadRequest} from '../IDocLoader';

const ipcPipe = new ElectronIPCPipe(new ElectronRendererPipe());
const ipcClient = new IPCClient(ipcPipe);

export class ElectronDocLoader implements IDocLoader {

    private readonly persistenceLayerProvider: IProvider<PersistenceLayer>;

    constructor(persistenceLayerProvider: IProvider<PersistenceLayer>) {
        this.persistenceLayerProvider = persistenceLayerProvider;
    }

    public create(loadDocRequest: LoadDocRequest): IDocLoadRequest {

        return {

            async load(): Promise<void> {

                Preconditions.assertPresent(loadDocRequest.fingerprint, "fingerprint");
                Preconditions.assertPresent(loadDocRequest.backendFileRef, "backendFileRef");
                Preconditions.assertPresent(loadDocRequest.backendFileRef.name, "backendFileRef.name");

                await ipcClient.execute('/main/load-doc', loadDocRequest);

            }

        };

    }

}

