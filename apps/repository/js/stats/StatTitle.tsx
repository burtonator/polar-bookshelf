import * as React from 'react';
import {Logger} from '../../../../web/js/logger/Logger';

const log = Logger.create();

export default class StatTitle extends React.Component<any, any> {

    constructor(props: any, context: any) {
        super(props, context);

    }

    public render() {

        return (

            <div className="pt-1 pb-1 w-100 text-center"
                 style={{fontWeight: 'bold', fontSize: '18px'}}>

                {this.props.children}

            </div>

        );
    }

}

