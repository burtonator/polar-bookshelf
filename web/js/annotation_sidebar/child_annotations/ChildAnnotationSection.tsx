import * as React from 'react';
import {DocAnnotation} from '../DocAnnotation';
import {AnnotationType} from 'polar-shared/src/metadata/AnnotationType';
import {ViewOrEditComment} from "./comments/ViewOrEditComment";
import {CommentActions} from "./comments/CommentActions";
import {ViewOrEditFlashcard} from './flashcards/ViewOrEditFlashcard';
import {Comment} from '../../metadata/Comment';
import {FlashcardType} from 'polar-shared/src/metadata/FlashcardType';
import {FlashcardInputFieldsType} from './flashcards/flashcard_input/FlashcardInputs';
import {FlashcardActions} from './flashcards/FlashcardActions';
import {Flashcard} from '../../metadata/Flashcard';
import {Doc} from '../../metadata/Doc';

/**
 * A generic wrapper that determines which sub-component to render.
 */
export class ChildAnnotationSection extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onComment = this.onComment.bind(this);
        this.onFlashcard = this.onFlashcard.bind(this);

        this.state = {};

    }

    public render() {

        const docAnnotations = [...this.props.docAnnotations];

        docAnnotations.sort((a, b) => a.created.localeCompare(b.created));

        const result: any = [];

        docAnnotations.map(child => {

            if (child.annotationType === AnnotationType.COMMENT) {

                result.push (<ViewOrEditComment key={child.id}
                                                doc={this.props.doc}
                                                id={child.id}
                                                onComment={(html, existingComment) => this.onComment(html, existingComment)}
                                                comment={child}/>);

            } else {
                result.push (<ViewOrEditFlashcard key={child.id}
                                                  doc={this.props.doc}
                                                  id={child.id}
                                                  onFlashcard={(flashcardType, fields, existingFlashcard) => this.onFlashcard(flashcardType, fields, existingFlashcard)}
                                                  flashcard={child}/>);
            }


        });

        return result;

    }

    private onComment(html: string, existingComment: Comment) {
        CommentActions.update(this.props.doc.docMeta, this.props.parent, html, existingComment);
    }

    private onFlashcard(flashcardType: FlashcardType, fields: Readonly<FlashcardInputFieldsType>, existingFlashcard?: Flashcard) {
        FlashcardActions.update(this.props.doc.docMeta, this.props.parent, flashcardType, fields, existingFlashcard);
    }

}

interface IProps {

    readonly doc: Doc;

    readonly parent: DocAnnotation;

    readonly docAnnotations: ReadonlyArray<DocAnnotation>;

}

interface IState {

}


