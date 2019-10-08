import {DocMetaModel} from '../metadata/DocMetaModel';
import {DocMeta} from '../metadata/DocMeta';
import {AnnotationEventListener} from '../annotations/components/AnnotationEventListener';
import {ModelOpts, PageMetas} from '../metadata/PageMetas';
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";

export class FlashcardModel extends DocMetaModel {

    public registerListener(docMeta: IDocMeta, annotationEventListener: AnnotationEventListener, opts: ModelOpts = {}) {
        PageMetas.createModel(docMeta, "flashcards", annotationEventListener, opts);
        return annotationEventListener;
    }

}
