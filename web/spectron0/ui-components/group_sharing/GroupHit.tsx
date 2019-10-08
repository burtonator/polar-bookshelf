import * as React from 'react';
import Button from "reactstrap/lib/Button";

export class GroupHit extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (

            <tr className="" style={{display: 'table-row'}}>

                <td>
                    {this.props.name}
                </td>

                <td>
                    {this.props.description}
                </td>

                <td className="text-right">
                    {this.props.nrMembers}
                </td>

                <td>

                    <Button color="primary"
                            size="sm"
                            className="ml-1"
                            onClick={() => this.props.onAdd()}>
                        Add
                    </Button>

                </td>

            </tr>

        );
    }

}


interface IProps {
    readonly name: string;
    readonly description: string;
    readonly nrMembers: number;
    readonly onAdd: () => void;
}

interface IState {

}
