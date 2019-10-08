import * as React from 'react';
import Button from 'reactstrap/lib/Button';

/**
 */
export class CancelButton extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (

            <Button color="secondary"
                    size="sm"
                    className="ml-1"
                    onClick={() => this.onClick()}>

                Cancel

            </Button>

        );

    }

    private onClick() {
        this.props.onClick();
    }

}

interface IProps {
    readonly onClick: () => void;
}

interface IState {

}
