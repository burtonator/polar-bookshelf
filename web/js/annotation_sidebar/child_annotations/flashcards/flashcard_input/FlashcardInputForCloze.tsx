import * as React from 'react';
import {FlashcardType} from 'polar-shared/src/metadata/FlashcardType';
import {FlashcardButtons} from './FlashcardButtons';
import {FlashcardTypeSelector} from './FlashcardTypeSelector';
import {RichTextArea} from '../../../RichTextArea';
import {RichTextMutator} from '../../../../apps/card_creator/elements/schemaform/RichTextMutator';
import {
    ClozeFields,
    FlashcardInputFieldsType,
    FlashcardInputs
} from './FlashcardInputs';
import {Ranges} from '../../../../highlights/text/selection/Ranges';
import {Flashcard} from '../../../../metadata/Flashcard';
import {FlashcardStyles} from './FlashcardStyles';
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from '@material-ui/core/IconButton';

export class FlashcardInputForCloze extends React.Component<IProps, IState> {

    private readonly flashcardType: FlashcardType = FlashcardType.CLOZE;

    private fields: ClozeFields = {text: ""};

    private richTextMutator?: RichTextMutator;

    private counter: number = 1;

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onCreate = this.onCreate.bind(this);

        this.state = {
            iter: 0,
        };

        this.fields = this.toFields();

    }

    public render() {

        const { id } = this.props;

        const fields = this.toFields();

        return (

            <div id="annotation-flashcard-box" className="m-1">

                <RichTextArea id={`text-${this.props.id}`}
                              value={fields.text}
                              defaultValue={this.props.defaultValue}
                              autofocus={true}
                              onKeyDown={event => this.onKeyDown(event)}
                              onRichTextMutator={richTextMutator => this.richTextMutator = richTextMutator}
                              onChange={(html) => this.fields.text = html}/>

                {/*- quote annotation ... to copy the annotation text.*/}

                <div style={FlashcardStyles.BottomBar}>

                    <div style={FlashcardStyles.BottomBarItem}>

                        <FlashcardTypeSelector
                            flashcardType={this.flashcardType}
                            onChangeFlashcardType={flashcardType => this.props.onFlashcardChangeType(flashcardType)}/>

                    </div>

                    <div style={FlashcardStyles.BottomBarItem} className="ml-1">

                        <Tooltip title="Create cloze deletion for text">

                            <IconButton id={`button-${this.props.id}`}
                                        onClick={() => this.onClozeDelete()}>
                                […]
                            </IconButton>
                        </Tooltip>

                    </div>

                    <div style={{
                             display: 'flex',
                             flexGrow: 1,
                             justifyContent: 'flex-end',
                             alignItems: 'center'
                         }}>

                        <FlashcardButtons cancelButton={this.props.cancelButton}
                                          existingFlashcard={this.props.existingFlashcard}
                                          onCreate={() => this.onCreate()}/>

                    </div>

                </div>

            </div>

        );

    }

    private toFields(): ClozeFields {

        const text = FlashcardInputs.fieldToString('text', this.props.existingFlashcard, this.props.defaultValue);

        return {text};

    }

    private onClozeDelete(): void {

        // TODO: don't use the top level window but get it from the proper
        // event
        const sel = window.getSelection();

        if (!sel) {
            return;
        }

        const range = sel.getRangeAt(0);

        const textNodes = Ranges.getTextNodes(range);

        if (textNodes.length === 0) {
            return;
        }

        const c = this.counter++;

        const prefix = document.createTextNode(`{{c${c}::`);
        const suffix = document.createTextNode('}}');

        const firstNode = textNodes[0];
        const lastNode = textNodes[textNodes.length - 1];

        firstNode.parentNode!.insertBefore(prefix, firstNode);
        lastNode.parentNode!.insertBefore(suffix, lastNode.nextSibling);

        sel.removeAllRanges();

        this.fields.text = this.richTextMutator!.currentValue();

        // TODO this improperly sets the focus by moving the cursor to the
        // beginning
        this.richTextMutator!.focus();

    }

    private onKeyDown(event: KeyboardEvent) {

        if (this.isKeyboardControlShiftC(event)) {
            this.onClozeDelete();
        }

        if (event.getModifierState("Control") && event.key === "Enter") {
            this.onCreate();
        }

    }

    private isKeyboardControlShiftC(event: KeyboardEvent) {

        return event.getModifierState("Control") &&
               event.getModifierState("Shift") &&
               event.key === "C";
    }

    private onCreate(): void {

        if (this.props.onFlashcard) {
            this.props.onFlashcard(this.flashcardType, this.fields);
        }

        // this.reset();

        this.setState({
            iter: this.state.iter + 1
        });

    }
    //
    // private onCancel(): void {
    //
    //     if (this.props.onCancel) {
    //         this.props.onCancel();
    //     }
    //
    //     this.reset();
    //
    // }
    //
    // private reset(): void {
    //     this.fields = {text: ""};
    // }


}

interface IProps {

    readonly id: string;

    readonly onFlashcard: (flashcardType: FlashcardType, fields: Readonly<FlashcardInputFieldsType>) => void;

    readonly onFlashcardChangeType: (flashcardType: FlashcardType) => void;

    readonly cancelButton: JSX.Element;

    readonly existingFlashcard?: Flashcard;

    readonly defaultValue?: string;

}

interface IState {
    readonly iter: number;
}


