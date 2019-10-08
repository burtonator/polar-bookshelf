/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';

export class VerticalAlign extends React.PureComponent<IProps, IState> {

    constructor(props: IProps) {
        super(props);


    }

    public render() {

        return (

            <div className="mt-auto mb-auto">
                {this.props.children}
            </div>

        );

    }

}

interface IProps {

}

interface IState {
}
