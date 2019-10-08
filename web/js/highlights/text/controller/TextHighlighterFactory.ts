import {isPresent, Preconditions} from 'polar-shared/src/Preconditions';

require("../../../../lib/TextHighlighter.js");

declare var global: any;

export class TextHighlighterFactory {

    public static newInstance(element: HTMLElement, options: any): any {
        Preconditions.assertNotNull(element, "element");
        return new global.TextHighlighter(element, options);
    }

}
