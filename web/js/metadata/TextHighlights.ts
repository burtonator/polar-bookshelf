import {TextHighlightRecords} from './TextHighlightRecords';
import {IRect} from 'polar-shared/src/util/rects/IRect';
import {TextRect} from './TextRect';
import {TextHighlight} from './TextHighlight';
import {Image} from './Image';
import {isPresent, notNull} from 'polar-shared/src/Preconditions';
import {PageMeta} from './PageMeta';
import {DocMetas} from './DocMetas';
import {Logger} from 'polar-shared/src/logger/Logger';
import {DocMeta} from './DocMeta';
import {IPageMeta} from "polar-shared/src/metadata/IPageMeta";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";
import {Text} from "polar-shared/src/metadata/Text";
import {ITextHighlights} from "polar-shared/src/metadata/ITextHighlights";
import {HTMLStr} from "polar-shared/src/util/Strings";

export class TextHighlights {

    public static update(id: string,
                         docMeta: IDocMeta,
                         pageMeta: IPageMeta,
                         updates: Partial<ITextHighlight>) {

        const existing = pageMeta.textHighlights[id]!;

        if (!existing) {
            throw new Error("No existing for id: " + id);
        }

        const updated = new TextHighlight({...existing, ...updates});

        DocMetas.withBatchedMutations(docMeta, () => {
            // delete pageMeta.textHighlights[id];
            pageMeta.textHighlights[id] = updated;
        });

    }

    /**
     * Create a mock text highlight for testing.
     * @return {*}
     */
    public static createMockTextHighlight() {

        const rects: IRect[] = [ {top: 100, left: 100, right: 200, bottom: 200, width: 100, height: 100}];
        const textSelections = [new TextRect({text: "hello world"})];
        const text = "hello world";

        // create a basic TextHighlight object..
        return TextHighlightRecords.create(rects, textSelections, {TEXT: text}).value;

    }

    public static attachImage(textHighlight: TextHighlight, image: Image) {
        textHighlight.images[notNull(image.rel)] = image;
    }

    public static deleteTextHighlight(pageMeta: IPageMeta, textHighlight: ITextHighlight) {

        if (textHighlight.images) {

            Object.values(textHighlight.images).forEach(image => {

                // const screenshotURI = Screenshots.parseURI(image.src);
                //
                // if (screenshotURI) {
                //     delete pageMeta.screenshots[screenshotURI.id];
                // }

            });

        }

        delete pageMeta.textHighlights[textHighlight.id];

    }

    /**
     * @Deprecated use ITextHighlights.toHTML
     * @param textHighlight
     */
    public static toHTML(textHighlight: ITextHighlight): HTMLStr {
        return ITextHighlights.toHTML(textHighlight);

    }

}
