import {DocRef} from 'polar-shared/src/groups/DocRef';
import {PersistenceLayer} from '../PersistenceLayer';
import {GroupIDStr} from '../Datastore';
import {DocMetas} from '../../metadata/DocMetas';
import {DatastoreImportFiles} from './rpc/DatastoreImportFiles';
import {DocIDStr} from './rpc/GroupProvisions';
import {Firestore} from '../../firebase/Firestore';
import {RecordHolder} from '../FirebaseDatastore';
import {DatastoreCollection} from '../FirebaseDatastore';
import {BackendFileRefs} from '../BackendFileRefs';
import {DocInfo} from '../../metadata/DocInfo';
import {Either} from '../../util/Either';
import {DocRefs} from './db/DocRefs';
import {FirebaseDatastores} from '../FirebaseDatastores';
import {GroupDocsAdd} from './rpc/GroupDocsAdd';
import {GroupProvisions} from './rpc/GroupProvisions';
import {GroupProvisionRequest} from './rpc/GroupProvisions';
import {Logger} from 'polar-shared/src/logger/Logger';
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {BackendFileRef} from "polar-shared/src/datastore/BackendFileRef";

const log = Logger.create();

export class GroupDatastores {

    public static async provision(request: GroupProvisionRequest) {
        await GroupProvisions.exec(request);
    }

    public static async importFromGroup(persistenceLayer: PersistenceLayer,
                                        groupDocRef: GroupDocRef) {

        const {groupID, docRef} = groupDocRef;
        const {fingerprint, docID} = docRef;

        async function importBackendFileRef() {

            // TODO: I think it would be better to store the information
            // directly in the DocRef in the original source wouldn't it?
            async function getDocInfoRecord(docID: DocIDStr) {
                log.info("Getting doc info record: " + docID);

                const firestore = await Firestore.getInstance();

                const ref = firestore
                    .collection(DatastoreCollection.DOC_INFO)
                    .doc(docID);

                const snapshot = await ref.get();

                return <RecordHolder<IDocInfo> | undefined> snapshot.data();

            }

            async function getDocInfo(docID: DocIDStr) {

                const docInfoRecord = await getDocInfoRecord(docID);

                if (! docInfoRecord) {
                    throw new Error("Unable to import. No docInfo");
                }

                return docInfoRecord.value;

            }

            const docInfo = await getDocInfo(docID);

            const backendFileRef = BackendFileRefs.toBackendFileRef(Either.ofRight(docInfo));

            if (! backendFileRef) {
                throw new Error("No backend file ref");
            }

            // this will perform an efficient copy of the data on the backend.
            await DatastoreImportFiles.exec({
                docID,
                backend: backendFileRef.backend,
                fileRef: backendFileRef
            });

            return backendFileRef;

        }

        async function importDocMeta(backendFileRef: BackendFileRef): Promise<DocRef> {

            function createDocMeta(backendFileRef: BackendFileRef) {

                const docMeta = DocMetas.create(fingerprint, docRef.nrPages);

                DocRefs.copyToDocInfo(docRef, docMeta.docInfo);

                docMeta.docInfo.filename = backendFileRef.name;
                docMeta.docInfo.backend = backendFileRef.backend;
                docMeta.docInfo.hashcode = backendFileRef.hashcode;

                return docMeta;

            }

            const docMeta = createDocMeta(backendFileRef);

            async function writeDocMeta() {

                const docInfo = docMeta.docInfo;

                await persistenceLayer.write(fingerprint, docMeta);
                return docInfo;

            }

            await writeDocMeta();

            const docID = FirebaseDatastores.computeDocMetaID(fingerprint);

            return {...docRef, docID};

        }

        async function doImport(): Promise<DocRef> {

            // TODO: in the future would be faster to work with the DocInfo instead
            // but we don't have a getDocInfo method yet.
            const docMeta = await persistenceLayer.getDocMeta(fingerprint);

            if (! docMeta) {

                const backendFileRef = await importBackendFileRef();
                return await importDocMeta(backendFileRef);

            } else {
                const docID = FirebaseDatastores.computeDocMetaID(fingerprint);
                return DocRefs.fromDocMeta(docID, docMeta);
            }

        }

        const myDocRef = await doImport();

        await GroupDocsAdd.exec({groupID, docs: [myDocRef]});

    }

}

export interface GroupDocRef {
    readonly groupID: GroupIDStr;
    readonly docRef: DocRef;
}
