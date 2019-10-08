import * as React from 'react';
import {DocAnnotation} from '../../DocAnnotation';
import {EditButton} from "../EditButton";
import {CancelButton} from "../CancelButton";
import {ViewFlashcard} from './ViewFlashcard';
import {FlashcardInput} from './flashcard_input/FlashcardInput';
import {FlashcardCallback} from './flashcard_input/FlashcardInput';
import {Flashcard} from '../../../metadata/Flashcard';
import {Doc} from '../../../metadata/Doc';

export class ViewOrEditFlashcard extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onEdit = this.onEdit.bind(this);
        this.onCancel = this.onCancel.bind(this);

        this.state = {
            mode: 'view'
        };

    }

    public render() {

        const editButton = <EditButton id={'edit-button-for-' + this.props.id}
                                       disabled={! this.props.doc.mutable}
                                       onClick={() => this.onEdit()}
                                       type="flashcard"/>;

        const cancelButton = <CancelButton onClick={() => this.onCancel()}/>;

        const existingFlashcard = this.props.flashcard.original as Flashcard;

        if (this.state.mode === 'view') {

            return <ViewFlashcard flashcard={this.props.flashcard}
                                  doc={this.props.doc}
                                  editButton={editButton}/>;

        } else {
            return <FlashcardInput id={'edit-flashcard-for' + this.props.id}
                                   flashcardType={existingFlashcard.type}
                                   onFlashcard={this.props.onFlashcard}
                                   existingFlashcard={existingFlashcard}
                                   cancelButton={cancelButton}/>;
        }

    }

    private onEdit() {
        this.setState({mode: 'edit'});
    }

    private onCancel() {
        this.setState({mode: 'view'});
    }

}
interface IProps {
    readonly id: string;
    readonly doc: Doc;
    readonly flashcard: DocAnnotation;
    readonly onFlashcard: FlashcardCallback;
}

interface IState {
    readonly mode: 'view' | 'edit';
}


