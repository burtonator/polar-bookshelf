import {Hashcodes} from 'polar-shared/src/util/Hashcodes';
import {notNull} from 'polar-shared/src/Preconditions';

export class Fingerprints {

    /**
     * Parse the fingerprint from the filename.
     */
    static fromFilename(filename: string) {
        let match = filename.match(/-([^-]+)\.[^.]+$/);
        return notNull(match)[1];
    }

    /**
     * Remove the extension from a file, add the fingerprint, then add the
     * extension again.
     */
    static toFilename(path: string, fingerprint: string) {
        let index = path.lastIndexOf(".");

        let prefix = path.substring(0,index);
        let suffix = path.substring(index+1, path.length);

        return `${prefix}-${fingerprint}.${suffix}`;
    }

    /**
     * Create a fingerprint from the given data.
     *
     * @param data
     */
    static create(data: string) {
        return Hashcodes.create(data).substring(0,20);
    }

}
