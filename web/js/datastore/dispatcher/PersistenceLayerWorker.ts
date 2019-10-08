import {IPCMessage} from '../../ipc/handler/IPCMessage';
import {Logger} from 'polar-shared/src/logger/Logger';
import {RemotePersistenceLayerFactory} from '../factories/RemotePersistenceLayerFactory';

const log = Logger.create();
//
declare var process: any;
//
declare var exports: any;
//
// exports = {};
//
process.dlopen = () => {
    throw new Error('Load native module is not safe');
};

RemotePersistenceLayerFactory.create();

// class PersistenceLayerWorker {
//
//     private readonly persistenceLayer: PersistenceLayer;
//
//     constructor() {
//         this.persistenceLayer = ElectronPersistenceLayerFactory.create();
//     }
//
//     async sync(docMetaWrite: DocMetaSync) {
//         //await this.persistenceLayer.sync(docMetaWrite.fingerprint, docMetaWrite.docMeta);
//     }
//
// }
//
// let persistenceLayerWorker = new PersistenceLayerWorker();
//
addEventListener('message', (messageEvent) => {

    const ipcMessage: IPCMessage<any> = messageEvent.data;

    if (ipcMessage.type === 'sync') {

        // persistenceLayerWorker.sync(messageEvent.data)
        //     .catch(err => log.error("Unable to write docMeta: ", err))

    } else {
        throw new Error("Unhandled message: " + ipcMessage.type);
    }

});
