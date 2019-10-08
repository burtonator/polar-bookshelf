import {MachineID} from '../util/MachineIDs';
import {MachineIDs} from '../util/MachineIDs';
import {PersistenceLayerManager} from '../datastore/PersistenceLayerManager';
import {PersistenceLayerType} from '../datastore/PersistenceLayerManager';
import {AppRuntime} from '../AppRuntime';
import {Directories} from '../datastore/Directories';
import {Files} from 'polar-shared/src/util/Files';
import {Firestore} from '../firebase/Firestore';
import {ISODateTimeString} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {ISODateTimeStrings} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {Executors} from '../util/Executors';
import {Logger} from 'polar-shared/src/logger/Logger';
import * as firebase from '../firebase/lib/firebase';
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;

const log = Logger.create();

/**
 * Computes and stores stats for each machine's datastore.
 */
export class MachineDatastores {

    private static COLLECTION_NAME = "machine_datastore";

    public static async ref() {

        const firestore = await Firestore.getInstance();

        const id = MachineIDs.get();

        const ref = firestore
            .collection(this.COLLECTION_NAME)
            .doc(id);

        return ref;

    }

    public static async get() {

        const ref = await this.ref();
        const snapshot = await ref.get();
        return this.toDoc(snapshot);

    }

    private static toDoc(snapshot: DocumentSnapshot) {

        if (! snapshot.exists) {
            return;
        }

        return <MachineDatastore> snapshot.data();

    }

    /**
     * Callback for when we have new data for the account.
     */
    public static async onSnapshot(handler: (machineDatastore: MachineDatastore) => void) {

        const ref = await this.ref();

        return ref.onSnapshot(snapshot => {

            const doc = this.toDoc(snapshot);

            if (! doc) {
                return;
            }

            handler(doc);

        }, ERR_HANDLER);

    }

    public static triggerBackgroundUpdates(persistenceLayerManager: PersistenceLayerManager) {

        if (AppRuntime.isElectron()) {

            log.debug("Triggering background updates");

            // right now this only works on the desktop version as the web
            // version doesn't really support the features we would start
            // charging for

            Executors.runPeriodically({initialDelay: '5m', interval: '1d'}, () => {
                this.doBackgroundUpdate(persistenceLayerManager)
                    .catch(err => log.error("Unable to compute machine datastore stats: ", err));
            });

        }

    }

    private static async doBackgroundUpdate(persistenceLayerManager: PersistenceLayerManager) {

        const machineDatastore = await this.calculate(persistenceLayerManager);

        if (machineDatastore) {
            await this.write(machineDatastore);
        }

    }

    public static async write(machineDatastore: MachineDatastore) {

        const firestore = await Firestore.getInstance();

        const id = machineDatastore.machine;

        const ref = firestore.collection(this.COLLECTION_NAME).doc(id);

        await ref.set(machineDatastore);

    }

    public static async calculate(persistenceLayerManager: PersistenceLayerManager): Promise<MachineDatastore | undefined> {

        log.debug("Calculating machine datastore stats...");

        const persistenceLayer = await persistenceLayerManager.getAsync();

        const persistenceLayerType = persistenceLayerManager.currentType();
        const machine = MachineIDs.get();
        const docMetaRefs = await persistenceLayer.getDocMetaRefs();

        const nrDocs = docMetaRefs.length;
        let nrCaptures = 0;
        let storageInBytes = 0;

        const directories = new Directories();

        await Files.recursively(directories.dataDir, async (path, stats) => {

            if (path.indexOf(".backup-") !== -1) {
                // this is part of a snapshot so this is invalid.
                return;
            }

            if (path.endsWith(".phz")) {
                ++nrCaptures;
            }

            storageInBytes += stats.size;

        });

        const written = ISODateTimeStrings.create();

        const machineDatastore = {
            persistenceLayerType,
            machine,
            nrDocs,
            nrCaptures,
            storageInBytes,
            written
        };

        log.debug("Calculated final machine datastore stats: ", machineDatastore);

        return machineDatastore;

    }


}

export interface MachineDatastore {

    readonly persistenceLayerType?: PersistenceLayerType;

    readonly machine: MachineID;

    readonly nrDocs: number;

    readonly nrCaptures: number;

    readonly storageInBytes: number;

    readonly written: ISODateTimeString;

    // readonly datastoreCreated: ISODateTimeString;

}

const ERR_HANDLER = (err: Error) => console.error("Could not create snapshot for account: ", err);

