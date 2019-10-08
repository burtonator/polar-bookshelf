import {ComponentManager} from '../../../components/ComponentManager';
import {DefaultContainerProvider} from '../../../components/containers/providers/impl/DefaultContainerProvider';
import {Model} from '../../../model/Model';
import {AreaHighlightComponent} from './components/AreaHighlightComponent';
import {AreaHighlightModel} from '../model/AreaHighlightModel';

export class AreaHighlightView {

    private componentManager: ComponentManager;

    /**
     */
    constructor(model: Model) {

        this.componentManager = new ComponentManager("area-highlight",
                                                     model,
                                                     new DefaultContainerProvider(),
                                                     () => new AreaHighlightComponent(model.persistenceLayerProvider),
                                                     () => new AreaHighlightModel());

    }

    public start() {
        this.componentManager.start();
    }

}
