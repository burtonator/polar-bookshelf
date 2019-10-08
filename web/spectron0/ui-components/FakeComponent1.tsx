import * as React from 'react';

export class FakeComponent1 extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        console.log("FakeComponent1: render");

        return <div>
            This is the fake component1: {this.props.title}
        </div>;
    }

}


interface IProps {
    readonly title: string;
}

interface IState {
}


