import * as React from 'react';

export class ToggleIcon extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
        };

    }

    public render() {

        const activeClassName = this.props.active ? "doc-button-active" : "doc-button-inactive";

        return (<i className={activeClassName + " " + this.props.className + " doc-button"}
                   style={{fontSize: '16px'}}
                   title={this.props.title}/>);

    }

}

interface IProps {
    readonly className: string;
    readonly title: string;
    readonly active: boolean;
}

interface IState {
}
