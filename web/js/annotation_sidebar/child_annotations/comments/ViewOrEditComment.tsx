import * as React from 'react';
import {DocAnnotation} from '../../DocAnnotation';
import {EditButton} from "../EditButton";
import {EditComment} from "./EditComment";
import {ViewComment} from "./ViewComment";
import {CancelButton} from "../CancelButton";
import {Comment} from '../../../metadata/Comment';
import {Doc} from '../../../metadata/Doc';

export class ViewOrEditComment extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onEdit = this.onEdit.bind(this);
        this.onCancel = this.onCancel.bind(this);

        this.state = {
            mode: 'view'
        };

    }

    public render() {

        const editButton = <EditButton id={'edit-button-for-' + this.props.id}
                                       disabled={! this.props.doc.mutable}
                                       onClick={() => this.onEdit()}
                                       type="comment"/>;

        const cancelButton = <CancelButton onClick={() => this.onCancel()}/>;

        const existingComment = this.props.comment.original as Comment;

        if (this.state.mode === 'view') {

            return <ViewComment comment={this.props.comment}
                                doc={this.props.doc}
                                editButton={editButton}/>;

        } else {
            return <EditComment id={'edit-comment-for' + this.props.id}
                                onComment={(html) => this.props.onComment(html, existingComment)}
                                existingComment={existingComment}
                                cancelButton={cancelButton}/>;
        }

    }

    private onEdit() {
        this.setState({mode: 'edit'});
    }

    private onCancel() {
        this.setState({mode: 'view'});
    }

}
interface IProps {
    readonly id: string;
    readonly doc: Doc;
    readonly comment: DocAnnotation;
    readonly onComment: (html: string, existingComment: Comment) => void;
}

interface IState {
    readonly mode: 'view' | 'edit';
}


