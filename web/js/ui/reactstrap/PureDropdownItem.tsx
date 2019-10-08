import * as React from 'react';
import Button from 'reactstrap/lib/Button';

export class PureDropdownItem extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (

            <Button {...this.props}
                    type="button"
                    role="menuitem"
                    className="dropdown-item">

                {this.props.children}

            </Button>

        );

    }

}

interface IProps {
    readonly disabled?: boolean;
    readonly hidden?: boolean;
    readonly onClick: () => void;
    readonly className?: string;
}

interface IState {

}
