import {
    PersistenceLayerManager,
    PersistenceLayerType
} from '../datastore/PersistenceLayerManager';
import {Firestore} from '../firebase/Firestore';
import {
    ISODateTimeString,
    ISODateTimeStrings
} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {Executors} from '../util/Executors';
import {Logger} from 'polar-shared/src/logger/Logger';
import * as firebase from 'firebase/app';
import {MachineID, MachineIDs} from "polar-shared/src/util/MachineIDs";
import {AppRuntime} from "polar-shared/src/util/AppRuntime";
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
    public static async onSnapshot(onNext: (machineDatastore: MachineDatastore) => void) {

        const ref = await this.ref();

        return ref.onSnapshot(snapshot => {

            const doc = this.toDoc(snapshot);

            if (! doc) {
                return;
            }

            onNext(doc);

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

