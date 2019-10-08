/**
 *
 */
import {Container} from '../../Container';
import {ContainerLifecycleListener} from '../ContainerLifecycleListener';
import {ContainerLifecycleState} from '../ContainerLifecycleState';
import {isPresent} from 'polar-shared/src/Preconditions';

/**
 * Listens to the lifecycle of .page
 */
export abstract class AbstractContainerLifecycleListener implements ContainerLifecycleListener {

    protected readonly container: Container;

    // TODO: type this.. not sure what it is yet.
    protected listener: any;

    protected constructor(container: Container) {
        this.container = container;
        this.listener = null;

    }

    register(callback: any) {

        this.listener = this._createListener(callback);

        let element = this.container.element;

        element.addEventListener('DOMNodeInserted', this.listener, false);

    }

    _createContainerLifecycleEvent(visible: boolean) {

        return new ContainerLifecycleState({
            container: this.container,
            visible
        });

    }

    _createListener(callback: (state: ContainerLifecycleState) => void ) {

        return (event: any) => {

            let containerLifecycleState = this.getStateFromEvent(event);

            if(isPresent(containerLifecycleState)) {
                callback(containerLifecycleState!);
            }

        }

    }

    abstract getStateFromEvent(event: any): ContainerLifecycleState | undefined;

    abstract getState(): ContainerLifecycleState | undefined;

    unregister() {

        this.container.element.removeEventListener('DOMNodeInserted', this.listener, false);
        this.listener = null;

    }

}
