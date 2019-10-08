import * as React from 'react';
import {EditComment} from "./EditComment";
import {CancelButton} from "../CancelButton";
import {NullCollapse} from "../../../ui/null_collapse/NullCollapse";

export class CreateComment extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onCancel = this.onCancel.bind(this);

        this.state = {
            active: this.props.active || false
        };

    }

    public render() {

        const cancelButton = <CancelButton onClick={() => this.onCancel()}/>;

        return <NullCollapse open={this.props.active}>

            <EditComment id={'edit-comment-for' + this.props.id}
                         onComment={(html) => this.props.onComment(html)}
                         cancelButton={cancelButton}/>

        </NullCollapse>;

    }

    private onCancel() {
        this.props.onCancel();
    }

}
interface IProps {
    readonly id: string;
    readonly active: boolean;
    readonly onComment: (html: string) => void;
    readonly onCancel: () => void;
}

interface IState {
}


