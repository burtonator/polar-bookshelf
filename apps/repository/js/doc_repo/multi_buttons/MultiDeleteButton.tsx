import * as React from 'react';
import Button from 'reactstrap/lib/Button';
import {SimpleTooltipEx} from '../../../../../web/js/ui/tooltip/SimpleTooltipEx';

export class MultiDeleteButton extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
        };

    }

    public render() {

        return (<div>

            <SimpleTooltipEx text="Delete multiple documents at once."
                             disabled={this.props.disabled}
                             placement="bottom">

                <Button id="multi-delete-button"
                        size="sm"
                        color="light"
                        className="border"
                        disabled={this.props.disabled}
                        onClick={() => this.onClick()}>

                    <span className="text-danger">
                        <i className="fas fa-trash-alt"></i>
                    </span>

                </Button>

            </SimpleTooltipEx>

        </div>);

    }

    private onClick() {

        if (this.props.disabled) {
            return;
        }

        this.props.onClick();

    }

}

interface IProps {
    readonly disabled?: boolean;
    readonly onClick: () => void;
}

interface IState {
}
