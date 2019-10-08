import {TextRect} from "../../../metadata/TextRect";


export class TextSelections {

    public static compute(selectedContents: any) {

        const result: any[] = [

        ];

        // TODO: could be cleaner as a map...

        selectedContents.rectTexts.forEach((rectText: any) => {
            const textSelection = new TextRect({
                rect: rectText.boundingPageRect,
                text: rectText.text
            });

            result.push(textSelection);

        });

        return result;

    }

}

