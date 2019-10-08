import * as React from 'react';
import {AnnotationType} from 'polar-shared/src/metadata/AnnotationType';
import {FlashcardIcon} from './FlashcardIcon';
import {CommentIcon} from './CommentIcon';
import {HighlighterIcon} from './HighlighterIcon';
import {HighlightColor} from "polar-shared/src/metadata/IBaseHighlight";

/**
 */
export class AnnotationIcon extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        switch (this.props.type) {

            case AnnotationType.FLASHCARD:
                return ( <FlashcardIcon/> );

            case AnnotationType.COMMENT:
                return ( <CommentIcon/> );

            case AnnotationType.AREA_HIGHLIGHT:
                return ( <HighlighterIcon color={this.props.color!}/> );

            case AnnotationType.TEXT_HIGHLIGHT:
                return ( <HighlighterIcon color={this.props.color!}/> );

            default:
                return ( <div>none</div> );

        }

        return (

            <span className="fas fa-highlighter text-secondary"
                  aria-hidden="true"/>

        );

    }


}

interface IProps {
    type: AnnotationType;
    color?: HighlightColor;
}

interface IState {
}
