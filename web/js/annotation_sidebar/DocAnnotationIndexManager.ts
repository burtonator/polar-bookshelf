import {DefaultDocAnnotation, IDocAnnotation} from "./DocAnnotation";
import {DocAnnotationIndex, IDString} from "./DocAnnotationIndex";
import {DocAnnotations} from "./DocAnnotations";
import {DocMeta} from "../metadata/DocMeta";
import {AreaHighlightModel} from "../highlights/area/model/AreaHighlightModel";
import {AreaHighlight} from "../metadata/AreaHighlight";
import {TextHighlightModel} from "../highlights/text/model/TextHighlightModel";
import {CommentModel} from "./CommentModel";
import {Comment} from "../metadata/Comment";
import {FlashcardModel} from "./FlashcardModel";
import {Flashcard} from "../metadata/Flashcard";
import {isPresent} from 'polar-shared/src/Preconditions';
import {MutationType} from "../proxies/MutationType";
import {Logger} from "polar-shared/src/logger/Logger";
import {DocFileResolver} from "../datastore/DocFileResolvers";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {ModelOpts} from "../metadata/PageMetas";

const log = Logger.create();

/**
 * Handles updating the DocAnnotationIndex when we receive new updates to DocMeta.
 */
export class DocAnnotationIndexManager {

    private registering: boolean = false;

    constructor(private docFileResolver: DocFileResolver,
                private docAnnotationIndex: DocAnnotationIndex,
                private onUpdated: (annotations: ReadonlyArray<DefaultDocAnnotation>) => void) {

    }

    public registerListenerForDocMeta(docMeta: IDocMeta, opts: ModelOpts = {}) {

        const {docFileResolver} = this;

        this.registering = true;

        new AreaHighlightModel().registerListener(docMeta, annotationEvent => {

            const handleConversion = () => {

                const converter = (annotationValue: AreaHighlight) => {

                    return DocAnnotations.createFromAreaHighlight(docFileResolver,
                                                                  docMeta,
                                                                  annotationValue,
                                                                  annotationEvent.pageMeta);
                };

                const docAnnotation =
                    this.convertAnnotation(annotationEvent.value, converter);

                this.handleAnnotationEvent(annotationEvent.id,
                                           annotationEvent.traceEvent.mutationType,
                                           docAnnotation);

            };

            handleConversion();

        }, opts);

        new TextHighlightModel().registerListener(docMeta, annotationEvent => {

            const docAnnotation =
                this.convertAnnotation(annotationEvent.value,
                    annotationValue => DocAnnotations.createFromTextHighlight(docMeta,
                                                                              annotationValue,
                                                                              annotationEvent.pageMeta));
            this.handleAnnotationEvent(annotationEvent.id,
                                       annotationEvent.traceEvent.mutationType,
                                       docAnnotation);

        }, opts);

        new CommentModel().registerListener(docMeta, annotationEvent => {

            const comment: Comment = annotationEvent.value || annotationEvent.previousValue;
            const childDocAnnotation = DocAnnotations.createFromComment(docMeta,
                                                                        comment,
                                                                        annotationEvent.pageMeta);

            this.handleChildAnnotationEvent(annotationEvent.id,
                                            annotationEvent.traceEvent.mutationType,
                                            childDocAnnotation);

        }, opts);

        new FlashcardModel().registerListener(docMeta, annotationEvent => {

            const flashcard: Flashcard = annotationEvent.value || annotationEvent.previousValue;
            const childDocAnnotation = DocAnnotations.createFromFlashcard(docMeta,
                                                                          flashcard,
                                                                          annotationEvent.pageMeta);

            this.handleChildAnnotationEvent(annotationEvent.id,
                                            annotationEvent.traceEvent.mutationType,
                                            childDocAnnotation);

        }, opts);

        this.registering = false;
        this.fireUpdated();

    }

    private convertAnnotation<T>(value: any | undefined | null, converter: (input: any) => T) {

        if (! isPresent(value)) {
            return undefined;
        }

        return converter(value);

    }

    private handleChildAnnotationEvent(id: string,
                                       mutationType: MutationType,
                                       childDocAnnotation: IDocAnnotation) {

        if (! childDocAnnotation.ref) {
            // this is an old annotation.  We can't show it in the sidebar yet.
            log.warn("Annotation hidden from sidebar: ", childDocAnnotation);
            return;
        }

        if (mutationType === MutationType.DELETE) {
            this.deleteDocAnnotation(id);
        } else {
            this.addDocAnnotation(childDocAnnotation);
        }

    }

    private handleAnnotationEvent(id: string,
                                  mutationType: MutationType,
                                  docAnnotation: IDocAnnotation | undefined) {

        if (mutationType === MutationType.DELETE) {
            this.deleteDocAnnotation(id);
        } else {
            this.addDocAnnotation(docAnnotation!);
        }

    }

    private deleteDocAnnotation(id: IDString) {
        this.docAnnotationIndex.delete(id);
        this.fireUpdated();
    }

    private addDocAnnotation(docAnnotation: IDocAnnotation) {
        this.docAnnotationIndex.put(docAnnotation);
        this.fireUpdated();
    }

    private fireUpdated() {

        const annotations = this.docAnnotationIndex.getDocAnnotationsSorted();

        if( ! this.registering) {
            this.onUpdated(annotations);
        }

    }
}
