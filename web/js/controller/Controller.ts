import {Model} from '../model/Model';
import {Preconditions} from 'polar-shared/src/Preconditions';
import {Logger} from 'polar-shared/src/logger/Logger';
import {DocDetails} from '../metadata/DocDetails';
import {DocDetail} from '../metadata/DocDetail';

const log = Logger.create();

export class Controller {

    protected model: Model;

    /**
     *
     */
    constructor(model: Model) {
        this.model = Preconditions.assertNotNull(model, "model");
    }

    /**
     * Called when a new document has been loaded.
     */
    public async onDocumentLoaded(fingerprint: string,
                                  nrPages: number,
                                  currentlySelectedPageNum: number,
                                  docDetail: DocDetail | undefined) {

        await this.model.documentLoaded(fingerprint, nrPages, currentlySelectedPageNum, docDetail);

    }

    /**
     * Mark the given page number as read.
     */
    public async createPagemark(pageNum: number, options: any = {}) {
        log.info("Controller sees pagemark created: " + pageNum, options);
        await this.model.createPagemark(pageNum, options);
    }

    public erasePagemarks(pageNum: number) {
        log.info("Controller sees pagemarks erased: " + pageNum);
        this.model.erasePagemark(pageNum);
    }

    /**
     * Mark the given page number as read.
     */
    public erasePagemark(num: number) {
        log.info("Controller sees pagemark erased: " + num);
        this.model.erasePagemark(num);
    }

    public getCurrentPageElement() {

    }

}
