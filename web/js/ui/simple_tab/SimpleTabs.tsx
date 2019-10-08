import * as React from 'react';

export class SimpleTabs extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (

            <div style={{display: 'flex'}}>
                {this.props.children}
            </div>

        );
    }

}

export interface IProps {
}

export interface IState {

}
