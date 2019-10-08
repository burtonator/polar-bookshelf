import {TriggerEvent} from '../contextmenu/TriggerEvent';
import {Logger} from 'polar-shared/src/logger/Logger';
import {CommentPopupBoxes} from './react/CommentPopupBoxes';
import {SimpleReactor} from '../reactor/SimpleReactor';
import {CommentInputEvent} from './react/CommentInputEvent';
import {Comments} from '../metadata/Comments';
import {Model} from '../model/Model';
import {AnnotationDescriptor} from '../metadata/AnnotationDescriptor';
import {CommentCreatedEvent} from './react/CommentCreatedEvent';

const log = Logger.create();

export class CommentsController {

    private popupElement?: HTMLElement;

    private model: Model;

    constructor(model: Model) {
        this.model = model;
    }

    private readonly commentEventDispatcher = new SimpleReactor<CommentInputEvent>();

    public start(): void {

        window.addEventListener("message", event => this.onMessageReceived(event), false);

        CommentPopupBoxes.create(this.commentEventDispatcher,
                                 (commentCreatedEvent) => this.onCommentCreated(commentCreatedEvent));

    }

    private onMessageReceived(event: any) {

        const data = event.data;

        if (data) {

            if (data.type === 'add-comment') {

                const triggerEvent = TriggerEvent.create(event.data);

                log.debug("Creating comment from trigger event: ", triggerEvent);

                // TODO: this is not right but better than nothing for now.  We
                // should have the context menu system pick the proper annotation
                // to send.

                const annotationDescriptors = Object.values(triggerEvent.matchingSelectors)
                    .map(current => current.annotationDescriptors)
                    .reduce((prev, curr) => [...curr, ...prev], []);

                if (annotationDescriptors.length === 1) {

                    const annotationDescriptor = annotationDescriptors[0];

                    this.triggerCreateCommentPopup(triggerEvent, annotationDescriptor)
                        .catch(err => log.error("Could not create comment: ", err));

                } else {
                    log.warn("Too many descriptors");
                }

            }

        }

    }

    private onCommentCreated(commentCreatedEvent: CommentCreatedEvent): void {

        // // FIXME: we have to assign a link to the comment so that we know to what it is attached.
        // const comment = Comments.createTextComment(commentCreatedEvent.text);
        //
        // const docMeta = this.model.docMeta;
        // const pageMeta = docMeta.getPageMeta(commentCreatedEvent.pageNum);
        //
        // pageMeta.comments[comment.id] = comment;

    }

    private async triggerCreateCommentPopup(triggerEvent: TriggerEvent,
                                            annotationDescriptor: AnnotationDescriptor) {

        this.commentEventDispatcher.dispatchEvent({
            point: triggerEvent.points.client,
            pageNum: triggerEvent.pageNum,
            annotationDescriptor,
            type: 'create'
        });

    }

}
