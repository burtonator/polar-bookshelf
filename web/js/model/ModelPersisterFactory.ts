import {DocMeta} from '../metadata/DocMeta';
import {ModelPersister} from './ModelPersister';
import {PersistenceLayerHandler} from '../datastore/PersistenceLayerHandler';
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";

export class ModelPersisterFactory {

    constructor(private readonly persistenceLayerHandler: PersistenceLayerHandler) {
    }

    /**
     * Initialize a new persistent Model.
     */
    public create(docMeta: IDocMeta): ModelPersister {
        return new ModelPersister(this.persistenceLayerHandler, docMeta);
    }

}

