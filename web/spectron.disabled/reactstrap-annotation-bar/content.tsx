import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import * as ReactDOM from '@types/react-dom';
import * as React from '@types/react';
import App from './App';
import {AnnotationBars} from '../../js/ui/annotationbar/AnnotationBars';
import {TriggerPopupEvent} from '../../js/ui/popup/TriggerPopupEvent';
import {SimpleReactor} from '../../js/reactor/SimpleReactor';
import {AnnotationBarCallbacks, CommentTriggerEvent, OnCommentCallback, OnHighlightedCallback} from '../../js/ui/annotationbar/AnnotationBar';
import {ControlledPopupProps} from '../../js/ui/popup/ControlledPopup';
import {CommentPopupBars} from '../../js/comments/react/CommentPopupBars';
import {CommentPopupBarCallbacks} from '../../js/comments/react/CommentPopupBar';
import {CommentCreatedEvent} from '../../js/comments/react/CommentCreatedEvent';
import {HighlightCreatedEvent} from '../../js/comments/react/HighlightCreatedEvent';
import {PopupStateEvent} from '../../js/ui/popup/PopupStateEvent';

SpectronRenderer.run(async () => {

    ReactDOM.render(
        <App />,
        document.getElementById('root') as HTMLElement
    );

    const commentBarControlledPopupProps: ControlledPopupProps = {
        id: 'commentbar',
        placement: 'bottom',
        popupStateEventDispatcher: new SimpleReactor<PopupStateEvent>(),
        triggerPopupEventDispatcher: new SimpleReactor<TriggerPopupEvent>()
    };

    const commentPopupBarCallbacks: CommentPopupBarCallbacks = {

        onComment: (commentCreatedEvent: CommentCreatedEvent) => {
            console.log("FIXME: comment created", commentCreatedEvent);
        }

    };

    CommentPopupBars.create(commentBarControlledPopupProps, commentPopupBarCallbacks);

    // FIXME: just tie the visibility of the popup to the visiblity of the
    // region.. when the region vanishes then just close the popup OR the text
    // area is close obviously.

    const popupStateEventDispatcher = new SimpleReactor<PopupStateEvent>();
    const triggerPopupEventDispatcher = new SimpleReactor<TriggerPopupEvent>();

    const annotationBarControlledPopupProps: ControlledPopupProps = {
        id: 'annotationbar',
        placement: 'top',
        popupStateEventDispatcher,
        triggerPopupEventDispatcher
    };

    const onComment: OnCommentCallback =
        (commentTriggerEvent: CommentTriggerEvent) => {

        // create the new popup BELOW the region now...
        console.log("Got comment button clicked");

        const activeSelection = commentTriggerEvent.activeSelection;

        commentBarControlledPopupProps.triggerPopupEventDispatcher.dispatchEvent({
            point: {
                x: activeSelection.boundingClientRect.left + (activeSelection.boundingClientRect.width / 2),
                y: activeSelection.boundingClientRect.bottom
            },
            offset: {
                x: 0,
                y: 10
            },
            pageNum: commentTriggerEvent.pageNum

        });

    };

    const onHighlighted: OnHighlightedCallback = (highlightCreatedEvent: HighlightCreatedEvent) => {

        console.log("Got highlight!", highlightCreatedEvent);

    };

    const annotationBarCallbacks: AnnotationBarCallbacks = {
        onHighlighted,
        onComment
    };

    AnnotationBars.create(annotationBarControlledPopupProps, annotationBarCallbacks, 1);

});






