/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {Logger} from 'polar-shared/src/logger/Logger';

const log = Logger.create();

class Styles {

    public static notice: React.CSSProperties = {

        position: 'fixed',
        width: '450px',
        bottom: '10px',
        right: '15px',
        zIndex: 9999,

    };

    public static intro: React.CSSProperties = {

        fontWeight: 'bold',
        fontSize: '22px',
        margin: '5px 0px 10px 0px'

    };

}

/**
 */
export class BubbleModal extends React.Component<IProps, IState> {

    constructor(props: any) {
        super(props);

        this.state = {
        };

    }

    public render() {

        const display = this.props.disabled  ? 'none' : 'block';

        return (

            <div style={{display}}>

                <div className="p-3 m-2 rounded" style={Styles.notice}>

                    {this.props.children}

                </div>

            </div>

        );
    }

}

export interface IProps {
    readonly disabled?: boolean;
}

export interface IState {
}
