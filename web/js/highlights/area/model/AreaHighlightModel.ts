import {DocMeta} from '../../../metadata/DocMeta';
import {DocMetaModel} from '../../../metadata/DocMetaModel';
import {ModelOpts, PageMetas} from '../../../metadata/PageMetas';
import {AnnotationEventListener} from '../../../annotations/components/AnnotationEventListener';
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";


export class AreaHighlightModel extends DocMetaModel {

    public registerListener(docMeta: IDocMeta, annotationEventListener: AnnotationEventListener, opts: ModelOpts = {}) {
        PageMetas.createModel(docMeta, "areaHighlights", annotationEventListener, opts);
        return annotationEventListener;
    }

}

