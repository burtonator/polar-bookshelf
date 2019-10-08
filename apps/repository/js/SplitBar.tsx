import * as React from 'react';
import {Logger} from 'polar-shared/src/logger/Logger';

const log = Logger.create();

export class SplitBar extends React.PureComponent<any, any> {

    constructor(props: any, context: any) {
        super(props, context);
    }

    public render() {

        return (

            <div className="split-bar pl-0 pr-0">

                <div style={{display: 'flex'}}>

                    {this.props.children}

                </div>

            </div>
        );
    }

}

export class SplitBarRight extends React.PureComponent<any, any> {

    constructor(props: any, context: any) {
        super(props, context);
    }

    public render() {

        return (

            <div className="split-bar-right"
                 style={{marginTop: 'auto', marginBottom: 'auto', display: 'flex', justifyContent: 'flex-end', width: '100%'}}>

                {this.props.children}

            </div>

        );
    }

}
