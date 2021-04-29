import * as ReactDOM from "react-dom";
import * as React from "react";
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";
import {IRect} from "polar-shared/src/util/rects/IRect";
import {HighlightColor} from "polar-shared/src/metadata/IBaseHighlight";
import {HighlightColors} from "polar-shared/src/metadata/HighlightColor";
import {IDStr} from "polar-shared/src/util/Strings";
import {Rects} from "../../../../web/js/Rects";
import {useDocViewerStore} from "../DocViewerStore";
import {deepMemo, memoForwardRefDiv} from "../../../../web/js/react/ReactUtils";
import {useScrollIntoViewUsingLocation} from "./ScrollIntoViewUsingLocation";
import {PageAnnotation} from "./PageAnnotations";
import {TextHighlightMerger} from "../text_highlighter/TextHighlightMerger";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

interface IProps {
    readonly fingerprint: IDStr;
    readonly pageNum: number;
    readonly pageAnnotation: PageAnnotation<ITextHighlight>;
    readonly container: HTMLElement,
    readonly onClick?: React.EventHandler<React.MouseEvent>;
}

export const TextHighlightRendererStatic = deepMemo(function TextHighlightRendererStatic(props: IProps) {

    const {pageAnnotation, container} = props;
    const {onClick = NULL_FUNCTION, ...restProps} = props;
    const {annotation} = pageAnnotation;
    const {docScale} = useDocViewerStore(['docScale']);

    const rects = React.useMemo(() => {
        const orig = Object.values(annotation.rects || {})
        return TextHighlightMerger.merge(orig);
    }, [annotation.rects]);


    const toReactPortal = React.useCallback((rawTextHighlightRect: IRect,
                                             container: HTMLElement,
                                             idx: number) => {

        return ReactDOM.createPortal(
            <HighlightDelegate idx={idx}
                               rawTextHighlightRect={rawTextHighlightRect}
                               onClick={onClick}
                               {...restProps}/>,
            container);

    }, [props]);

    if (! container) {
        console.warn("No container");
        return null;
    }

    if (! docScale) {
        console.log("No docScale");
        return null;
    }

    if (rects.length === 0) {
        console.log("No textHighlight rects for text highlight: ", props.pageAnnotation.annotation.id);
        return null;
    }

    const portals = rects.map((current, idx) => toReactPortal(current, container, idx));

    return (
        <>
            {portals}
        </>
    );

});

interface HighlightDelegateProps extends IProps {
    readonly idx: number;
    readonly rawTextHighlightRect: IRect;
    readonly onClick?: React.EventHandler<React.MouseEvent>;
}

export const HighlightDelegate = memoForwardRefDiv((props: HighlightDelegateProps) => {

    const {idx, rawTextHighlightRect, onClick = NULL_FUNCTION} = props;
    const {pageAnnotation, fingerprint, pageNum} = props;
    const {annotation} = pageAnnotation;
    const {docScale} = useDocViewerStore(['docScale']);
    const rects = Object.values(annotation.rects || {})
    const scrollIntoViewRef = useScrollIntoViewUsingLocation();

    if (! docScale) {
        console.log("No docScale");
        return null;
    }

    if (rects.length === 0) {
        console.log("No textHighlight rects for text highlight: ", props.pageAnnotation.annotation.id);
        return null;
    }

    const {scaleValue} = docScale;

    const createScaledRect = React.useCallback((textHighlightRect: IRect): IRect => {

        // this is only needed for PDF and we might be able to use a
        // transform in the future which would be easier.  For all other
        // document formats the scale should just be '1'
        return Rects.scale(textHighlightRect, scaleValue);

    }, [scaleValue]);

    const className = `text-highlight annotation text-highlight-${annotation.id}`;
    const textHighlightRect = createScaledRect(rawTextHighlightRect);

    const color: HighlightColor = annotation.color || 'yellow';
    const backgroundColor = HighlightColors.toBackgroundColor(color, 0.5);

    const createDOMID = React.useCallback(() => {

        if (idx === 0) {
            return annotation.id;
        }

        return annotation.id + "-" + idx;

    }, [annotation.id, idx]);

    const id = createDOMID();

    return (
        <div id={id}
             ref={scrollIntoViewRef}
             data-type="text-highlight"
             data-doc-fingerprint={fingerprint}
             data-text-highlight-id={annotation.id}
             data-page-num={pageNum}
            // annotation descriptor metadata - might not be needed
            // anymore
             data-annotation-type="text-highlight"
             data-annotation-id={annotation.id}
             data-annotation-page-num={pageNum}
             data-annotation-doc-fingerprint={fingerprint}
             data-annotation-color={color}
             className={className}
             onClick={onClick}
             style={{
                 position: 'absolute',
                 backgroundColor,
                 left: `${textHighlightRect.left}px`,
                 top: `${textHighlightRect.top}px`,
                 width: `${textHighlightRect.width}px`,
                 height: `${textHighlightRect.height}px`,
                 mixBlendMode: 'multiply',
                 zIndex: 1,
             }}/>
    );

});
