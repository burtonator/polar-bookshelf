import {DeleteResult} from './Datastore';
import {DocInfo} from '../metadata/DocInfo';
import {DatastoreMutation} from './DatastoreMutation';
import {DocMetaFileRef} from './DocMetaRef';
import {DocMetaComparisonIndex} from './DocMetaComparisonIndex';
import {UUIDs} from '../metadata/UUIDs';
import {WriteOpts} from './PersistenceLayer';
import {DocMeta} from '../metadata/DocMeta';
import {DelegatedListenablePersistenceLayer} from './DelegatedListenablePersistenceLayer';
import {ListenablePersistenceLayer} from './ListenablePersistenceLayer';
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";

/**
 */
export class LazyWriteListenablePersistenceLayer extends DelegatedListenablePersistenceLayer {

    private readonly index = new DocMetaComparisonIndex();

    public nrWrites: number = 0;

    constructor(delegate: ListenablePersistenceLayer) {
        super(delegate);
    }

    public async getDocMeta(fingerprint: string): Promise<IDocMeta| undefined> {

        const docMeta = await super.getDocMeta(fingerprint);

        if (docMeta) {
            this.index.updateUsingDocInfo(docMeta.docInfo);
        }

        return docMeta;
    }

    public async writeDocMeta(docMeta: IDocMeta, datastoreMutation?: DatastoreMutation<IDocInfo>): Promise<IDocInfo> {
        return this.handleWrite(docMeta.docInfo, async () => super.writeDocMeta(docMeta, datastoreMutation));
    }

    public async write(fingerprint: string, docMeta: IDocMeta, opts?: WriteOpts): Promise<IDocInfo> {
        return this.handleWrite(docMeta.docInfo, async () => super.write(fingerprint, docMeta, opts));
    }

    private async handleWrite<T>(docInfo: IDocInfo, completion: () => Promise<IDocInfo>): Promise<IDocInfo> {

        let doUpdated = false;

        if (! this.index.contains(docInfo.fingerprint)) {
            doUpdated = true;
        }

        const docComparison = this.index.get(docInfo.fingerprint);

        if (!docComparison) {
            doUpdated = true;
        }

        if (docComparison && UUIDs.compare(docComparison.uuid, docInfo.uuid) < 0) {
            doUpdated = true;
        }

        if (doUpdated) {

            // when the doc is created and it's not in the index.
            this.index.updateUsingDocInfo(docInfo);
            ++this.nrWrites;
            return await completion();


        } else {
            return docInfo;
        }

    }

    public async delete(docMetaFileRef: DocMetaFileRef, datastoreMutation?: DatastoreMutation<boolean>): Promise<DeleteResult> {
        this.index.remove(docMetaFileRef.fingerprint);
        return super.delete(docMetaFileRef, datastoreMutation);
    }

}
