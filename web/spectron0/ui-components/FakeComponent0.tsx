import * as React from 'react';
import Button from 'reactstrap/lib/Button';
import {FakeComponent1} from './FakeComponent1';

export class FakeComponent0 extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
            title: "this is the first title"
        };

    }

    public render() {

        console.log("FakeComponent0: render");

        return <div>
            This is the fake component0:

            <Button onClick={() => this.setState({title: "This is the new title"})}>
                Click Me
            </Button>


            <FakeComponent1 title={this.state.title}/>

        </div>;
    }

}


interface IProps {
}

interface IState {
    readonly title: string;
}


