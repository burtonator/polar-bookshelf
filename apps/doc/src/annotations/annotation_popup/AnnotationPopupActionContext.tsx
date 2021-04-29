import {AnnotationType} from "polar-shared/src/metadata/AnnotationType";
import React from "react";
import {IDocAnnotation} from "../../../../../web/js/annotation_sidebar/DocAnnotation";

export enum AnnotationPopupActionEnum {
    CHANGE_COLOR = "CHANGE_COLOR"
};

type IAnnotationPopupActionContext = {
    activeAction: AnnotationPopupActionEnum | null;
    toggleAction: (action: AnnotationPopupActionEnum) => () => void;
    clear: () => void;
    annotation: IDocAnnotation;
    type: AnnotationType.TEXT_HIGHLIGHT | AnnotationType.AREA_HIGHLIGHT;
};

const AnnotationPopupActionContext = React.createContext<IAnnotationPopupActionContext | null>(null);

type IAnnotationPopupActionProviderProps = {
    annotation: IDocAnnotation;
    type: AnnotationType.TEXT_HIGHLIGHT | AnnotationType.AREA_HIGHLIGHT;
};

export const AnnotationPopupActionProvider: React.FC<IAnnotationPopupActionProviderProps> = (props) => {
    const {annotation, type, ...restProps} = props;
    const [activeAction, setActiveAction] = React.useState<AnnotationPopupActionEnum | null>(null);
    const toggleAction = React.useCallback(
        (action: AnnotationPopupActionEnum) => () =>
            setActiveAction(activeAction => activeAction && activeAction === action ? null : action)
    , []);

    const clear = React.useCallback(() => setActiveAction(null), []);

    const value: IAnnotationPopupActionContext = {
        toggleAction,
        activeAction,
        clear,
        annotation,
        type,
    };

    return <AnnotationPopupActionContext.Provider value={value} {...restProps} />;
};

export const useAnnotationPopupAction = () => {
    const context = React.useContext(AnnotationPopupActionContext);
    if (!context) {
        throw new Error("useAnnotationPopupAction must be used within a component that's rendered within the AnnotationPopupActionContextProvider");
    }
    return context;
}

