import * as React from 'react';

export class KeyBoundMenuItem extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

    }

    public render() {

        return (

            <div style={{display: 'flex'}}>

                <div style={{marginRight: 'auto'}}>{this.props.text}</div>

                <div className="ml-3 text-muted">{this.props.keyBinding}</div>

            </div>

        );

    }

}


interface IProps {
    readonly text: string;
    readonly keyBinding: string;
}

interface IState {

}


