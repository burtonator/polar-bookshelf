import * as React from 'react';
import {useCallback, useState} from 'react';
import {IDocAnnotationRef} from '../../DocAnnotation';
import {EditButton} from "../EditButton";
import {CancelButton} from "../CancelButton";
import {Comment} from '../../../metadata/Comment';
import {useDocMetaContext} from "../../DocMetaContextProvider";
import {CommentAnnotationView2} from "./CommentAnnotationView2";
import isEqual from "react-fast-compare";
import {EditComment2} from "./EditComment2";
import {
    ICommentUpdate,
    useAnnotationMutationsContext
} from "../../AnnotationMutationsContext";
import {useAnnotationActiveInputContext} from "../../AnnotationActiveInputContext";
import {CommentAnnotationControlBar2} from "./CommentAnnotationControlBar2";


interface IProps {
    readonly comment: IDocAnnotationRef;
}

type UsageMode = 'view' | 'edit';

export const ViewOrEditComment2 = React.memo((props: IProps) => {

    const {comment} = props;

    const {doc} = useDocMetaContext();
    const annotationInputContext = useAnnotationActiveInputContext();
    const annotationMutations = useAnnotationMutationsContext();

    const [mode, setMode] = useState<UsageMode>('view')

    const onEdit = useCallback(() => setMode('edit'), []);
    const onCancel = useCallback(() => setMode('view'), []);

    const editButton = <EditButton id={'edit-button-for-' + props.comment.id}
                                   disabled={! doc?.mutable}
                                   onClick={onEdit}
                                   type="comment"/>;

    const cancelButton = <CancelButton onClick={onCancel}/>;

    const existingComment = props.comment.original as Comment;

    const commentCallback = annotationMutations.createCommentCallback(comment);

    const handleComment = React.useCallback((body: string) => {

        setMode('view');

        annotationInputContext.reset();

        const mutation: ICommentUpdate = {
            type: 'update',
            parent: comment.parent!,
            body,
            existing: comment
        };

        commentCallback(mutation);

    }, []);

    return (
        <div className="p-1">

            {mode === 'view' &&
                <CommentAnnotationView2 comment={props.comment}
                                        onEdit={onEdit}
                                        editButton={editButton}/>}

            {mode === 'edit' &&
                <EditComment2 id={'edit-comment-for' + props.comment.id}
                              existingComment={existingComment}
                              cancelButton={cancelButton}
                              onComment={handleComment}
                />}

            <CommentAnnotationControlBar2 comment={props.comment}
                                          onEdit={onEdit}
                                          editButton={editButton}/>

        </div>
    );



}, isEqual);
