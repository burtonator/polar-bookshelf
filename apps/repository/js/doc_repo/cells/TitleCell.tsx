import * as React from 'react';

export class TitleCell extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
        };

    }

    public render() {

        // TODO: going to move tis to a title cell but the context menu needs
        // to be reworked as it has a pointer directly to the cell.

        return (<div>

        </div>);

    }

}

interface IProps {
}

interface IState {
}
