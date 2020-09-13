import * as React from 'react';
import {IDocAnnotationRef} from '../../DocAnnotation';
import {DocAnnotationMoment} from "../../DocAnnotationMoment";
import {DocAuthor} from "../../DocAuthor";
import Divider from "@material-ui/core/Divider";
import {useDocMetaContext} from "../../DocMetaContextProvider";
import {AnnotationTagButton2} from "../../AnnotationTagButton2";
import {MUIButtonBar} from "../../../mui/MUIButtonBar";
import {
    IDeleteMutation,
    useAnnotationMutationsContext
} from "../../AnnotationMutationsContext";
import {deepMemo} from "../../../react/ReactUtils";
import {MUIDocDeleteButton} from "../../../../../apps/repository/js/doc_repo/buttons/MUIDocDeleteButton";

interface IProps {
    readonly flashcard: IDocAnnotationRef;
    readonly editButton: JSX.Element;
    readonly onEdit: () => void;
}

/**
 * A generic wrapper that determines which sub-component to render.
 */
export const FlashcardAnnotationControlBar2 = deepMemo((props: IProps) => {

    const { flashcard } = props;

    const {doc} = useDocMetaContext();
    const annotationMutations = useAnnotationMutationsContext();

    const handleDelete = () => {
        const mutation: IDeleteMutation = {
            selected: [props.flashcard]
        };

        annotationMutations.onDeleted(mutation);
    };

    return (
        <>

            <div style={{
                     display: 'flex',
                     flexGrow: 1
                 }}
                 className="pt-1 pb-1">

                <MUIButtonBar>
                    <DocAuthor author={flashcard.author}/>
                    <DocAnnotationMoment created={flashcard.created}/>
                </MUIButtonBar>

                <MUIButtonBar key="right-bar"
                              style={{
                                   justifyContent: 'flex-end',
                                   flexGrow: 1
                               }}>

                    {props.editButton}

                    <AnnotationTagButton2 annotation={props.flashcard}/>

                    <MUIDocDeleteButton size="small"
                                        onClick={handleDelete}/>

                </MUIButtonBar>

            </div>

            <Divider/>

        </>

    );
});


