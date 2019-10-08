import * as React from 'react';

export class LoadingProgress extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (
            <div className="mt-2 mb-2"
                 style={{
                     display: 'flex',
                     color: 'var(--primary)',
                     opacity: 0.8
                 }}>

                <div className="fa-6x ml-auto mr-auto">
                    <i className="fas fa-circle-notch fa-spin"/>
                </div>

            </div>
        );
    }

}

export interface IProps {
}

export interface IState {
}
