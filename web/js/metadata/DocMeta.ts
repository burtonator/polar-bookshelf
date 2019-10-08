import {DocInfo} from './DocInfo';
import {SerializedObject} from './SerializedObject';
import {Preconditions} from 'polar-shared/src/Preconditions';
import {AnnotationInfos} from './AnnotationInfos';
import {Attachment} from './Attachment';
import {IPageMeta} from "polar-shared/src/metadata/IPageMeta";
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";


/**
 * Root metadata for a document including page metadata, and metadata for
 * the specific document.
 */
export class DocMeta extends SerializedObject implements IDocMeta {

    public docInfo: IDocInfo;
    public pageMetas: {[id: string]: IPageMeta};
    public annotationInfo = AnnotationInfos.create();
    public version = 2;

    public attachments: {[id: string]: Attachment} = {};

    // constructor(template?: IDocMeta) {
    //
    //     super(template);
    //
    //     if(template) {
    //         this.docInfo = Preconditions.assertNotNull(template.docInfo, "docInfo");
    //     } else {
    //         this.docInfo = null;
    //     }
    //
    //     this.init(template);
    //
    // }

    constructor(docInfo: IDocInfo, pageMetas: {[id: number]: IPageMeta}) {
        super();
        this.docInfo = docInfo;
        this.pageMetas = pageMetas;
    }

    public getPageMeta(num: number) {

        num = Preconditions.assertPresent(num, "num");

        const pageMeta = this.pageMetas[num];

        if (!pageMeta) {
            throw new Error("No pageMeta for page: " + num);
        }

        return pageMeta;

    }

    public validate() {
        Preconditions.assertInstanceOf(this.docInfo, DocInfo, "docInfo");
        Preconditions.assertPresent(this.pageMetas, "pageMetas");
        Preconditions.assertNumber(this.version, "version");
    }

}



