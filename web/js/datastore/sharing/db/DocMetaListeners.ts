import {GroupIDStr} from "../../Datastore";
import {UserGroup, UserGroups} from "./UserGroups";
import {GroupDoc, GroupDocs} from "./GroupDocs";
import {DocMeta} from "../../../metadata/DocMeta";
import {SetArrays} from "polar-shared/src/util/SetArrays";
import {PageMeta} from "../../../metadata/PageMeta";
import {Collections, DocumentChange} from "./Collections";
import {DocIDStr} from "../rpc/GroupProvisions";
import {DocMetaHolder, RecordHolder} from "../../FirebaseDatastore";
import {DocMetas} from "../../../metadata/DocMetas";
import {Optional} from "polar-shared/src/util/ts/Optional";
import {Proxies} from "../../../proxies/Proxies";
import {ProfileOwners} from "./ProfileOwners";
import {ProfileIDStr} from "./Profiles";
import {Author} from "../../../metadata/Author";
import {Annotation} from "../../../metadata/Annotation";
import {Logger} from "polar-shared/src/logger/Logger";
import {UserProfile, UserProfiles} from "./UserProfiles";
import {FirebaseDatastores} from "../../FirebaseDatastores";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";
import {IPageMeta} from "polar-shared/src/metadata/IPageMeta";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {IAnnotation} from "polar-shared/src/metadata/IAnnotation";

const log = Logger.create();

export class DocMetaListener {

    private docMetaIndex: {[docID: string]: IDocMeta} = {};

    private groupDocMonitors  = new Set<DocIDStr>();

    // the current groups being monitored
    private monitoredGroups = new Set<GroupIDStr>();

    public constructor(private readonly fingerprint: string,
                       private readonly profileID: ProfileIDStr,
                       private readonly docMetaHandler: (docMeta: IDocMeta, docUpdateRef: DocUpdateRef) => void,
                       private readonly errHandler: (err: Error) => void) {

    }

    public start() {

        console.log("Starting DocMetaListener.");

        // TODO: exclude my OWN documents by getting my profile and excluding all the docs matching my profile.

        // TODO: we could have a stop method if we added support for keeping the
        // unsubscribe functions.

        const handleUserGroups = async () => {

            const userProfile = await UserProfiles.currentUserProfile();

            console.log("Using userProfile: ", userProfile);

            await UserGroups.onSnapshot(userGroup => this.onSnapshotForUserGroup(userGroup));
        };

        handleUserGroups()
            .catch(err => this.errHandler(err));

    }

    public onSnapshotForUserGroup(userGroup: UserGroup | undefined) {

        if (! userGroup) {
            return;
        }

        if (! userGroup.groups) {
            log.warn("No user groups on object: ", userGroup);
            return;
        }

        for (const groupID of userGroup.groups) {

            if (this.monitoredGroups.has(groupID)) {
                continue;
            }

            this.monitoredGroups.add(groupID);

            this.handleGroup(groupID)
                .catch(err => this.errHandler(err));

        }

    }

    public async handleGroup(groupID: GroupIDStr) {

        await GroupDocs.onSnapshotForByGroupIDAndFingerprint(groupID,
                                                             this.fingerprint,
                                                             groupDocs => this.onSnapshotForGroupDocs(groupDocs));

    }

    public onSnapshotForGroupDocs(groupDocChanges: ReadonlyArray<DocumentChange<GroupDoc>>) {

        for (const groupDocChange of groupDocChanges) {

            this.handleGroupDoc(groupDocChange)
                .catch(err => this.errHandler(err));

        }

    }

    public async handleGroupDoc(groupDocChange: DocumentChange<GroupDoc>) {

        // TODO: we technically need to keep track and unsubscribe when documents are
        // removed from the group.

        if (groupDocChange.type === 'removed') {
            // we only care about added or updated
            return;
        }

        const groupDoc = groupDocChange.value;

        const {docID, profileID} = groupDoc;

        if (profileID === this.profileID) {
            // this is my OWN doc so sort of pointless to index it.
            return;
        }

        if (! this.groupDocMonitors.has(docID)) {

            // start listening to snapshots on this docID
            await DocMetaRecords.onSnapshot(docID,
                                            docMetaRecord => this.onSnapshotForDocMetaRecord(groupDoc, docMetaRecord));

            this.groupDocMonitors.add(docID);

        }

    }

    public onSnapshotForDocMetaRecord(groupDoc: GroupDoc,
                                      docMetaRecord: DocMetaRecord | undefined) {

        this.handleDocMetaRecord(groupDoc, docMetaRecord)
            .catch(err => this.errHandler(err));

    }

    public async handleDocMetaRecord(groupDoc: GroupDoc,
                                     docMetaRecord: DocMetaRecord | undefined) {

        const primaryDocID = FirebaseDatastores.computeDocMetaID(this.fingerprint);

        if (groupDoc.docID === primaryDocID) {
            // we have to skip our own document or we're going to eat our own tail
            return;
        }

        const {profileID} = groupDoc;

        const userProfile = await UserProfiles.get(profileID);

        if (! userProfile) {
            log.warn("No user profile");
            return;
        }

        await this.handleDocMetaRecordWithUserProfile(groupDoc, userProfile, docMetaRecord);

    }

