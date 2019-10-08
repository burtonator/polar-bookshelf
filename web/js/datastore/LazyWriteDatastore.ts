import {AbstractDatastore, Datastore, DatastoreID, DeleteResult} from './Datastore';
import {DelegatedDatastore} from './DelegatedDatastore';
import {DocInfo} from '../metadata/DocInfo';
import {DatastoreMutation, DefaultDatastoreMutation} from './DatastoreMutation';
import {DocMetaFileRef} from './DocMetaRef';
import {DocMetaComparisonIndex} from './DocMetaComparisonIndex';
import {UUIDs} from '../metadata/UUIDs';
import {DocMeta} from '../metadata/DocMeta';
import {Logger} from 'polar-shared/src/logger/Logger';
import {WriteOpts} from './Datastore';
import {IDocInfo} from 'polar-shared/src/metadata/IDocInfo';
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";

const log = Logger.create();

/**
 * The LazyWriteDatastore keeps a lightweight in-memory index of what's written
 * and prevents double writes of DocMeta but otherwise operates normally.
 */
export class LazyWriteDatastore extends DelegatedDatastore {

    private readonly index = new DocMetaComparisonIndex();

    public readonly id: DatastoreID;

    public nrWrites: number = 0;

    constructor(delegate: Datastore) {
        super(delegate);
        this.id = 'lazy-write:' + delegate.id;
    }

    public async writeDocMeta(docMeta: IDocMeta,
                              datastoreMutation: DatastoreMutation<IDocInfo> = new DefaultDatastoreMutation()): Promise<IDocInfo> {

        await this.handleWrite(docMeta.docInfo, async () => await super.writeDocMeta(docMeta, datastoreMutation));

        return docMeta.docInfo;

    }

    // TODO: when we do a read, it might be better to update the index then
    // which would remove the first write in some situations but we need the
    // DocInfo and the UUID to handle this.

    public async write(fingerprint: string,
                       data: any,
                       docInfo: IDocInfo,
                       opts?: WriteOpts): Promise<void> {

        return this.handleWrite(docInfo, async () => await super.write(fingerprint, data, docInfo, opts));

    }

    private async handleWrite(docInfo: IDocInfo, writeFunction: () => Promise<any>): Promise<void> {

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

        const writeDesc = `fingerprint: ${docInfo.fingerprint}, uuid: ${docInfo.uuid}: ` + docInfo.title;

        if (doUpdated) {
            // when the doc is created and it's not in the index.
            this.index.updateUsingDocInfo(docInfo);
            ++this.nrWrites;

            log.info("Performing write: " + writeDesc);
            await writeFunction();
            return;

        }

        log.info("Skipping write: " + writeDesc);

    }

    public delete(docMetaFileRef: DocMetaFileRef): Promise<Readonly<DeleteResult>> {
        this.index.remove(docMetaFileRef.fingerprint);
        return super.delete(docMetaFileRef);
    }

}
