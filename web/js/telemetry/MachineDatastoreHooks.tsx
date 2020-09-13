import {MachineDatastore} from "./MachineDatastores";
import {useFirestore} from "../../../apps/repository/js/FirestoreProvider";
import {MachineIDs} from "polar-shared/src/util/MachineIDs";
import * as firebase from 'firebase/app';
import {OnErrorCallback} from "polar-shared/src/util/Snapshots";
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;
import {useSnapshots} from "../ui/data_loader/UseSnapshotSubscriber";

export namespace MachineDatastoreHooks {

    const COLLECTION_NAME = "machine_datastore";

    function useCollectionRef() {

        const {firestore} = useFirestore();

        const id = MachineIDs.get();

        return firestore
            .collection(COLLECTION_NAME)
            .doc(id);

    }

    function toDoc(snapshot: DocumentSnapshot) {

        if (! snapshot.exists) {
            return;
        }

        return snapshot.data() as MachineDatastore;

    }

    /**
     * Callback for when we have new data for the account.
     */
    function useMachineDatastore() {

        const ref = useCollectionRef();

        return (onNext: (machineDatastore: MachineDatastore) => void,
                onError: OnErrorCallback = ERR_HANDLER) => {

            return ref.onSnapshot((snapshot: DocumentSnapshot) => {

                const doc = toDoc(snapshot);

                if (! doc) {
                    return;
                }

                onNext(doc);

            }, onError);

        }

    }

    export function useMachineDatastoreSnapshots() {
        const snapshotProvider = useMachineDatastore();
        return useSnapshots(snapshotProvider);
    }

    const ERR_HANDLER = (err: Error) => console.error("Error during snapshot: ", err);

}
