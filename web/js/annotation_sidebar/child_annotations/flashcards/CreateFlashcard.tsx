import * as React from 'react';
import {CancelButton} from "../CancelButton";
import {NullCollapse} from "../../../ui/null_collapse/NullCollapse";
import {FlashcardInput} from './flashcard_input/FlashcardInput';
import {FlashcardCallback} from './flashcard_input/FlashcardInput';
import {ScrollIntoView} from '../../../ui/ScrollIntoView';

export class CreateFlashcard extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onCancel = this.onCancel.bind(this);

        this.state = {
            active: this.props.active || false
        };

    }

    public render() {

        const cancelButton = <CancelButton onClick={() => this.onCancel()}/>;

        return <NullCollapse open={this.props.active}>

            <ScrollIntoView>
                <FlashcardInput id={'edit-flashcard-for' + this.props.id}
                                onFlashcard={this.props.onFlashcardCreated}
                                cancelButton={cancelButton}/>
            </ScrollIntoView>

        </NullCollapse>;

    }

    private onCancel() {

        if (this.props.onCancel) {
            this.props.onCancel();
        }

    }

}
interface IProps {

    readonly id: string;

    readonly active: boolean;

    readonly onFlashcardCreated: FlashcardCallback;

    readonly onCancel?: () => void;

}

interface IState {
}


