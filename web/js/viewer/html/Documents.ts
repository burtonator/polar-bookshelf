export class Documents {

    public static height(doc: Document | undefined | null): number | undefined {

        // TODO: not using any advanced imports here so that this can easily
        // be used in a renderer function.

        if (doc === null || doc === undefined) {
            return undefined;
        }

        const potentialScrollHeights = [
            doc.documentElement ? doc.documentElement.scrollHeight : undefined,
            doc.body ? doc.body.scrollHeight : undefined
        ];

        const scrollHeights =
            potentialScrollHeights
            .filter( current => current !== undefined)
            .map(current => current!);

        if (scrollHeights.length === 0) {
            return undefined;
        }

        return Math.max(...scrollHeights);

    }

}
