import {DocMeta} from '../metadata/DocMeta';
import {Pagemarks} from '../metadata/Pagemarks';
import {DocMetas} from "../metadata/DocMetas";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";

export class CreatePagemarksForPageRanges {

    private readonly docMeta: IDocMeta;

    constructor(docMeta: IDocMeta) {
        this.docMeta = docMeta;
    }

    public execute(options: any) {

        if (! options) {
            options = {};
        }

        for (let pageNum = options.range.start; pageNum < options.range.end; pageNum++) {

            console.log("Creating pagemark for page: " + pageNum);

            const pageMeta = DocMetas.getPageMeta(this.docMeta, pageNum);

            const pagemark = Pagemarks.create();

            Pagemarks.updatePagemark(this.docMeta, pageNum, pagemark);

        }

    }

}
