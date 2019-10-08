import {ContainerProvider} from '../ContainerProvider';
import {DefaultContainerLifecycleListener} from '../../lifecycle/impl/DefaultContainerLifecycleListener';
import {Container} from '../../Container';


export class DefaultContainerProvider extends ContainerProvider {

    public getContainers() {
        return super._getContainers(".page");
    }

    public createContainerLifecycleListener(container: Container) {
        return new DefaultContainerLifecycleListener(container);
    }

}
