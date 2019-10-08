import {ResourcePaths} from '../../electron/webresource/ResourcePaths';

export class PersistenceLayerWorkers {

    public static create(): Worker {

        let url = ResourcePaths.resourceURLFromRelativeURL("./web/js/datastore/dispatcher/PersistenceLayerWorker.js")

        return new Worker(url);
    }

}
