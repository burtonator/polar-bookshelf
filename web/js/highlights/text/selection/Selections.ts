/**
 *
 */

export class Selections {

    /**
     * Get the ranges of a selection as an array (easier API).
     *
     * @param selection {Selection}
     * @return {Array<Range>}
     */
    public static toRanges(selection: Selection): Range[] {

        const result = [];

        for (let idx = 0; idx < selection.rangeCount; idx++) {

            // note that we almost always have 1 selection
            const range = selection.getRangeAt(idx);
            result.push(range);

        }

        return result;
    }

}
