import {Logger} from 'polar-shared/src/logger/Logger';
import {PageMeta} from './PageMeta';
import {forDict} from 'polar-shared/src/util/Functions';
import {Hashcodes} from 'polar-shared/src/util/Hashcodes';
import {Pagemarks} from './Pagemarks';
import {DocMeta} from './DocMeta';
import {isPresent, Preconditions} from 'polar-shared/src/Preconditions';
import {AnnotationEvent} from '../annotations/components/AnnotationEvent';
import {TraceEvent} from '../proxies/TraceEvent';
import {IPageMeta} from "polar-shared/src/metadata/IPageMeta";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";

const log = Logger.create();

export class PageMetas {

    public static upgrade(pageMetas: {[key: number]: IPageMeta}) {

        pageMetas = Object.assign({}, pageMetas);

        forDict(pageMetas, (key, pageMeta) => {

            if (! isPresent(pageMeta.textHighlights)) {
                // log.debug("No textHighlights.  Assigning default.");
                pageMeta.textHighlights = {};
            }

            // make sure legacy / old text highlights are given IDs.
            forDict(pageMeta.textHighlights, (_, textHighlight) => {
                if (! textHighlight.id) {
                    // log.debug("Text highlight given ID");
                    textHighlight.id = Hashcodes.createID(textHighlight.rects);
                }
            });

            // TODO: too much boilerplate here.

            if (! isPresent(pageMeta.areaHighlights)) {
                // log.debug("No areaHighlights.  Assigning default.");
                pageMeta.areaHighlights = {};
            }

            if (!pageMeta.pagemarks) {
                // log.debug("No pagemarks.  Assigning default (empty map)");
                pageMeta.pagemarks = {};
            }

            if (!pageMeta.screenshots) {
                // log.debug("No screenshots.  Assigning default (empty map)");
                pageMeta.screenshots = {};
            }

            if (!pageMeta.notes) {
                // log.debug("No notes.  Assigning default (empty map)");
                pageMeta.notes = {};
            }

            if (!pageMeta.comments) {
                // log.debug("No comments.  Assigning default (empty map)");
                pageMeta.comments = {};
            }

            if (!pageMeta.questions) {
                // log.debug("No questions.  Assigning default (empty map)");
                pageMeta.questions = {};
            }

            if (!pageMeta.readingProgress) {
                // log.debug("No readingProgressLog.  Assigning default (empty map)");
                pageMeta.readingProgress = {};
            }

            pageMeta.pagemarks = Pagemarks.upgrade(pageMeta.pagemarks);

        } );

        return pageMetas;

    }

    /**
     * Create a model for a specific key within PageMetas.
     *
     */
    public static createModel(docMeta: IDocMeta,
                              memberName: string,
                              callback: (annotationEvent: AnnotationEvent) => void,
                              opts: ModelOpts = {}) {

        // TODO: it might be better to have this return an array of all
        // currently known values this way on startup I can send everything I
        // know about without having to resort indexes or update maps multiple
        // times.

        Preconditions.assertPresent(docMeta, "docMeta");
        Preconditions.assertPresent(memberName, "memberName");
        Preconditions.assertPresent(callback, "callback");

        forDict(docMeta.pageMetas, (key, pageMeta) => {

            const member = pageMeta[memberName];

            if (! member) {
                log.warn("No member for key: " + key, memberName);
            }

            const traceListener = member.addTraceListener((traceEvent: TraceEvent) => {

                if (! traceEvent.path.endsWith("/" + memberName)) {
                    return;
                }

                const annotationEvent = new AnnotationEvent(Object.assign({}, traceEvent, {
                    docMeta,
                    pageMeta,
                    traceEvent,
                }));

                callback(annotationEvent);

                return true;

            });

            if (! opts.noSync) {
                traceListener.sync();
            }

        });


    }

}

export interface ModelOpts {
    readonly noSync?: boolean;
}
