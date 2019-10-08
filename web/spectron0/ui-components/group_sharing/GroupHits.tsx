import * as React from 'react';

export class GroupHits extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (

            <table style={{width: '100%'}}>
                <tr>
                    <th>
                        name
                    </th>
                    <th>
                        description
                    </th>
                    <th className="text-right">
                        members
                    </th>
                </tr>

                {this.props.children}
            </table>

        );
    }

}


interface IProps {
}

interface IState {

}
