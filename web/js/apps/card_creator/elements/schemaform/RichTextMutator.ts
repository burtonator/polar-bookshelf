/**
 * An interface to manipulate summernote externally without knowing about the
 * internals.
 */
export interface RichTextMutator {

    /**
     * Replace the text in the editor with the current value.
     *
     */
    replace(text: HTMLString): void;

    /**
     * The current value as a HTML string.
     */
    currentValue(): HTMLString;

    createRange(): Range;

}

export type HTMLString = string;
