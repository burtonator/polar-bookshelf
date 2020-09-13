import * as React from "react";
import {IDocAnnotationRef} from "./DocAnnotation";
import {CreateComment2} from "./child_annotations/comments/CreateComment2";
import {EditTextHighlight2} from "./child_annotations/comments/EditTextHighlight2";
import {CreateFlashcard2} from "./child_annotations/flashcards/CreateFlashcard2";
import {deepMemo} from "../react/ReactUtils";

interface IProps {
    readonly annotation: IDocAnnotationRef;
}

export const AnnotationInputView = deepMemo((props: IProps) => {

    const {annotation} = props;

    return (
        <>

            <EditTextHighlight2 id={annotation.id}
                                html={annotation.html || ""}
                                annotation={annotation}
                                />

            <CreateComment2 parent={annotation}/>

            <CreateFlashcard2 parent={annotation}/>

        </>
    );
});
