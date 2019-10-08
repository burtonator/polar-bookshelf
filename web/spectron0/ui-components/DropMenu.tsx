import * as React from 'react';
import Dropdown from 'reactstrap/lib/Dropdown';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';

export class DropMenu extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onToggle = this.onToggle.bind(this);
        this.onClick = this.onClick.bind(this);

        this.state = {
            open: this.props.open ? true : false
        };

    }

    public render() {

        return (

            <Dropdown tag="div"
                      direction="right"
                      isOpen={this.state.open}
                      onClick={event => this.onClick(event)}
                      toggle={() => this.onToggle()}>

                <DropdownToggle className=""
                                color="light" caret>
                    Dropdown
                </DropdownToggle>

                {this.props.children}

            </Dropdown>

        );
    }

    private onToggle() {
        console.log("FIXME ontoggle called");
        this.setState({ ...this.state, open: !this.state.open });
    }

    private onClick(event: React.MouseEvent) {
        console.log("FIXME: Caought onClick");
        event.preventDefault();
        event.stopPropagation();
        return false;
    }

}

interface IProps {
    readonly open?: boolean;
}

interface IState {
    readonly open: boolean;
}


