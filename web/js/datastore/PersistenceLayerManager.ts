import {IEventDispatcher, SimpleReactor} from '../reactor/SimpleReactor';
import {RemotePersistenceLayerFactory} from './factories/RemotePersistenceLayerFactory';
import {CloudPersistenceLayerFactory} from "./factories/CloudPersistenceLayerFactory";
import {IProvider} from "polar-shared/src/util/Providers";
import {ListenablePersistenceLayer} from './ListenablePersistenceLayer';
import {Logger} from "polar-shared/src/logger/Logger";
import {RendererAnalytics} from '../ga/RendererAnalytics';
import {WebPersistenceLayerFactory} from './factories/WebPersistenceLayerFactory';
import {AppRuntime} from '../AppRuntime';
import {DatastoreInitOpts} from './Datastore';
import {Latch} from "polar-shared/src/util/Latch";

const log = Logger.create();

const RESET_KEY = 'polar-persistence-layer-reset';

export class PersistenceLayerManager implements IProvider<ListenablePersistenceLayer> {

    private readonly persistenceLayerManagerEventDispatcher: IEventDispatcher<PersistenceLayerManagerEvent> = new SimpleReactor();

    private persistenceLayer?: ListenablePersistenceLayer;

    /**
     * The current persistence type in place.
     */
    private current?: PersistenceLayerType;

    private initialized = new Latch<boolean>();

    constructor(private readonly opts?: DatastoreInitOpts) {

    }

    public async start(): Promise<void> {

        let type = PersistenceLayerTypes.get();

        if (this.requiresReset()) {

            log.info("Going go reset and deactivate current datastore: " + type);

            const deactivatePersistenceLayer = this.createPersistenceLayer(type);

            await deactivatePersistenceLayer.deactivate();

            this.clearReset();

            // now go with local
            type = 'local';
            PersistenceLayerTypes.set(type);

        }

        await this.change(type);
        this.initialized.resolve(true);

        // now we have to listen and auto-change if we've switched in another
        this.listenForPersistenceLayerChange();

    }

    public get(): ListenablePersistenceLayer {
        return this.persistenceLayer!;
    }

    /**
     * Get but waits for the first persistence layer to be initialized and after
     * that returns just the current one.
     */
    public async getAsync(): Promise<ListenablePersistenceLayer> {
        await this.initialized.get();
        return this.get();

    }

    public currentType(): PersistenceLayerType | undefined {
        return this.current;
    }

    /**
     * Change the persistence layer when needed. Return true when changed or
     * false if we're already using this type.
     * @param type
     */
    public async change(type: PersistenceLayerType) {

        if (AppRuntime.isBrowser() && this.persistenceLayer) {
            // TODO: this is a workaround for the browser.  We should ideally
            // support some type of class of datastores and (local and cloud)
            // and their actual implementation (remote, firebase, cloud-aware).
            // Then toggle on the actual implementation and only change it when
            // the impl changes.
            log.warn("Only 'web' persistence layers supported in browsers");
            return false;
        }

        if (this.current === type) {
            return false;
        }

        PersistenceLayerTypes.set(type);

        if (this.persistenceLayer) {

            log.info("Stopping persistence layer...");

            this.dispatchEvent({persistenceLayer: this.persistenceLayer, state: 'stopping'});

            // Create a backup first.  This only applies to the DiskDatastore
            // but this way we have a backup before we go online to the cloud
            // datastore so if it screws up files we're ok.
            await this.persistenceLayer.createBackup();

            await this.persistenceLayer.stop();

            log.info("Stopped persistence layer...");

            this.dispatchEvent({persistenceLayer: this.persistenceLayer, state: 'stopped'});

        }

        this.current = type;

        this.persistenceLayer = this.createPersistenceLayer(type);

        this.dispatchEvent({persistenceLayer: this.persistenceLayer, state: 'changed'});

        log.info("Changed to persistence layer: " + type);

        await this.persistenceLayer.init(err => {
            // noop
        }, this.opts);

        this.dispatchEvent({persistenceLayer: this.persistenceLayer, state: 'initialized'});

        log.info("Initialized persistence layer: " + type);

        RendererAnalytics.event({category: 'persistence-layer', action: 'changed-to-' + type});

        return true;

    }

    public reset() {
        log.info("Datastore reset");
        window.localStorage.setItem(RESET_KEY, 'true');
    }

    public requiresReset() {
        return window.localStorage.getItem(RESET_KEY) === 'true';
    }

    public clearReset() {
        return window.localStorage.removeItem(RESET_KEY);
    }

    private createPersistenceLayer(type: PersistenceLayerType): ListenablePersistenceLayer {

        if (AppRuntime.isBrowser()) {

            if (type !== 'web') {
                log.warn(`Only web type supported in browsers (requested type: ${type})`);
                type = 'web';
            }

        }

        if (type === 'web') {
            return WebPersistenceLayerFactory.create();
        }

        if (type === 'local') {
            return RemotePersistenceLayerFactory.create();
        }

        if (type === 'cloud') {
            return CloudPersistenceLayerFactory.create();
        }

        throw new Error("Unknown type: " + type);

    }

    public addEventListener(listener: PersistenceLayerManagerEventListener,
                            fireWithExisting?: 'changed' | 'initialized') {

        if (fireWithExisting && this.get()) {
            listener({persistenceLayer: this.get(), state: fireWithExisting});
        }

        return this.persistenceLayerManagerEventDispatcher.addEventListener(listener);
    }

    private dispatchEvent(event: PersistenceLayerManagerEvent): void {
        this.persistenceLayerManagerEventDispatcher.dispatchEvent(event);
    }

    private listenForPersistenceLayerChange() {

        const whenChanged = (callback: (type: PersistenceLayerType) => void) => {

            let type = PersistenceLayerTypes.get();

            window.addEventListener('storage', () => {

                const newType = PersistenceLayerTypes.get();

                if (newType !== type) {

                    try {

                        callback(newType);

                    } finally {
                        type = newType;
                    }

                }

            });

        };

        whenChanged((type) => {

            this.change(type)
                .catch(err => log.error("Unable to change to type: " + type));

        });

    }

}

export type PersistenceLayerType = 'local' | 'cloud' | 'web';

/**
 * The state of the persistence layer.
 *
 * The proceeding go in the following order and can not go back:
 *
 * - changed         - change to a new persistence layer which has been created
 *                     but not yet initialized.
 * - initialized     - init has been called.
 * - stopping        - about to call stop()
 * - stopped         - stopped
 *
 */
export type PersistenceLayerState = 'changed' | 'initialized' | 'stopping' | 'stopped';

export interface PersistenceLayerManagerEvent {

    readonly state: PersistenceLayerState;

    readonly persistenceLayer: ListenablePersistenceLayer;

}

export type PersistenceLayerManagerEventListener = (event: PersistenceLayerManagerEvent) => void;

export class PersistenceLayerTypes {

    private static readonly KEY = 'polar-persistence-layer';

    public static get(): PersistenceLayerType {

        if (AppRuntime.isBrowser()) {

            // we are ALWAYS using firebase when in the browser and there is no
            // other option.
            return 'web';
        }

        const currentType = window.localStorage.getItem(this.KEY);

        if (! currentType) {
            return 'local';
        }

        if (currentType === 'local' || currentType === 'cloud') {
            return currentType;
        }

        throw new Error("Unknown type: " + currentType);

    }

    public static set(type: PersistenceLayerType) {
        window.localStorage.setItem(this.KEY, type);
    }

}

