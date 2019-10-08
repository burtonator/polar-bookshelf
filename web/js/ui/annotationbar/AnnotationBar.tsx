import * as React from 'react';
import {Button} from 'reactstrap';
import {ActiveSelection} from '../popup/ActiveSelections';
import {IEventDispatcher} from '../../reactor/SimpleReactor';
import {AnnotationDescriptor} from '../../metadata/AnnotationDescriptor';
import {HighlightCreatedEvent} from '../../comments/react/HighlightCreatedEvent';
import {PopupStateEvent} from '../popup/PopupStateEvent';
import {EventListener, Releaseable} from '../../reactor/EventListener';
import {HighlightColor} from "polar-shared/src/metadata/IBaseHighlight";

export class AnnotationBar extends React.Component<AnnotationBarProps, IState> {

    private releaser?: Releaseable;

    constructor(props: any) {
        super(props);

        this.dispatchOnHighlighted = this.dispatchOnHighlighted.bind(this);
        this.dispatchOnCommented = this.dispatchOnCommented.bind(this);

        this.state = {};

    }

    public componentWillMount(): void {

        this.releaser = this.props.annotationBarTriggerEventDispatcher.addEventListener(event => {
            this.setState({event});
        });

    }

    public componentWillUnmount(): void {
        if (this.releaser) {
            this.releaser.release();
        }
    }

    public render() {
        return (
            <div>

                <div className="rounded p-1 annotationbar text-center" style={{}}>

                    <Button size="lg"
                            type="button"
                            className="btn p-1 m-1 annotationbar-btn"
                            title=""
                            aria-label=""
                            onClick={() => this.dispatchOnHighlighted('yellow')}
                            style={{ }}>

                        <span className="fas fa-highlighter"
                              aria-hidden="true"
                              style={{ color: 'rgba(255,255,0)' }}/>

                    </Button>

                    <Button size="lg"
                            type="button"
                            className="btn p-1 m-1 annotationbar-btn"
                            title=""
                            aria-label=""
                            onClick={() => this.dispatchOnHighlighted('red')}
                            style={{ }}>

                        <span className="fas fa-highlighter annotationbar-btn-highlighter"
                              aria-hidden="true"
                              style={{color: 'rgba(255,0,0)'}}/>

                    </Button>

                    <Button size="lg"
                            type="button"
                            className="btn p-1 m-1 annotationbar-btn annotationbar-btn-highlighter"
                            title=""
                            aria-label=""
                            onClick={() => this.dispatchOnHighlighted('green')}
                            style={{ }}>

                        <span className="fas fa-highlighter"
                              aria-hidden="true"
                              style={{color: 'rgba(0,255,0)'}}/>

                    </Button>

                    {/*<Button size="lg"*/}
                            {/*type="button"*/}
                            {/*className="btn p-1 m-1 annotationbar-btn annotationbar-btn-comment"*/}
                            {/*title=""*/}
                            {/*aria-label=""*/}
                            {/*onClick={() => this.dispatchOnCommented()}*/}
                            {/*style={{ }}>*/}

                        {/*<span className="fas fa-comment"*/}
                              {/*aria-hidden="true"*/}
                              {/*style={{color: 'rgba(255,255,255)'}}/>*/}

                    {/*</Button>*/}

                </div>

            </div>
        );

    }

    private dispatchOnHighlighted(highlightColor: HighlightColor) {

        const highlightCreatedEvent: HighlightCreatedEvent = {
            activeSelection: this.state.event!.activeSelection,
            highlightColor,
            pageNum: this.state.event!.pageNum,
            annotationDescriptor: this.state.event!.annotationDescriptor

        };

        this.props.onHighlighted(highlightCreatedEvent);

        this.props.popupStateEventDispatcher.dispatchEvent({active: false});

    }

    private dispatchOnCommented() {

        const commentTriggerEvent: CommentTriggerEvent = {
            ...this.state.event!,
        };

        this.props.onComment(commentTriggerEvent);

    }

}

export interface IState {
    event?: AnnotationBarTriggerEvent;
}

export interface AnnotationBarCallbacks {
    // called when the comment button is clicked.
    onHighlighted: OnHighlightedCallback;
    onComment: OnCommentCallback;
}

export type OnHighlightedCallback
    = (highlightCreatedEvent: HighlightCreatedEvent) => void;

export interface CommentTriggerEvent extends AnnotationBarEvent {

}

// TODO: this should be CommentCreatedEvent
export type OnCommentCallback
    = (commentTriggerEvent: CommentTriggerEvent) => void;

export interface AnnotationBarProps extends AnnotationBarCallbacks {
    popupStateEventDispatcher: IEventDispatcher<PopupStateEvent>;
    annotationBarTriggerEventDispatcher: IEventDispatcher<AnnotationBarTriggerEvent>;
}

export interface AnnotationBarEvent {

    /**
     * The ActiveSelection in the browser that's being selected by the user.
     */
    readonly activeSelection: ActiveSelection;

    readonly type: ActiveSelectionType;

    readonly pageNum: number;

    /**
     * An optional annotationDescriptor if this is an existing annotation.
     */
    readonly annotationDescriptor?: AnnotationDescriptor;

}

export interface AnnotationBarTriggerEvent extends AnnotationBarEvent {


}


/**
 * The type of the selection.  A 'range' is just a user highlight.  Otherwise
 * it's either a previously created 'text-highlight' or 'area-highlight
 */
export type ActiveSelectionType = 'range' | 'text-highlight' | 'area-highlight';
