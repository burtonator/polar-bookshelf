import * as React from 'react';

// https://stackoverflow.com/questions/43441856/reactjs-how-to-scroll-to-an-element
// http://www.albertgao.xyz/2018/06/07/scroll-a-not-in-view-component-into-the-view-using-react/

export class ScrollIntoView extends React.PureComponent<IProps, IState> {

    private ref: React.RefObject<any>;

    constructor(props: IProps, context: any) {
        super(props, context);

        this.ref = React.createRef();
    }

    public render() {

        return (

            <div ref={this.ref}>
                {this.props.children}
            </div>
        );
    }

    public componentDidMount() {

        if (this.ref) {

            if (this.ref.current) {
                this.ref.current.scrollIntoView();
            } else {
                console.warn("No current");
            }
        } else {
            console.warn("No ref");
        }
    }

}


interface IProps {
}

interface IState {

}


