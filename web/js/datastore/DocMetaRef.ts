/**
 * Represents a light weight reference to a DocMeta file.
 */
import {IDocInfo} from 'polar-shared/src/metadata/IDocInfo';
import {DocMeta} from '../metadata/DocMeta';
import {Preconditions} from 'polar-shared/src/Preconditions';
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {FileRef} from "polar-shared/src/datastore/FileRef";

export interface DocMetaRef {

    readonly fingerprint: string;

    /**
     * Store the DocMeta if we're passing this directly but have already read
     * the DocMeta elsewhere and it's not actually stale.
     */
    readonly docMeta?: IDocMeta;

}

/**
 * Includes more metadata including the filename of the PDF or PHZ file.
 *
 */
export interface DocMetaFileRef extends DocMetaRef {

    /**
     * The file (PDF, PHZ) which this DocInfo annotates.
     */
    readonly docFile?: FileRef;

    readonly docInfo: IDocInfo;

}

export class DocMetaFileRefs {

    public static createFromDocMeta(docMeta: IDocMeta): DocMetaFileRef {

        return this.createFromDocInfo(docMeta.docInfo);

    }

    public static createFromDocInfo(docInfo: IDocInfo): DocMetaFileRef {

        return {
            fingerprint: docInfo.fingerprint,
            docFile: {
                name: docInfo.filename!,
                hashcode: docInfo.hashcode
            },
            docInfo
        };

    }

}
