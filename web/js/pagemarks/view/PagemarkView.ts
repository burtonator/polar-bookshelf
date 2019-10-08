
import {Model} from '../../model/Model';
import {ComponentManager} from '../../components/ComponentManager';
import {DefaultContainerProvider} from '../../components/containers/providers/impl/DefaultContainerProvider';
import {PagemarkModel} from '../model/PagemarkModel';
import {ThumbnailContainerProvider} from '../../components/containers/providers/impl/ThumbnailContainerProvider';
import {ProgressView} from './ProgressView';
import {PrimaryPagemarkComponent} from './components/PrimaryPagemarkComponent';
import {ThumbnailPagemarkComponent} from './components/ThumbnailPagemarkComponent';

export const PAGEMARK_VIEW_ENABLED = true;

export class PagemarkView {

    private readonly model: Model;

    private readonly primaryPagemarkComponentManager: ComponentManager;

    private readonly thumbnailPagemarkComponentManager: ComponentManager;

    private readonly progressView: ProgressView;

    constructor(model: Model) {

        this.model = model;

        this.primaryPagemarkComponentManager
            = new ComponentManager("pagemark",
                                   model,
                                   new DefaultContainerProvider(),
                                   () => new PrimaryPagemarkComponent(),
                                   () => new PagemarkModel());

        this.thumbnailPagemarkComponentManager
            = new ComponentManager("thumbnail",
                                   model,
                                   new ThumbnailContainerProvider(),
                                   () => new ThumbnailPagemarkComponent(),
                                   () => new PagemarkModel());


        this.progressView = new ProgressView(this.model);

    }

    public start() {

        if (this.primaryPagemarkComponentManager) {
            this.primaryPagemarkComponentManager.start();
        }

        if (this.thumbnailPagemarkComponentManager) {
            this.thumbnailPagemarkComponentManager.start();
        }

        this.progressView.start();

    }

}
