/**
 * Lightweight version of the PersistenceLayer without destructive methods
 * like start or change.
 */
import {ListenablePersistenceLayer} from './ListenablePersistenceLayer';
import {PersistenceLayerManagerEventListener} from './PersistenceLayerManager';

export interface PersistenceLayerHandler {

    get(): ListenablePersistenceLayer;

    addEventListener(listener: PersistenceLayerManagerEventListener,
                     fireWithExisting?: 'changed' | 'initialized'): void;

}

/**
 *
 *
 */
export class DefaultPersistenceLayerHandler implements PersistenceLayerHandler {

    constructor(private readonly persistenceLayer: ListenablePersistenceLayer) {

    }

    public addEventListener(listener: PersistenceLayerManagerEventListener,
                            fireWithExisting?: "changed" | "initialized"): void {

        if (! fireWithExisting || fireWithExisting === 'changed') {

            listener({
                         persistenceLayer: this.persistenceLayer,
                         state: 'changed'
                     });

        }

    }

    public get(): ListenablePersistenceLayer {
        return this.persistenceLayer;
    }

}

