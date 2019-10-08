import {DocMetaModel} from '../metadata/DocMetaModel';
import {DocMeta} from '../metadata/DocMeta';
import {AnnotationEventListener} from '../annotations/components/AnnotationEventListener';
import {ModelOpts, PageMetas} from '../metadata/PageMetas';
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";

export class CommentModel extends DocMetaModel {

    public registerListener(docMeta: IDocMeta, annotationEventListener: AnnotationEventListener, opts: ModelOpts = {}) {
        PageMetas.createModel(docMeta, "comments", annotationEventListener, opts);
        return annotationEventListener;
    }

}
