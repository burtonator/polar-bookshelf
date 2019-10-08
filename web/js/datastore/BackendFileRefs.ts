import {Either, LeftEither} from '../util/Either';
import {Backend} from 'polar-shared/src/datastore/Backend';
import {Logger} from 'polar-shared/src/logger/Logger';
import {isPresent} from 'polar-shared/src/Preconditions';
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {BackendFileRef} from "polar-shared/src/datastore/BackendFileRef";
import {DocInfoLike} from "../metadata/DocInfo";

const log = Logger.create();

export class BackendFileRefs {

    /**
     * Get the main BackendFileRef (PHZ or PDF) for this file (either the
     * PHZ or PDF file)
     */
    public static toBackendFileRef(either: LeftEither<IDocMeta, DocInfoLike>): BackendFileRef | undefined {

        if (! either) {
            log.warn("No 'either' param specified.");
            return undefined;
        }

        const docInfo =
            Either.ofLeft(either)
                .convertLeftToRight(left => left.docInfo);

        const filename = docInfo.filename;

        if (filename) {

            // return the existing doc meta information.

            const backend = docInfo.backend || Backend.STASH;

            const backendFileRef: BackendFileRef = {
                name: filename,
                hashcode: docInfo.hashcode,
                backend
            };

            return backendFileRef;

        } else {
            // log.warn("DocInfo has no filename");
        }

        return undefined;

    }

    /**
     * Get all FileRefs for this DocMeta including the main doc but also
     * any image, audio, or video attachments.
     */
    public static toBackendFileRefs(either: LeftEither<IDocMeta, DocInfoLike>): ReadonlyArray<BackendFileRef> {

        const result: BackendFileRef[] = [];

        const fileRef = this.toBackendFileRef(either);

        const docInfo =
            Either.ofLeft(either)
                .convertLeftToRight(left => left.docInfo);

        if (fileRef) {

            const backend = docInfo.backend || Backend.STASH;

            // this is the main FileRef of the file (PHZ or PDF)
            result.push({backend, ...fileRef});

        }

        const attachments = docInfo.attachments || {};
        const attachmentRefs = Object.values(attachments)
            .map(current => current.fileRef)
            .filter(current => {
                if (isPresent(current)) {
                    return true;
                }

                log.warn("Doc had missing attachment data: ", docInfo.fingerprint);
                return false;
            });

        result.push(...attachmentRefs);

        return result;

    }

    public static equals(b0: BackendFileRef, b1: BackendFileRef): boolean {
        return b0.backend === b1.backend && b0.name === b1.name && b0.hashcode === b1.hashcode;
    }

}
