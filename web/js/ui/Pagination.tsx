import * as React from 'react';

export class Pagination extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        const {results} = this.props;

        if (results === undefined || results.length === 0) {
            return (
                <div style={{display: 'flex'}}>
                    <div className="mt-3 mb-3 text-lg ml-auto mr-auto">
                        No results found.
                    </div>
                </div>
            );
        }

        return (
            <div className="">
                {this.props.children}
            </div>
        );
    }

}

export interface IProps {
    readonly results: ReadonlyArray<any> | undefined;
}

export interface IState {
}
