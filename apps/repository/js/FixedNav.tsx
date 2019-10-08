import * as React from 'react';


export class FixedNav extends React.Component<IProps, any> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {
        return (

            <div {...(this.props.id ? {id: this.props.id} : {})}
                 {...(this.props.className ? {className: this.props.className} : {})}
                 style={{
                     display: 'flex',
                     flexDirection: 'column',
                     height: '100%'
                 }}>

                {this.props.children}

            </div>

        );
    }

}

export class FixedNavBody extends React.Component<IProps, any> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (

            <div {...(this.props.id ? {id: this.props.id} : {})}
                 {...(this.props.className ? {className: this.props.className} : {})}
                 style={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    height: '100%',
                    width: '100%'
                 }}>

                {this.props.children}

            </div>

        );
    }

}

export interface IProps {
    readonly id?: string;
    readonly className?: string;
}

