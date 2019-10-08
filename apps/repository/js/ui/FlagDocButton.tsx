import * as React from 'react';
import {DocButton} from './DocButton';
import {ToggleIcon} from './ToggleIcon';

export class FlagDocButton extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
        };

    }

    public render() {

        return (<DocButton onClick={() => this.props.onClick()}>

            <ToggleIcon className="fa fa-flag"
                        title="Flag document"
                        active={this.props.active}/>

        </DocButton>);

    }

}

interface IProps {
    readonly onClick: () => void;
    readonly active: boolean;
}

interface IState {
}
