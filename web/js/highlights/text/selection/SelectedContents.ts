import {Ranges} from './Ranges';
import {ISelectedContent} from './ISelectedContent';
import {Selections} from './Selections';
import {RectTexts} from '../controller/RectTexts';
import {HTMLSanitizer} from 'polar-html/src/sanitize/HTMLSanitizer';
import {TextNodeRows} from "./TextNodeRows";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {FileType} from "../../../apps/main/file_loaders/FileType";
import { Strings } from 'polar-shared/src/util/Strings';

export namespace SelectedContents {

    export interface ComputeOpts {

        /**
         * When true we do not return rects as this splits/mutates the DOM
         */
        readonly noRectTexts?: boolean;

        readonly fileType: FileType;

    }

    /**
     * Compute the SelectedContents based on the page offset, not the
     * client/viewport offset, and include additional metadata including the
     * text of the selection, the html, etc.
     */
    export function computeFromWindow(win: Window, opts: ComputeOpts) {
        const selection = win.getSelection()!;
        return computeFromSelection(selection, opts);
    }

    export function computeFromSelection(selection: Selection, opts: ComputeOpts): ISelectedContent {

        // get all the ranges and clone them so they can't vanish.
        const ranges = Ranges.cloneRanges(Selections.toRanges(selection));

        // now get the text and the sanitized HTML

        const html = HTMLSanitizer.sanitize(toHTML(ranges));

        function computeRectTexts() {

            const textNodes = arrayStream(ranges)
                .map(Ranges.getTextNodes)
                .flatMap(current => current)
                .collect();

            const textNodesRows = TextNodeRows.fromTextNodes(textNodes);

            return RectTexts.toRectTexts(textNodesRows);

        }

        function computeOrder(): number | undefined {

            if (opts.fileType === 'pdf') {
                return undefined;
            }

            if (ranges.length === 0) {
                return 0;
            }

            // TODO this isn't perfect because if we are resizing the EPUB
            // there's no way to determine the right position. I would need some
            // way to find out where things would reflow and with CSS it's
            // imprecise.

            const scrollY = ranges[0].startContainer?.parentElement?.ownerDocument?.defaultView?.scrollY;

            return ranges[0].getBoundingClientRect().top + (scrollY || 0);

        }

        const rectTexts = opts.noRectTexts === true ? [] : computeRectTexts();

        function computeText(): string {

            // TODO this is a bug because PDF.js DOES split text into divs but
            // we're not actually certain if they're 'lines' because the divs
            // are absolutely positioned.

            if (rectTexts.length > 0) {
                // this is PDF mode so we should just compute the text via join
                // the rect texts...
                return Strings.joinWithSpacing(rectTexts.map(current => current.text));
            }

            return toText(ranges)

        }


        const text = computeText();

        const order = computeOrder();

        return {
            text,
            html,
            rectTexts,
            order
        };

    }

    /**
     * Compute the given ranges as HTML, factoring in sanitization as well.
     */
    export function toHTML(ranges: ReadonlyArray<Range>) {
        return ranges.map(range => Ranges.toHTML(range)).join("");
    }

    export function toText(ranges: ReadonlyArray<Range>) {
        return ranges.map(range => Ranges.toText(range)).join("");
    }

}
