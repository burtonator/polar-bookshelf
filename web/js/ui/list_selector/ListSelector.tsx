import * as React from 'react';
import {Input, Label, ListGroup, ListGroupItem, Button} from 'reactstrap';
import {IStyleMap} from '../../react/IStyleMap';

const Styles: IStyleMap = {

    Label: {
        userSelect: 'none',
        width: '100%',
        cursor: 'pointer',
        marginBottom: '0'

    },

};

export class ListSelector<T extends ListOptionType> extends React.Component<IProps<T>, IState> {

    private readonly options: T[];

    constructor(props: IProps<T>, context: any) {
        super(props, context);

        this.onChange = this.onChange.bind(this);
        this.onCancel = this.onCancel.bind(this);

        this.options = Object.assign([], this.props.options);

        this.state = {
            // dropdownOpen: false,
            // splitButtonOpen: false
        };

    }

    public render() {

        return (
            <div className="column-selector m-0" id={this.props.id}>

                <div className="text-muted pb-1">
                    {this.props.title}
                </div>

                <ListGroup flush>

                    {this.createListGroupItems(this.options)}

                </ListGroup>

                <div className="pt-2 text-right">

                    <Button className="btn ml-1"
                            color="secondary"
                            onClick={() => this.onCancel()}
                            size="sm">Cancel</Button>

                    <Button className="btn ml-1"
                            color="primary"
                            onClick={() => this.onSet()}
                            size="sm">Set Columns</Button>

                </div>

            </div>

        );

    };

    private createListGroupItems(options: T[]) {

        // https://blog.cloudboost.io/for-loops-in-react-render-no-you-didnt-6c9f4aa73778

        // TODO: I'm not sure what type of class a <div> or React element uses
        // so using 'any' for now.

        const result: any = [];

        options.map(option => {
            const id = this.props.id + '-' + option.id;
            result.push (
                <ListGroupItem key={option.id}>

                    <div className="ml-2">

                        <Input type="checkbox"
                               id={id}
                               defaultChecked={option.selected}
                               onChange={(event) => this.onChange(option, event)}/>

                        <Label for={id} style={Styles.Label}>{option.label}</Label>

                        {/*<div className="text-muted">*/}
                            {/*{option.title || ''}*/}
                        {/*</div>*/}

                    </div>

                </ListGroupItem>);

        });

        return result;

    }

    private onChange(option: T, event: React.ChangeEvent<HTMLInputElement>) {

        const selected = event.target.checked;

        option.selected = event.target.checked;

        this.props.onChange(option);

    }

    private onCancel() {
        if (this.props.onCancel) {
            this.props.onCancel();
        }
    }

    private onSet() {
        if (this.props.onSet) {
            this.props.onSet(this.options);
        }
    }

}

export interface ListOptionType {

    /**
     * The ID of the option.
     */
    id: string;

    /**
     * The label to show in the UI.
     */
    label: string;

    /**
     * True when the option is selected by the user.
     */
    selected: boolean;

    title?: string;

}

export interface ListOptionTypeMap {
    [id: string]: ListOptionType;
}

export const createListOptionTypeMap = <M extends ListOptionTypeMap>(things: M) => things

interface IProps<T> {

    id: string;

    options: T[];

    title?: string;

    /**
     * Called when a single value changes.
     */
    onChange: (value: ListOptionType) => void;

    /**
     * Called when we are canceling the input.
     */
    onCancel?: () => void;

    onSet?: (options: ListOptionType[]) => void;

}

interface IState {

}


