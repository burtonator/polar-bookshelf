import {ipcRenderer} from 'electron';
import {DocInfoAdvertisement, DocInfoAdvertisementListener} from './DocInfoAdvertisement';
import {Logger} from 'polar-shared/src/logger/Logger';
import {SimpleReactor} from '../../reactor/SimpleReactor';

const log = Logger.create();

export class DocInfoAdvertisementListenerService {

    private readonly reactor: SimpleReactor<DocInfoAdvertisement> = new SimpleReactor();

    private listener: (event: any, docInfoAdvertisement: DocInfoAdvertisement) => void;

    constructor() {
        this.listener = this.onDocInfoAdvertisement.bind(this);
    }

    public start(): void {
        ipcRenderer.on('doc-info-advertisement', this.listener);
    }

    public stop(): void {
        ipcRenderer.removeListener('doc-info-advertisement', this.listener);
    }

    private onDocInfoAdvertisement(event: any, docInfoAdvertisement: DocInfoAdvertisement) {
        log.debug("Received new DocInfo advertisement: ", docInfoAdvertisement);
        this.reactor.dispatchEvent(docInfoAdvertisement);
    }

    public addEventListener(docInfoAdvertisementListener: DocInfoAdvertisementListener): void {
        this.reactor.addEventListener(docInfoAdvertisementListener);
    }

}
