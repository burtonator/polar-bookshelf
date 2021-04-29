import React from "react";
import clsx from "clsx";
import {Box, createStyles, Divider, Grow, makeStyles, MenuItem, MenuList, Popper} from "@material-ui/core";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {IDocAnnotation} from "../../../../../web/js/annotation_sidebar/DocAnnotation";
import {AnnotationType} from "polar-shared/src/metadata/AnnotationType";
import {DocAnnotations} from "../../../../../web/js/annotation_sidebar/DocAnnotations";
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";
import NoteIcon from "@material-ui/icons/Note";
import FlashOnIcon from "@material-ui/icons/FlashOn";
import EditIcon from "@material-ui/icons/Edit";
import FlashAutoIcon from "@material-ui/icons/FlashAuto";
import CommentIcon from "@material-ui/icons/Comment";
import PaletteIcon from "@material-ui/icons/Palette";
import {StandardIconButton} from "../../../../repository/js/doc_repo/buttons/StandardIconButton";
import {MUIButtonBar} from "../../../../../web/js/mui/MUIButtonBar";
import {MUIDocDeleteButton} from "../../../../repository/js/doc_repo/buttons/MUIDocDeleteButton";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {useAnnotationMutationsContext} from "../../../../../web/js/annotation_sidebar/AnnotationMutationsContext";
import {MUIDropdownCaret} from "../../../../../web/js/mui/MUIDropdownCaret";
import {useAnnotationPopupStyles} from "./AnnotationPopup";
import {AnnotationPopupActionEnum, useAnnotationPopupAction} from "./AnnotationPopupActionContext";
import {AnnotationTagButton2} from "../../../../../web/js/annotation_sidebar/AnnotationTagButton2";
import {Clipboards} from "../../../../../web/js/util/system/clipboard/Clipboards";
import {AnnotationTypes} from "../../../../../web/js/metadata/AnnotationTypes";
import {useDialogManager} from "../../../../../web/js/mui/dialogs/MUIDialogControllers";

const copyAnnotationToClipboard = (annotation: IDocAnnotation, type: AnnotationType) => {
    const annotationOriginal = annotation.original;
    if (AnnotationTypes.isTextHighlight(annotationOriginal, type)) {
        Clipboards.writeText(annotation.text || "");
    }
};

export const AnnotationPopupBar: React.FC = () => {
    const {activeAction, toggleAction, annotation, type} = useAnnotationPopupAction();
    const dialogs = useDialogManager();

    const annotationPopupClasses = useAnnotationPopupStyles();
    const annotationMutations = useAnnotationMutationsContext()
    const handleDelete = annotationMutations.createDeletedCallback({selected: [annotation]});
    const handleCopy = () => {
        copyAnnotationToClipboard(annotation, type);
        dialogs.snackbar({ message: "Copied annotation contents to clipboard successfully!" });
    };

    return (
        <Box
            boxShadow={8}
            display="flex"
            className={clsx(annotationPopupClasses.root, annotationPopupClasses.barPadding)}
        >
            <MUIButtonBar>
                <ColorChanger
                    annotation={annotation}
                    isOpen={activeAction === AnnotationPopupActionEnum.CHANGE_COLOR}
                    onToggle={toggleAction(AnnotationPopupActionEnum.CHANGE_COLOR)}
                />
                <Divider orientation="vertical" flexItem={true}/>
                <StandardIconButton tooltip="Edit highlight" size="small" onClick={NULL_FUNCTION}>
                    <EditIcon />
                </StandardIconButton>
                <StandardIconButton tooltip="Comment" size="small" onClick={NULL_FUNCTION}>
                    <CommentIcon />
                </StandardIconButton>
                <StandardIconButton tooltip="Create flashcard manually" size="small" onClick={NULL_FUNCTION}>
                    <FlashOnIcon />
                </StandardIconButton>
                <StandardIconButton tooltip="Create flashcard automatically" size="small" onClick={NULL_FUNCTION}>
                    <FlashAutoIcon />
                </StandardIconButton>
                <AnnotationTagButton2 annotation={annotation}/>
                <Divider orientation="vertical" flexItem={true}/>
                <StandardIconButton tooltip="Copy" size="small" onClick={handleCopy}>
                    <NoteIcon />
                </StandardIconButton>
                <MUIDocDeleteButton onClick={handleDelete} size="small" />
            </MUIButtonBar>
        </Box>
    );
};

type IColorChangerProps = {
    onToggle: () => void;
    isOpen: boolean;
    annotation: IDocAnnotation;
}

const ColorChanger: React.FC<IColorChangerProps> = ({ onToggle, isOpen, annotation }) => {
    return (
        <div style={{ cursor: "pointer" }} onClick={onToggle}>
            <StandardIconButton tooltip="Change color" size="small" onClick={NULL_FUNCTION}>
                <PaletteIcon style={{ color: annotation.color }} />
            </StandardIconButton>
            <MUIDropdownCaret style={{ transform: `rotate(${isOpen ? 0 : Math.PI}rad)` }} />
        </div>
    );
};
