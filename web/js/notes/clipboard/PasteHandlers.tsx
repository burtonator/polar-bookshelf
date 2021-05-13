import React from "react";
import {DataURLs} from "polar-shared/src/util/DataURLs";
import {URLStr} from "polar-shared/src/util/Strings";
import { Blobs } from "polar-shared/src/util/Blobs";
import {Images} from "polar-shared/src/util/Images";

export interface IPasteImageData {
    readonly url: URLStr;
    readonly width: number;
    readonly height: number;
}

export interface IPasteHandlerOpts {
    readonly onPasteImage: (image: IPasteImageData) => void;
    readonly onPasteError: (err: Error) => void;
}

export type PasteImageType =
    'image/webp' |
    'image/png' |
    'image/jpeg' |
    'image/gif' |
    'image/svg+xml' |
    'image/avif' |
    'image/apng';

interface IPasteItemForImage {
    readonly kind: 'image'
    readonly type: PasteImageType;
    readonly dataTransferItem: DataTransferItem;
}

interface IPasteItemForUnknown {
    readonly kind: 'unknown'
    readonly type: string;
}

export type PasteItem = IPasteItemForImage | IPasteItemForUnknown;

function toPasteItem(item: DataTransferItem): PasteItem {

    switch (item.type) {
        case 'image/webp':
        case 'image/png':
        case 'image/jpeg':
        case 'image/gif':
        case 'image/svg+xml':
        case 'image/avif':
        case 'image/apng':

            return {
                kind: 'image',
                type: item.type,
                dataTransferItem: item,
            }
        default:
            return {
                kind: 'unknown',
                type: item.type,
            }

    }

}

function isImagePaste(pasteItems: ReadonlyArray<PasteItem>): boolean {

    for (const pasteItem of pasteItems) {

        switch (pasteItem.kind) {
            case 'image':
                return true;
        }

    }

    return false;

}



/**
 * Clipboard paste handler that takes clipboard data given to us via an onPaste
 * handler, then handles it directly.
 */
export function usePasteHandler(opts: IPasteHandlerOpts) {

    const {onPasteImage, onPasteError} = opts;

    return React.useCallback((event: React.ClipboardEvent) => {

        // TODO: we need to handle other type's of pastes including
        //
        // PDF, just raw links...
        // text, etc.

        const pasteItems = Array.from(event.clipboardData.items)
                                .map(toPasteItem);

        async function doAsync() {

            for (const pasteItem of pasteItems) {

                switch (pasteItem.kind) {
                    case 'image':
                        const file = pasteItem.dataTransferItem.getAsFile()

                        if (file) {

                            const ab = await Blobs.toArrayBuffer(file)
                            const dataURL = DataURLs.encode(ab, pasteItem.type);

                            // const resolution = await ImageResolutions.compute(file);

                            const dimensions = await Images.getDimensions(dataURL);

                            const image: IPasteImageData = {
                                url: dataURL,
                                ...dimensions
                            }

                            onPasteImage(image);

                        }

                        break;
                }

                // FIXME: need to handle HTML too which would read in a lot nodes from ul and li items...

                // if (originalEvent.clipboardData.types.includes('text/html')) {
                //
                //     const srcHTML = originalEvent.clipboardData.getData('text/html');
                //     const sanitizedHTML = HTMLSanitizer.sanitizePasteData(srcHTML);
                //
                //     const spanElement = document.createElement('span');
                //     spanElement.innerHTML = sanitizedHTML;
                //
                //     this.insertNode(spanElement);
                //
                //     originalEvent.preventDefault();
                //     originalEvent.stopPropagation();
                //
                // }

            }

        }

        if (isImagePaste(pasteItems)) {
            // do not go async if there are no images...

            doAsync().catch(err => onPasteError(err));

            const unknownPasteItems = pasteItems.filter(current => current.kind === 'unknown');

            if (unknownPasteItems.length === 0) {

                // must call preventDefault before we return because the async will
                // happen after the event is handled but ONLY do this if there are
                // items that can be imported.
                event.preventDefault();

            }

        }

    }, [onPasteError, onPasteImage])

}
