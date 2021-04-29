import * as React from "react";
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";
import {IDStr} from "polar-shared/src/util/Strings";
import {useDocViewerContext} from "../renderers/DocRenderer";
import {memoForwardRef} from "../../../../web/js/react/ReactUtils";
import {TextHighlightRendererStatic} from "./TextHighlightRendererStatic";
import {TextHighlightRendererDynamic} from "./TextHighlightRendererDynamic";
import {PageAnnotation} from "./PageAnnotations";
import {useDocViewerCallbacks} from "../DocViewerStore";
import {AnnotationType} from "polar-shared/src/metadata/AnnotationType";

interface IProps {
    readonly fingerprint: IDStr;
    readonly pageNum: number;
    readonly pageAnnotation: PageAnnotation<ITextHighlight>;
    readonly container: HTMLElement,
}

export const TextHighlightRenderer = memoForwardRef((props: IProps) => {

    const {fileType} = useDocViewerContext();
    const {setHighlightBar} = useDocViewerCallbacks();

    const handleClick: React.EventHandler<React.MouseEvent> = () => {
        setHighlightBar({
            highlightID: props.pageAnnotation.annotation.id,
            pageNum: props.pageNum,
            type: AnnotationType.TEXT_HIGHLIGHT,
        });
    };

    switch (fileType) {

        case "pdf":
            return (
                <TextHighlightRendererStatic onClick={handleClick} {...props}/>
            );
        case "epub":
            return (
                <TextHighlightRendererDynamic onClick={handleClick} {...props}/>
            );

    }

});
