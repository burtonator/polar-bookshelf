export class Decks {

    /**
     * Compute this to a tag subdeck if required.
     *
     * Normal decks like 'foo' are not changed but if it's foo/bar we change
     * it to the Anki deck syntax of foo::bar
     *
     * @param tagValue
     */
    public static toSubDeck(tagValue: string): string {
        return tagValue.replace(/\//g, "::");
    }

}
