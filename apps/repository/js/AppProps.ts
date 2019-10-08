import {ListenablePersistenceLayer} from '../../../web/js/datastore/ListenablePersistenceLayer';

/**
 * Create a new PeristenceLayer. Note that this must NOT be initialized becuase
 * we may want to add event listeners.
 */
export type PersistenceLayerFactory = () => ListenablePersistenceLayer;
