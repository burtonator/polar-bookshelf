import {FileRef} from "polar-shared/src/datastore/FileRef";

export class DatastoreFiles {

    /**
     * Make sure the file name is sane ... nothing that can't be encoded
     * as a file and must have a three letter extension.  We should just have
     * the files be alphanumeric for now and support a 3-4 char suffix.
     */
    public static isValidFileName(name: string): boolean {
        return name.search(/^[a-zA-Z0-9_(),{} -]+(\.[a-zA-Z0-9]{3,4})?$/g) !== -1;
    }

    public static assertValidFileName(ref: FileRef) {

        if (! this.isValidFileName(ref.name)) {
            throw new Error("Invalid file name: " + ref.name);
        }

    }

    /**
     * Blacklist model to accept a string for a filename and strip characters
     * that are invalid and not accepted on most filesystems.
     *
     * @param name
     */
    public static sanitizeFileName(name: string) {
        return name.replace(/[/\\:*?\"<>|]/g, '_');
    }

    public static isSanitizedFileName(name: string) {
        return name.search(/[/\\:*?\"<>|]/) === -1;
    }

    public static assertSanitizedFileName(ref: FileRef) {
        if (! this.isSanitizedFileName(ref.name)) {
            throw new Error("Invalid file name: " + ref.name);
        }
    }

}
