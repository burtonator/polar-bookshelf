import {AnnotationBar, AnnotationBarCallbacks, AnnotationBarTriggerEvent} from './AnnotationBar';
import * as React from 'react';
import {ControlledPopups} from '../popup/ControlledPopups';
import {ActiveSelections} from '../popup/ActiveSelections';
import {IEventDispatcher, SimpleReactor} from '../../reactor/SimpleReactor';
import {ControlledPopupProps} from '../popup/ControlledPopup';

export class AnnotationBars {

    public static create(controlledPopupProps: ControlledPopupProps,
                         annotationBarCallbacks: AnnotationBarCallbacks,
                         pageNum: number) {

        const annotationBarTriggerEventDispatcher = new SimpleReactor<AnnotationBarTriggerEvent>();

        const child = <AnnotationBar popupStateEventDispatcher={controlledPopupProps.popupStateEventDispatcher}
                                     annotationBarTriggerEventDispatcher={annotationBarTriggerEventDispatcher}
                                     onHighlighted={annotationBarCallbacks.onHighlighted}
                                     onComment={annotationBarCallbacks.onComment}/>;

        ControlledPopups.create(controlledPopupProps, child);

        const target = document.getElementById("viewerContainer")!;

        // NOTE: we don't need to monitor iframes because our EventDispatcher
        // gives us events from the iframes bubbled up.
        this.registerEventListener(controlledPopupProps,
                                   pageNum,
                                   annotationBarTriggerEventDispatcher,
                                   target);

    }

    private static registerEventListener(controlledPopupProps: ControlledPopupProps,
                                         pageNum: number,
                                         annotationBarTriggerEventDispatcher: IEventDispatcher<AnnotationBarTriggerEvent>,
                                         target: HTMLElement) {

        ActiveSelections.addEventListener(activeSelectionEvent => {

            if (activeSelectionEvent.type === 'destroyed') {
                // only created supported for now.
                return;
            }

            // this causes the popup to display
            controlledPopupProps.triggerPopupEventDispatcher.dispatchEvent({
                point: {
                    x: activeSelectionEvent.boundingClientRect.left + (activeSelectionEvent.boundingClientRect.width / 2),
                    y: activeSelectionEvent.boundingClientRect.top
                },
                offset: {
                    x: 0,
                    y: -10
                },
                pageNum,
                selection: activeSelectionEvent.selection
            });

            // this gives the information to our annotation bar.
            const annotationBarTriggerEvent: AnnotationBarTriggerEvent = {
                activeSelection: activeSelectionEvent,
                type: 'range',
                pageNum
            };

            annotationBarTriggerEventDispatcher.dispatchEvent(annotationBarTriggerEvent);

        }, target);

    }

}
