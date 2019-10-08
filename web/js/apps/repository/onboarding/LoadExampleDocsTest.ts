import {PolarDataDir} from '../../../test/PolarDataDir';
import {DiskDatastore} from '../../../datastore/DiskDatastore';
import {LoadExampleDocs} from './LoadExampleDocs';
import {AppPath} from '../../../electron/app_path/AppPath';
import {FilePaths} from 'polar-shared/src/util/FilePaths';
import {DefaultPersistenceLayer} from '../../../datastore/DefaultPersistenceLayer';

describe('LoadExampleDocs', function() {

    beforeEach(async function() {

        AppPath.set(FilePaths.resolve(FilePaths.join(__dirname, "..", "..", "..", "..", "..")));
        await PolarDataDir.useFreshDirectory('.load-example-docs');

        console.log("Using app path: " + AppPath.get());

    });

    it("load basic data", async function() {

        const persistenceLayer = new DefaultPersistenceLayer(new DiskDatastore());
        const loader = new LoadExampleDocs(persistenceLayer);

        await loader.load(docInfo => {
            console.log("Loaded: ", docInfo);
        });

    });

});

