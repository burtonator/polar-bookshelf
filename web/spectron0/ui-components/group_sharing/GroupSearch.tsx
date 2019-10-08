import * as React from 'react';
import FormGroup from "reactstrap/lib/FormGroup";
import Input from "reactstrap/lib/Input";
import Label from "reactstrap/lib/Label";

export class GroupSearch extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (

            <div>

                <FormGroup>

                    <Label for="searchByTagOrName">Find groups:</Label>
                    <Input type="text"
                           name="searchByTagOrName"
                           id="searchByTagOrName"
                           placeholder="Search by tag or name" />

                </FormGroup>

            </div>

        );
    }

}


interface IProps {
}

interface IState {

}
