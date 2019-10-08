export class Filenames {

    /**
     * Create a sane filename from the given input.  Do not allow bad characters
     * which may not be represented in a file.
     */
    public static sanitize(filename: string): string {

        // TODO: we should probably also accept unicode characters which are
        // alphanumeric but just not in english. I just don't have a handy
        // list of which ones are filesystem safe.
        return filename.replace(/[^a-zA-Z0-9_]/gi, '_');

    }


}
