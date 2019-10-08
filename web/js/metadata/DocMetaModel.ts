/**
 *
 * Allows us to register events and listen for specific events on a given DocMeta.
 *
 */
import {DocMeta} from './DocMeta';
import {AnnotationEvent} from '../annotations/components/AnnotationEvent';
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";

export abstract class DocMetaModel {

    /**
     *
     * @param docMeta {DocMeta}
     * @param callback
     */
    public abstract registerListener(docMeta: IDocMeta, callback: (annotationEvent: AnnotationEvent) => void): void;

}
