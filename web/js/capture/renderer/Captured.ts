import {Browser} from '../Browser';
import {AdBlockResult} from './AdBlocker';

export interface Captured {

    capturedDocuments: {[url: string]: CapturedDoc};

    /**
     * The type of this captured content.  Right now we only support PHZ but
     * there might be other formats in the future.
     */
    type: 'phz';

    version: string;

    title: string;

    url: string;

    /**
     * @deprecated Use scrollBox instead.
     */
    scroll?: ScrollBox;

    scrollBox?: ScrollBox;

    /**
     * This is added after the capture is complete but usually present in the
     * result.  Older formats did not have this field though.
     */
    browser?: Browser;

}

export interface CapturedDoc {

    title: string;
    href: string;
    url: string;
    scrollHeight: number;
    scrollBox: ScrollBox;

    /**
     * The content as an HTML string
     */
    content: string;

    /**
     * The length of the content in number of characters.  This is NOT
     * the content length which would be the number of bytes.
     */
    contentTextLength: number;

    mutations: Mutations;

    docTypeFormat?: DocTypeFormat;

    /**
     * The HTML content type from document.contentType
     */
    contentType?: string;

}

export interface ScrollBox {

    width: number;
    widthOverflow?: Overflow;

    height: number;
    heightOverflow?: Overflow;

}

export interface Mutations {
    eventAttributesRemoved: number;
    existingBaseRemoved: boolean;
    baseAdded: boolean;
    javascriptAnchorsRemoved: number;
    cleanupRemoveScripts: any;
    cleanupHead: any;
    cleanupBase: any;
    showAriaHidden: number;
    adsBlocked?: AdBlockResult;
}

export type Overflow = 'visible' | 'hidden';

export type DocTypeFormat = 'html' | 'xml';
