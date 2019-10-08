import React from 'react';
import {NullCollapse} from '../null_collapse/NullCollapse';

/**
 * Used to hold a dialog and to center it on the screen and so forth.
 */
export class DialogContainer extends React.PureComponent<ConfirmProps, IState> {

    constructor(props: any) {
        super(props);

    }

    public render() {

        return (

            <NullCollapse open={this.props.open}>

                <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        display: 'flex'
                    }}>

                    <div className="rounded border p-2"
                         style={{
                            margin: 'auto',
                            minHeight: '100px',
                            zIndex: 1000000,
                            backgroundColor: 'var(--white)'
                         }}>

                        {this.props.children}

                    </div>

                </div>

            </NullCollapse>

        );

    }

}

export interface ConfirmProps {
    readonly open: boolean;
}

export interface IState {

}
