import {SpectronRenderer, SpectronRendererState} from '../../js/test/SpectronRenderer';
import {Firebase} from '../../js/firebase/Firebase';
import {FirebaseUIAuth} from '../../js/firebase/FirebaseUIAuth';
import * as firebase from '../../js/firebase/lib/firebase';
import {Elements} from '../../js/util/Elements';
import {DiskDatastore} from '../../js/datastore/DiskDatastore';
import {DefaultPersistenceLayer} from '../../js/datastore/DefaultPersistenceLayer';
import {MockDocMetas} from '../../js/metadata/DocMetas';
import {assert} from "chai";
import {DatastoreTester} from '../../js/datastore/DatastoreTester';
import {Firestore} from '../../js/firebase/Firestore';
import {Hashcodes} from 'polar-shared/src/util/Hashcodes';
import {Promises} from '../../js/util/Promises';
import {FirebaseDatastore} from '../../js/datastore/FirebaseDatastore';
import {ElectronDocLoader} from '../../js/apps/main/doc_loaders/electron/ElectronDocLoader';
import {FirebaseTestRunner} from '../../js/firebase/FirebaseTestRunner';
import {DefaultDatastoreMutation} from '../../js/datastore/DatastoreMutation';
import {DocInfo} from '../../js/metadata/DocInfo';
import {PersistenceLayerWorkers} from '../../js/datastore/dispatcher/PersistenceLayerWorkers';
import {PersistenceLayer} from '../../js/datastore/PersistenceLayer';
import {Datastores} from '../../js/datastore/Datastores';
import waitForExpect from 'wait-for-expect';
import {BrowserWindowRegistry} from '../../js/electron/framework/BrowserWindowRegistry';
import {PersistenceLayers, SyncOrigin} from '../../js/datastore/PersistenceLayers';
import {CloudAwareDatastore} from '../../js/datastore/CloudAwareDatastore';
import {ProgressTracker} from '../../js/util/ProgressTracker';
import {ProgressBar} from '../../js/ui/progress_bar/ProgressBar';
import {Logging} from '../../js/logger/Logging';
import {Latch} from "polar-shared/src/util/Latch";

Logging.initForTesting();

SpectronRenderer.run(async (state) => {

    new FirebaseTestRunner(state).run(async () => {

        async function purgeFirebase() {

            const firebaseDatastore = new FirebaseDatastore();

            await firebaseDatastore.init();

            console.log("Purging...");

            await Datastores.purge(firebaseDatastore, purgeEvent => {
                console.log("Purged: ", purgeEvent);
            });

            console.log("Purging...done");

        }

        await purgeFirebase();

    }).catch(err => console.error(err));

});
