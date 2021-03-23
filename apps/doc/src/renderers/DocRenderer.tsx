import {PDFViewerContainer} from "./pdf/PDFViewerContainer";
import PDFDocument from "./pdf/PDFDocument";
import * as React from "react";
import {useDocViewerStore} from "../DocViewerStore";
import {URLStr} from "polar-shared/src/util/Strings";
import {EPUBDocument} from "./epub/EPUBDocument";
import {EPUBViewerContainer} from "./epub/EPUBViewerContainer";
import {FileTypes} from "../../../../web/js/apps/main/file_loaders/FileTypes";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {FileType} from "../../../../web/js/apps/main/file_loaders/FileType";
import {EPUBFinderProvider} from "./epub/EPUBFinderStore";
import {isPresent} from "polar-shared/src/Preconditions";
import { EPUBDocumentStoreProvider } from "./epub/EPUBDocumentStore";
import { ResizeOnSidenavDocumentChange } from "./ResizeOnSidenavDocumentChange";

interface ILoadedProps {
    readonly docURL: URLStr;
    readonly docMeta: IDocMeta;
    readonly children: React.ReactNode;
}

const PDFDocumentRenderer = (props: ILoadedProps) => {

    return (
        <>
            <PDFViewerContainer>
                <PDFDocument {...props}/>
            </PDFViewerContainer>

        </>
    );
}

const EPUBDocumentRenderer = (props: ILoadedProps) => {
    return (
        <EPUBDocumentStoreProvider>
            <EPUBFinderProvider>
                <>
                    <EPUBViewerContainer>
                        <EPUBDocument {...props}/>
                    </EPUBViewerContainer>

                </>
            </EPUBFinderProvider>
        </EPUBDocumentStoreProvider>
    );
}

interface IDocViewerContext {
    readonly fileType: FileType;
    readonly docID: string;
}

export const DocViewerContext = React.createContext<IDocViewerContext>(null!);

/**
 * Provided so we can determine which type of doc type we should load (epub,
 * pdf, etc)
 */
export function useDocViewerContext(): IDocViewerContext {
    const result = React.useContext(DocViewerContext);

    if (! isPresent(result)) {
        throw new Error("DocViewerContext not defined.");
    }

    return result;
}

export function useIsDocViewerContext() {

    const result = React.useContext(DocViewerContext);

    return isPresent(result);

}

interface DocRendererDelegateProps {
    readonly docURL: string,
    readonly docMeta: IDocMeta;
    readonly fileType: FileType;
    readonly children: React.ReactNode;
}

const DocRendererDelegate = React.memo((props: DocRendererDelegateProps) => {

    switch (props.fileType) {

        case "pdf":
            return (
                <PDFDocumentRenderer docURL={props.docURL} docMeta={props.docMeta}>
                    {props.children}
                </PDFDocumentRenderer>
            );
        case "epub":
            return (
                <EPUBDocumentRenderer docURL={props.docURL} docMeta={props.docMeta}>
                    {props.children}
                </EPUBDocumentRenderer>
            );
        default:
            return null;
    }

});

interface IProps {
    readonly children: React.ReactNode;
}

export const DocRenderer = React.memo(function DocRenderer(props: IProps) {

    const {docURL, docMeta} = useDocViewerStore(['docURL', 'docMeta']);

    if (! docURL || ! docMeta) {
        return null;
    }

    const fileType = FileTypes.create(docURL);

    return (
        <DocRendererDelegate docURL={docURL} docMeta={docMeta} fileType={fileType}>
            <>
                {props.children}
                <ResizeOnSidenavDocumentChange/>
            </>
        </DocRendererDelegate>
    );

});
