import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {
    SubscriptionValue,
    useSnapshotSubscriber
} from "../../../../web/js/ui/data_loader/UseSnapshotSubscriber";
import {PersistentPrefs} from "../../../../web/js/util/prefs/Prefs";
import {usePersistenceLayerContext} from "./PersistenceLayerApp";
import {SnapshotSubscriber} from 'polar-shared/src/util/Snapshots';
import {ListenablePersistenceLayerProvider} from "../../../../web/js/datastore/PersistenceLayer";


export function usePrefs(persistenceLayerProvider: ListenablePersistenceLayerProvider | undefined = undefined): SubscriptionValue<PersistentPrefs> {

  if (persistenceLayerProvider !== undefined) {
    console.warn("not undefined");
  console.warn(persistenceLayerProvider());
  }
    const provider = persistenceLayerProvider || usePersistenceLayerContext().persistenceLayerProvider;

    const createSubscription = (): SnapshotSubscriber<PersistentPrefs> => {

        const persistenceLayer = provider()

        if (!persistenceLayer) {
            console.warn("No persistence layer");
            return () => NULL_FUNCTION;
        }

        const datastore = persistenceLayer.datastore;
        const prefs = datastore.getPrefs();

        if (! prefs) {
            // this should never happen in practice but is just defensive coding
            throw new Error("No prefs found from datastore: " + datastore.id);
        }

        if (!prefs.subscribe || !prefs.get) {
            throw new Error("Prefs is missing subscribe|get function(s) from datastore: " + datastore.id);
        }

        // the onNext function will be called in the snapshot subscriber so that
        // we can receive future values and it also handles unsubscribe on
        // component unmount
        return prefs.subscribe.bind(prefs);

    }

    return useSnapshotSubscriber({id: 'none', subscribe: createSubscription()});

}
