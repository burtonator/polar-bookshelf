import * as React from 'react';
import Dropdown, {Direction} from 'reactstrap/lib/Dropdown';
import Tooltip from 'reactstrap/lib/Tooltip';

/**
 *
 */
export class ManualDropdown extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.toggle = this.toggle.bind(this);

        this.state = {
            open: false,
        };

    }

    public render() {

        return (

            <Dropdown id={this.props.id}
                      isOpen={this.state.open}
                      toggle={() => this.toggle()}
                      direction={this.props.direction}
                      size={this.props.size}>

                {this.props.children}

            </Dropdown>

        );

    }

    private toggle(): void {

        const open = !this.state.open;

        this.setState({...this.state, open});

    }

}

interface IProps {

    readonly id: string;
    readonly direction?: Direction;
    readonly size?: string;

}

interface IState {

    readonly open: boolean;

}
