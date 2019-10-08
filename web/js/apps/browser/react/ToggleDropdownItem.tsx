import React from 'react';
import {DropdownItem, DropdownMenu, Label, Input} from 'reactstrap';
import {IStyleMap} from '../../../react/IStyleMap';

const Styles: IStyleMap = {

    Label: {
        marginLeft: "5px"
    },

    Input: {
        // marginLeft: "5px"
    }

};

export class ToggleDropdownItem extends React.Component<IProps, IState> {

    constructor(props: any) {
        super(props);

        this.state = {
            open: false
        };
    }

    public render() {
        return (
            <DropdownItem>

                <Label style={Styles.Label} check>
                    <Input type="checkbox" checked={this.props.enabled} style={Styles.Input} />

                    {this.props.children}

                </Label>

            </DropdownItem>
        );
    };

}

interface IProps {
    enabled: boolean;
}

interface IState {

}