    public async handleDocMetaRecordWithUserProfile(docUpdateRef: DocUpdateRef,
                                                    userProfile: UserProfile,
                                                    docMetaRecord: DocMetaRecord | undefined) {

        // listen to snapshots of this DocMeta and then perform the merger...

        if (!docMetaRecord) {
            // doc was removed
            return;
        }

        const {docID, fingerprint} = docUpdateRef;

        const prev = Optional.of(this.docMetaIndex[docID]).getOrUndefined();

        const initDocMeta = (docMeta: IDocMeta) => {

            // remove the pagemarks as that is user specific..
            for (const pageMeta of Object.values(docMeta.pageMetas)) {
                Dictionaries.clear(pageMeta.pagemarks);
            }

            return docMeta;

        };

        const createDocMeta = () => {

            const result = initDocMeta(DocMetas.deserialize(docMetaRecord.value.value, fingerprint));

            if (prev) {
                return result;
            }

            return Proxies.create(result);

        };

        const curr = createDocMeta();

        await DocMetaRecords.applyAuthorsFromUserProfile(curr, userProfile);

        if (prev) {
            // now merge the metadata so we get our events fired.
            DocMetaRecords.mergeDocMetaUpdate(curr, prev);
        } else {
            // only emit on the FIRST time we see the doc and then give the caller a
            // proxied object after that...
            this.docMetaHandler(curr, docUpdateRef);
            this.docMetaIndex[docID] = curr;
        }

    }

}

export class DocMetaListeners {

    public static async register(fingerprint: string,
                                 docMetaHandler: (docMeta: IDocMeta, docUpdateRef: DocUpdateRef) => void,
                                 errHandler: (err: Error) => void) {

        const profileOwner = await ProfileOwners.get();

        if (! profileOwner) {
            log.warn("No profile owner for user");
            return;
        }

        const {profileID} = profileOwner;

        new DocMetaListener(fingerprint, profileID, docMetaHandler, errHandler).start();

    }

}

interface StringDict<T> {
    [key: string]: T;
}

class StringDicts {

    public static merge<T>(source: StringDict<T>, target: StringDict<T>) {

        // *** delete excess in the target that were deleted in the source

        const deletable = SetArrays.difference(Object.keys(target), Object.keys(source));

        for (const key of deletable) {
            delete target[key];
        }

        // *** copy new keys into the target
        const copyable = SetArrays.difference(Object.keys(source), Object.keys(target));

        for (const key of copyable) {
            target[key] = source[key];
        }

    }

}

export class DocMetaRecords {

    public static readonly COLLECTION = 'doc_meta';

    public static async onSnapshot(id: DocMetaIDStr, handler: (record: DocMetaRecord | undefined) => void) {

        return await Collections.onDocumentSnapshot<DocMetaRecord>(this.COLLECTION,
                                                                   id,
                                                                   record => handler(record));

    }

    /**
     * Start with the source and perform a diff against the target.
     */
    public static mergeDocMetaUpdate(source: IDocMeta, target: IDocMeta) {

        const mergePageMeta = (source: IPageMeta, target: IPageMeta) => {

            StringDicts.merge(source.textHighlights, target.textHighlights);
            StringDicts.merge(source.areaHighlights, target.areaHighlights);
            StringDicts.merge(source.notes, target.notes);
            StringDicts.merge(source.comments, target.comments);
            StringDicts.merge(source.questions, target.questions);
            StringDicts.merge(source.flashcards, target.flashcards);

        };

        for (const page of Dictionaries.numberKeys(source.pageMetas)) {
            mergePageMeta(source.pageMetas[page], target.pageMetas[page]);
        }

    }

    public static applyAuthorsFromUserProfile(docMeta: IDocMeta, userProfile: UserProfile) {

        const {profile} = userProfile;

        const createAuthorFromProfile = () => {

            const profileID = profile.id;

            const name = profile!.name || profile!.handle || 'unknown';

            const createImage  = () => {
                if (profile.image) {
                    return {
                        src: profile!.image!.url
                    };
                }

                return undefined;

            };

            const image = createImage();

            const guest = ! userProfile.self;

            return new Author({name, image, profileID, guest});

        };

        const author = createAuthorFromProfile();

        const applyAuthorToAnnotations = (dict: {[key: string]: IAnnotation}) => {

            for (const annotation of Object.values(dict)) {
                annotation.author = author;
            }

        };

        const applyAuthorToPage = (pageMeta: IPageMeta) => {

            applyAuthorToAnnotations(pageMeta.textHighlights);
            applyAuthorToAnnotations(pageMeta.areaHighlights);
            applyAuthorToAnnotations(pageMeta.notes);
            applyAuthorToAnnotations(pageMeta.comments);
            applyAuthorToAnnotations(pageMeta.questions);
            applyAuthorToAnnotations(pageMeta.flashcards);

        };

        for (const page of Dictionaries.numberKeys(docMeta.pageMetas)) {
            applyAuthorToPage(docMeta.pageMetas[page]);
        }

    }

}

export type DocMetaIDStr = string;

export type DocMetaRecord = RecordHolder<DocMetaHolder>;

export interface DocUpdateRef {
    readonly docID: DocIDStr;
    readonly fingerprint: string;
}
