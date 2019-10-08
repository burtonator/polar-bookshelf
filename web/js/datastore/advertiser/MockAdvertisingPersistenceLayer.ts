import {PersistenceLayer, PersistenceLayerID} from '../PersistenceLayer';
import {ListenablePersistenceLayer} from '../ListenablePersistenceLayer';
import {AbstractAdvertisingPersistenceLayer} from './AbstractAdvertisingPersistenceLayer';
import {PersistenceLayerEvent} from '../PersistenceLayerEvent';

/**
 * A PersistenceLayer that allows the user to receive advertisements regarding
 * updates to the internal data.
 */
export class MockAdvertisingPersistenceLayer
    extends AbstractAdvertisingPersistenceLayer
    implements ListenablePersistenceLayer {

    public readonly id: PersistenceLayerID = 'mock';

    private readonly noDispatchEvent: boolean;

    constructor(persistenceLayer: PersistenceLayer, noDispatchEvent: boolean = false) {
        super(persistenceLayer);
        this.noDispatchEvent = noDispatchEvent;
    }

    public async init(): Promise<void> {
        // noop
    }

    public async stop(): Promise<void> {
        // noop
    }

    public broadcastEvent(event: PersistenceLayerEvent): void {

        if (this.noDispatchEvent) {
            return;
        }

        // NOTE that technically this violates our main contract that persistence
        // layers don't re-notify themselves.  I need to revisit this because
        // it might make sense to allow them to notify themselves but just be
        // careful or add another mode 'promiscuous' to see all events.  Maybe
        // to be safe by default but add another mode if necessary.
        this.dispatchEvent(event);
    }

}
