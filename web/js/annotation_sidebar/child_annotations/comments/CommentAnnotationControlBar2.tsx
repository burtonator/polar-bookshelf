import * as React from 'react';
import {IDocAnnotationRef} from '../../DocAnnotation';
import {DocAuthor} from "../../DocAuthor";
import {DocAnnotationMoment} from "../../DocAnnotationMoment";
import {NullCollapse} from "../../../ui/null_collapse/NullCollapse";
import Divider from '@material-ui/core/Divider';
import isEqual from 'react-fast-compare';
import {AnnotationTagButton2} from "../../AnnotationTagButton2";
import {MUIButtonBar} from "../../../mui/MUIButtonBar";
import {useAnnotationMutationsContext} from "../../AnnotationMutationsContext";
import {MUIDocDeleteButton} from "../../../../../apps/repository/js/doc_repo/buttons/MUIDocDeleteButton";

interface IProps {
    readonly comment: IDocAnnotationRef;
    readonly editButton: JSX.Element;
    readonly onEdit: () => void;
}

export const CommentAnnotationControlBar2 = React.memo((props: IProps) => {

    const { comment } = props;

    const annotationMutations = useAnnotationMutationsContext();

    const handleDelete = annotationMutations.createDeletedCallback({selected: [comment]});

    return (
        <>
            <div style={{
                     display: 'flex',
                     alignItems: 'center',
                 }}
                 className="pt-1 pb-1">

                <MUIButtonBar>
                    <DocAuthor author={comment.author}/>

                    <div className="text-muted">
                        <DocAnnotationMoment created={comment.created}/>
                    </div>

                </MUIButtonBar>

                <MUIButtonBar style={{
                                 flexGrow: 1,
                                 justifyContent: 'flex-end'
                              }}>

                    {! comment.immutable && props.editButton}

                    <AnnotationTagButton2 annotation={props.comment}/>

                    <MUIDocDeleteButton size="small"
                                        onClick={handleDelete}/>

                    {/*<CommentDropdown2 id={'comment-dropdown-' + comment.id}*/}
                    {/*                  disabled={comment.immutable}*/}
                    {/*                  comment={comment}*/}
                    {/*                  onDelete={handleDelete}/>*/}

                </MUIButtonBar>

            </div>
            <Divider/>
        </>

    );

}, isEqual);



