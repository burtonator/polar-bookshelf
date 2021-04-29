import React from "react";
import clsx from "clsx";
import {Box, createStyles, Grow, makeStyles, MenuItem, MenuList} from "@material-ui/core";
import {useAnnotationPopupStyles} from "./AnnotationPopup";
import {AnnotationPopupActionEnum, useAnnotationPopupAction} from "./AnnotationPopupActionContext";
import {useAnnotationMutationsContext} from "../../../../../web/js/annotation_sidebar/AnnotationMutationsContext";
import {ColorMenu} from "../../../../../web/js/ui/ColorMenu";


const ColorPicker: React.FC = () => {
    const {annotation} = useAnnotationPopupAction();
    const annotationMutations = useAnnotationMutationsContext();

    const handleColor = annotationMutations.createColorCallback({selected: [annotation]});

    return <ColorMenu selected={annotation.color} onChange={color => handleColor({ color })} />;
};

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            marginBottom: 10,
        },
    }),
);

const ACTIONS: Record<AnnotationPopupActionEnum, React.FC> = {
    [AnnotationPopupActionEnum.CHANGE_COLOR]: ColorPicker,
};

export const AnnotationPopupActions = () => {
    const {activeAction} = useAnnotationPopupAction();
    const annotationPopupClasses = useAnnotationPopupStyles();
    const classes = useStyles();
    const ActionComponent = activeAction ? ACTIONS[activeAction] : null;

    return (
        <Grow style={{ transformOrigin: "bottom center" }} in={activeAction !== null}>
            <Box
                className={clsx(annotationPopupClasses.root, classes.root)}
                boxShadow={8}
                style={{ position: "absolute", bottom: "100%", left: 0 }}
            >
                {ActionComponent && <ActionComponent /> }
            </Box>
        </Grow>
    );
};
