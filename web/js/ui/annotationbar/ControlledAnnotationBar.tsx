import * as React from 'react';
import {Button} from 'reactstrap';
import {ActiveSelection} from '../popup/ActiveSelections';
import {AnnotationDescriptor} from '../../metadata/AnnotationDescriptor';
import {HighlightCreatedEvent} from '../../comments/react/HighlightCreatedEvent';
import {HighlightColor} from "polar-shared/src/metadata/IBaseHighlight";

/**
 * An annotation bar that is placed exactly.
 */
export class ControlledAnnotationBar extends React.Component<IProps, IState> {

    constructor(props: any) {
        super(props);

        this.dispatchOnHighlighted = this.dispatchOnHighlighted.bind(this);

        this.state = {};

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

                </div>

            </div>
        );

    }

    private dispatchOnHighlighted(highlightColor: HighlightColor) {

        const highlightCreatedEvent: HighlightCreatedEvent = {
            activeSelection: this.props.activeSelection,
            highlightColor,
            pageNum: this.props.pageNum,
            annotationDescriptor: this.props.annotationDescriptor
        };

        this.props.onHighlighted(highlightCreatedEvent);

    }

}

export interface IProps extends AnnotationBarCallbacks {

    /**
     * The ActiveSelection in the browser that's being selected by the user.
     */
    readonly activeSelection: ActiveSelection;

    readonly type: AnnotationBarTargetType;

    readonly pageNum: number;

    /**
     * An optional annotationDescriptor if this is an existing annotation.
     */
    readonly annotationDescriptor?: AnnotationDescriptor;

}

export interface IState {
}

export interface AnnotationBarCallbacks {
    // called when the comment button is clicked.
    onHighlighted: OnHighlightedCallback;
}

export type OnHighlightedCallback
    = (highlightCreatedEvent: HighlightCreatedEvent) => void;

/**
 * The type of the selection.  A 'range' is just a user highlight.  Otherwise
 * it's either a previously created 'text-highlight' or 'area-highlight
 */
export type AnnotationBarTargetType = 'range' | 'text-highlight' | 'area-highlight';
