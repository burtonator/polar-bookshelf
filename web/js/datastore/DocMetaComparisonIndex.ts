import {DocMeta} from '../metadata/DocMeta';
import {IDocInfo} from 'polar-shared/src/metadata/IDocInfo';
import {DocUUID} from './CloudAwareDatastore';
import {isPresent} from 'polar-shared/src/Preconditions';
import {DocMetaMutation} from './Datastore';
import {UUIDs} from '../metadata/UUIDs';
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";


/**
 * The DocComparisonIndex allows us to detect which documents are local already
 * so that when we receive document from the cloud datastore we can decide
 * that we do not need to replicate it locally.
 */
export class DocMetaComparisonIndex {

    private readonly backing: {[fingerprint: string]: DocUUID} = {};

    public contains(fingerprint: string) {
        return isPresent(this.backing[fingerprint]);
    }

    public get(fingerprint: string): DocUUID | undefined {
        return this.backing[fingerprint];
    }

    public remove(fingerprint: string) {
        delete this.backing[fingerprint];
    }

    public updateUsingDocMeta(docMeta: IDocMeta) {

        this.backing[docMeta.docInfo.fingerprint] = {
            fingerprint: docMeta.docInfo.fingerprint,
            uuid: docMeta.docInfo.uuid
        };

    }

    public updateUsingDocInfo(docInfo: IDocInfo) {

        this.backing[docInfo.fingerprint] = {
            fingerprint: docInfo.fingerprint,
            uuid: docInfo.uuid
        };

    }

    /**
     * Handle a given mutation and return true if the mutation was accepted.
     *
     * A mutation is accepted if it is recent and mutates the data in the
     * database which is already present.
     *
     * @param docMetaMutation
     * @param docInfo
     */
    public handleDocMetaMutation(docMetaMutation: DocMetaMutation, docInfo: IDocInfo): boolean {

        const mutationType = docMetaMutation.mutationType;

        let doUpdated = false;

        const docComparison = this.get(docInfo.fingerprint);

        if (!docComparison) {
            doUpdated = true;
        }

        if (docComparison) {

            if (UUIDs.compare(docComparison.uuid, docInfo.uuid) < 0) {
                doUpdated = true;
            } else {
                // noop
            }

        }

        if (doUpdated) {
            // when the doc is created and it's not in the index.
            this.updateUsingDocInfo(docInfo);
            return true;
        }

        if (mutationType === 'deleted' && this.get(docInfo.fingerprint)) {

            // TODO: a delete might need to have a UUID too so that we do not
            // get out of order DELETEs.  For this to work we probably need
            // the concept of tombstones.

            // if we're deleting the document and we've seen it before
            // and it's in the index.
            this.remove(docInfo.fingerprint);
            return true;

        }

        return false;

    }

}
