import {DocFormatFactory} from '../docformat/DocFormatFactory';
import {Logger} from 'polar-shared/src/logger/Logger';
import {DocumentLoadedEvent, Model} from '../model/Model';
import {ContainerProvider} from './containers/providers/ContainerProvider';
import {Component} from './Component';
import {DocMetaModel} from '../metadata/DocMetaModel';
import {DocFormat} from '../docformat/DocFormat';
import {Preconditions} from 'polar-shared/src/Preconditions';
import {MutationState} from '../proxies/MutationState';
import {Container} from './containers/Container';
import {ContainerLifecycleState} from './containers/lifecycle/ContainerLifecycleState';
import {ContainerLifecycleListener} from './containers/lifecycle/ContainerLifecycleListener';
import {AnnotationEvent} from '../annotations/components/AnnotationEvent';
import {DocMeta} from "../metadata/DocMeta";
import {DocMetaListeners} from "../datastore/sharing/db/DocMetaListeners";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";

const log = Logger.create();

export class ComponentManager {

    private containerProvider: ContainerProvider;
    private docFormat: DocFormat;
    private readonly createComponent: () => Component;
    private readonly createDocMetaModel: () => DocMetaModel;
    private containers: { [key: number]: Container } = {};
    private components: { [key: string]: ComponentEntry } = {};

    /**
     *
     */
    constructor(private readonly type: string,
                private readonly model: Model,
                containerProvider: ContainerProvider,
                createComponent: () => Component,
                createDocMetaModel: () => DocMetaModel) {

        this.containerProvider = containerProvider;

        this.docFormat = DocFormatFactory.getInstance();

        this.createComponent = createComponent;

        this.createDocMetaModel = createDocMetaModel;

    }

    public start() {
        this.model.registerListenerForDocumentLoaded((documentLoadedEvent) => this.onDocumentLoaded(documentLoadedEvent));
    }

    private onDocumentLoaded(documentLoadedEvent: DocumentLoadedEvent) {

        log.debug("onDocumentLoaded: ", documentLoadedEvent.fingerprint);

        this.containers = this.containerProvider.getContainers();

        log.debug("Working with containers: ", this.containers);

        // Listen for changes from the model as objects are PRESENT or ABSENT
        // for the specific objects we're interested in and then call
        // onComponentEvent so that we can render/destroy the component and
        // and change it on page events.

        const {docMeta} = documentLoadedEvent;

        this.registerListenerForDocMeta(docMeta);

        // TODO: I think this is wrong and that we we should NOT call this here
        // and this is going to update too often.
        this.registerListenerForSecondaryDocMetas(docMeta.docInfo.fingerprint);

    }

    private registerListenerForDocMeta(docMeta: IDocMeta) {
        const docMetaModel = this.createDocMetaModel();
        docMetaModel.registerListener(docMeta, this.onComponentEvent.bind(this));
    }

    private registerListenerForSecondaryDocMetas(fingerprint: string) {

        const docMetaHandler = (docMeta: IDocMeta) => {
            this.registerListenerForDocMeta(docMeta);
        };

        const errHandler = (err: Error) => {
            log.error("Failed to handle docMeta group group: ", err);
        };

        DocMetaListeners.register(fingerprint, docMetaHandler, errHandler)
            .catch(err => errHandler(err));

    }

    private onComponentEvent(componentEvent: AnnotationEvent) {

        // TODO: I think it would be better to build up pageNum and pageElement
        // within AnnotationEvent - not here.  This should just be a ComponentEvent
        // and not know anything about annotations.

        log.debug("onComponentEvent: ", componentEvent);

        const containerID = componentEvent.pageMeta.pageInfo.num;

        Preconditions.assertNumber(containerID, "containerID");

        if (componentEvent.mutationState === MutationState.PRESENT) {

            log.debug("PRESENT");

            const container = this.containers[containerID];

            if (! container) {
                throw new Error("No container for containerID: " + containerID);
            }

            componentEvent.container = container;

            // let container = this.cont

            // create the component and call render on it...

            const component = this.createComponent();

            component.init(componentEvent);

            // FIXME: register the component with the container and ONLY call
            // he callback if and when the container is visible.

            const callback = (containerLifecycleState: ContainerLifecycleState) => {

                if (containerLifecycleState.visible) {

                    // now render the component on screen.
                    component.render();

                } else {
                    component.destroy();
                }

            };

            const containerLifecycleListener
                = this.containerProvider.createContainerLifecycleListener(container);

            containerLifecycleListener.register(callback);

            const containerState = containerLifecycleListener.getState();

            if (containerState && containerState.visible) {
                // draw it manually the first time.
                callback(containerState);
            }

            this.components[componentEvent.id] = new ComponentEntry(containerLifecycleListener, component);

        } else if (componentEvent.mutationState === MutationState.ABSENT) {

            log.debug("ABSENT");

            const componentEntry = this.components[componentEvent.id];

            if (componentEntry) {

                componentEntry.containerLifecycleListener.unregister();
                componentEntry.component.destroy();

                log.debug("Destroyed component: " + componentEvent.id);

                delete this.components[componentEvent.id];

            } else {
                log.warn("No component entry for: " + componentEvent.id);
            }

        }

    }

}

export class ComponentEntry {

    public readonly containerLifecycleListener: ContainerLifecycleListener;
    public readonly component: Component;

    /**
     */
    constructor(containerLifecycleListener: ContainerLifecycleListener, component: Component) {
        this.containerLifecycleListener = containerLifecycleListener;
        this.component = component;
    }

}
