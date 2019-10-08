import {DocMeta} from '../../metadata/DocMeta';
import {DocMetaModel} from '../../metadata/DocMetaModel';
import {PageMetas} from '../../metadata/PageMetas';
import {AnnotationEvent} from '../../annotations/components/AnnotationEvent';
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";

/**
 *
 */
export class PagemarkModel extends DocMetaModel {

    public registerListener(docMeta: IDocMeta, callback: (componentEvent: AnnotationEvent) => void) {
        PageMetas.createModel(docMeta, "pagemarks", callback);
    }

}
