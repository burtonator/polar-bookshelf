import * as React from 'react';
import {Logger} from 'polar-shared/src/logger/Logger';
import {FlashcardType} from 'polar-shared/src/metadata/FlashcardType';
import Input from 'reactstrap/lib/Input';

const log = Logger.create();

class Styles {

    public static SelectCardType: React.CSSProperties = {
        minWidth: '10em',
        fontSize: '14px'
    };

}

export class FlashcardTypeSelector extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
        };

    }

    public render() {

        return (

            <Input type="select"
                   style={Styles.SelectCardType}
                   defaultValue={this.props.flashcardType}
                   className="p-0"
                   onChange={htmlInputElement => this.props.onChangeFlashcardType(htmlInputElement.target.value as FlashcardType)}>

                <option value={FlashcardType.BASIC_FRONT_BACK}>Front and back</option>

                <option value={FlashcardType.CLOZE}>Cloze</option>

            </Input>

        );

    }

}

export interface IProps {
    readonly flashcardType: FlashcardType;
    readonly onChangeFlashcardType: (flashcardType: FlashcardType) => void;
}

export interface IState {
}
