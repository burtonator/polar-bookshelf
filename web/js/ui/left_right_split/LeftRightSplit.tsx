import * as React from 'react';

export class LeftRightSplit extends React.PureComponent<IProps, any> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        let margins: Margins = {
            bottom: 'auto',
            top: undefined
        };

        const rightOpts = this.props.rightOpts || {};

        const verticalAlign = rightOpts.verticalAlign || 'top';

        if (verticalAlign === 'middle') {
            margins = {
                bottom: 'auto',
                top: 'auto'
            };
        }

        return (

            <div className={'split-layout' + " " + this.props.className || ""}
                 style={this.props.style}>

                <div style={{display: 'flex'}}>

                    <div className="split-left"
                         style={{
                             // marginTop: 'auto',
                             // marginBottom: 'auto',
                             verticalAlign: 'top'
                         }}>

                        {this.props.left}

                    </div>

                    <div className="split-right"
                         style={{
                             // marginTop: 'auto',
                             marginBottom: margins.bottom,
                             marginTop: margins.top,
                             marginLeft: 'auto',
                             display: 'flex',
                             justifyContent: 'flex-end',
                             // width: '100%',
                             verticalAlign
                         }}>

                        {this.props.right}

                    </div>

                </div>

            </div>
        );
    }

}

interface IProps {

    /**
     * Additional classes
     */
    readonly className?: string;

    readonly style?: React.CSSProperties;

    readonly left: JSX.Element;

    readonly right: JSX.Element;

    readonly rightOpts?: RightOpts;

}

interface RightOpts {
    readonly verticalAlign?: 'top' | 'middle';
}


interface Margins {
    bottom: 'auto' | undefined;
    top: 'auto' | undefined;
}
