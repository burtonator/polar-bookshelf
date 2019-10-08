import {DelegatedPersistenceLayer} from './DelegatedPersistenceLayer';
import {ListenablePersistenceLayer} from './ListenablePersistenceLayer';
import {PersistenceLayerListener} from './PersistenceLayerListener';

/**
 * A PersistenceLayer that just forwards events to the given delegate.
 */
export class DelegatedListenablePersistenceLayer extends DelegatedPersistenceLayer implements ListenablePersistenceLayer {

    public readonly id = 'delegated-listenable';

    private readonly listenablePersistenceLayer: ListenablePersistenceLayer;

    constructor(listenablePersistenceLayer: ListenablePersistenceLayer) {
        super(listenablePersistenceLayer);
        this.listenablePersistenceLayer = listenablePersistenceLayer;
    }

    public addEventListener(listener: PersistenceLayerListener) {
        return this.listenablePersistenceLayer.addEventListener(listener);
    }

    public addEventListenerForDoc(fingerprint: string, listener: PersistenceLayerListener): void {
        this.listenablePersistenceLayer.addEventListenerForDoc(fingerprint, listener);
    }

}
