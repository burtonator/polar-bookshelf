import * as React from 'react';

export class SplitLayoutRight extends React.PureComponent<IProps, any> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        let margins: Margins = {
            bottom: 'auto',
            top: undefined
        };

        if (this.props.verticalAlign === 'middle') {
            margins = {
                bottom: 'auto',
                top: 'auto'
            };
        }

        return (

            <div className="split-layout-right"
                 style={{
                     // marginTop: 'auto',
                     marginBottom: margins.bottom,
                     marginTop: margins.top,
                     marginLeft: 'auto',
                     display: 'flex',
                     justifyContent: 'flex-end',
                     // width: '100%',
                     verticalAlign: this.props.verticalAlign || 'top'
                 }}>

                {this.props.children}

            </div>

        );
    }

}

interface IProps {
    readonly verticalAlign?: 'top' | 'middle';
}

interface Margins {
    bottom: 'auto' | undefined;
    top: 'auto' | undefined;
}
