import * as React from "react";

export class SplitBarLeft extends React.PureComponent<IProps, any> {

    constructor(props: any, context: any) {
        super(props, context);
    }

    public render() {

        const width = this.props.width || 250;

        return (

            <div className="split-bar-left"
                 style={{
                     marginTop: 'auto',
                     marginBottom: 'auto',
                     width,
                     whiteSpace: 'nowrap'
                 }}>

                {this.props.children}

            </div>

        );
    }

}

interface IProps {
    readonly width?: number;
}
