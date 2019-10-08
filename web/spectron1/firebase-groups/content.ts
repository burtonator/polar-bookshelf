import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import {Logger} from 'polar-shared/src/logger/Logger';
import {Firebase} from '../../js/firebase/Firebase';
import {GroupProvisionRequest} from '../../js/datastore/sharing/rpc/GroupProvisions';
import {GroupProvisions} from '../../js/datastore/sharing/rpc/GroupProvisions';
import {DocIDStr} from '../../js/datastore/sharing/rpc/GroupProvisions';
import {ProfileUpdateRequest} from '../../js/datastore/sharing/db/ProfileUpdates';
import {ProfileUpdates} from '../../js/datastore/sharing/db/ProfileUpdates';
import {GroupJoins} from '../../js/datastore/sharing/rpc/GroupJoins';
import {assert} from 'chai';
import {Group, GroupInit, Groups} from '../../js/datastore/sharing/db/Groups';
import {GroupMembers} from '../../js/datastore/sharing/db/GroupMembers';
import {GroupMemberInvitations} from '../../js/datastore/sharing/db/GroupMemberInvitations';
import {Profiles} from '../../js/datastore/sharing/db/Profiles';
import {FirebaseDatastore} from '../../js/datastore/FirebaseDatastore';
import {DatastoreCollection} from '../../js/datastore/FirebaseDatastore';
import {RecordHolder} from '../../js/datastore/FirebaseDatastore';
import {DocMetaHolder} from '../../js/datastore/FirebaseDatastore';
import {MockDocMetas} from '../../js/metadata/DocMetas';
import {DocMetas} from '../../js/metadata/DocMetas';
import {MockDoc} from '../../js/metadata/DocMetas';
import {DocRefs} from '../../js/datastore/sharing/db/DocRefs';
import {GroupDocs} from '../../js/datastore/sharing/db/GroupDocs';
import {GroupDocIDStr} from '../../js/datastore/sharing/db/GroupDocs';
import {ProfileOwners} from '../../js/datastore/sharing/db/ProfileOwners';
import {UserGroups} from '../../js/datastore/sharing/db/UserGroups';
import {Contacts} from '../../js/datastore/sharing/db/Contacts';
import {SetArrays} from 'polar-shared/src/util/SetArrays';
import {GroupDeletes} from '../../js/datastore/sharing/rpc/GroupDeletes';
import {Promises} from '../../js/util/Promises';
import {DocMeta} from '../../js/metadata/DocMeta';
import {BackendFileRefs} from '../../js/datastore/BackendFileRefs';
import {Either} from '../../js/util/Either';
import {FirebaseDatastores} from '../../js/datastore/FirebaseDatastores';
import {GroupLeaves} from '../../js/datastore/sharing/rpc/GroupLeaves';
import {assertJSON} from '../../js/test/Assertions';
import {JSONRPCError} from '../../js/datastore/sharing/rpc/JSONRPC';
import {GroupDocsAdd} from '../../js/datastore/sharing/rpc/GroupDocsAdd';
import {GroupDocAddRequest} from '../../js/datastore/sharing/rpc/GroupDocsAdd';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {GroupIDStr} from '../../js/datastore/Datastore';
import {GroupDatastores} from '../../js/datastore/sharing/GroupDatastores';
import {GroupDocRef} from '../../js/datastore/sharing/GroupDatastores';
import {DefaultPersistenceLayer} from '../../js/datastore/DefaultPersistenceLayer';
import {Datastores} from '../../js/datastore/Datastores';
import {PersistenceLayer} from '../../js/datastore/PersistenceLayer';
import {DocMetaFileRef} from '../../js/datastore/DocMetaRef';
import {canonicalize} from '../../js/util/Objects';
import {GroupMemberDeletes} from '../../js/datastore/sharing/rpc/GroupMemberDeletes';
import {UserRefs} from '../../js/datastore/sharing/rpc/UserRefs';
import {isPresent} from 'polar-shared/src/Preconditions';
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {EmailStr} from "polar-shared/src/util/Strings";

const log = Logger.create();

mocha.setup('bdd');
mocha.timeout(600000);

process.env.POLAR_TEST_PROJECT = 'polar-test2';

const FIREBASE_USER = process.env.FIREBASE_USER!;
const FIREBASE_PASS = process.env.FIREBASE_PASS!;

const FIREBASE_USER1 = process.env.FIREBASE_USER1!;
const FIREBASE_PASS1 = process.env.FIREBASE_PASS1!;

const FIREBASE_USER2 = process.env.FIREBASE_USER2!;
const FIREBASE_PASS2 = process.env.FIREBASE_PASS2!;

async function verifyFailed(delegate: () => Promise<any>) {

    let failed: boolean;

    try {

        await delegate();
        failed = false;

    } catch (e) {
        failed = true;
    }

    if (! failed) {
        throw new Error("Did not fail as expected");
    }

}

SpectronRenderer.run(async (state) => {

    // TODO: I need to verify a plan for profiles...
    //
    // - make sure uninvited users get to see their documents once they sign up.
    //
    //

    // TODO: it would be nice if users could just CHAT within a document...
    // maybe like they do in twitch around videos...

    // TODO: delete the profiles after each run and then update them so that
    // we can verify everything during the lifecycle of the user from new signup
    // to sharing with an existing user who has a profile.  Verify that the
    // profileID is updated when they first login.

    // TODO: build a new Datastore impl that is a 'view' on the main one derived
    // from the docID such that we can call all the main operations...

    // ## PUBLIC GROUPS

    // TODO: make sure we don't have a group ID collision when creating by name.
    // I have to test what happens when we create by name.  We need to have a
    // 'key' returned so that the UI can properly respond and explain what
    // happened.

    // Future work:
    //

    // TODO:
    // - for large documents we might need to fetch TOO MUCH data and we're
    //   going to end up pulling down too much to the client.
    // -   TODO: what happens if I call these methods twice ? they need to be
    //     idempotent.
    //
    //   - TODO: test public groups and protected groups
    //
    //   - TODO: do a full lifecycle from no user accounts , to user accounts
    //    created, to profile IDs updated.
    //

    describe("firebase-groups", async function() {

        async function purgeDatastores() {

            const app = Firebase.init();

            async function purgeForUser(username: string, password: string) {

                const auth = app.auth();
                await auth.signInWithEmailAndPassword(username, password);
                const uid = auth.currentUser!.uid;

                console.log("======= purge datastore for user: " + uid);


                const datastore = new FirebaseDatastore();

                try {

                    await datastore.init();

                    await Datastores.purge(datastore);

                } finally {
                    await datastore.stop();
                }

            }

            await purgeForUser(FIREBASE_USER, FIREBASE_PASS);
            await purgeForUser(FIREBASE_USER1, FIREBASE_PASS1);
            await purgeForUser(FIREBASE_USER2, FIREBASE_PASS2);

        }

        async function purgeGroups() {

            const app = Firebase.init();

            async function purgeForUser(username: string, password: string) {

                await app.auth().signInWithEmailAndPassword(username, password);

                const user = app.auth().currentUser!;
                const {uid} = user;

                const userGroup = await UserGroups.get(uid);

                if (! userGroup) {
                    return;
                }

                const groups = SetArrays.union(userGroup.invitations || [],
                                               userGroup.admin || []);

                for (const group of groups) {
                    await GroupDeletes.exec({groupID: group});
                }

                // TODO: purge the other tables too

                await Contacts.purge();
                await GroupMemberInvitations.purge();
                // UserGroups

            }

            await purgeForUser(FIREBASE_USER, FIREBASE_PASS);
            await purgeForUser(FIREBASE_USER1, FIREBASE_PASS1);
            await purgeForUser(FIREBASE_USER2, FIREBASE_PASS2);

        }

        async function purge() {
            console.log("==== BEGIN purge");

            await purgeDatastores();
            await purgeGroups();
            console.log("==== END purge");

        }

        const GROUP_DELAY: number = 10000;

        async function waitForGroupDelay() {

            console.log(`Waiting for group delay of ${GROUP_DELAY}ms... `);
            await Promises.waitFor(GROUP_DELAY);
            console.log(`Waiting for group delay of ${GROUP_DELAY}ms... done`);

        }

        async function provisionAccountData(userPass?: UserPass) {

            const app = Firebase.init();

            console.log("provisionAccountData");

            userPass = Optional.of(userPass).getOrElse({user: FIREBASE_USER, pass: FIREBASE_PASS});

            const auth = app.auth();
            await auth.signInWithEmailAndPassword(userPass.user, userPass.pass);
            const uid = auth.currentUser!.uid;

            console.log("Writing to datastore with uid: " + uid);

            const firebaseDatastore = new FirebaseDatastore();
            try {

                await firebaseDatastore.init();

                console.log("Writing docMeta and PDF...");
                const result = await MockDocMetas.createMockDocMetaFromPDF(firebaseDatastore);
                console.log("Writing docMeta and PDF...done");

                return result;

            } finally {
                await firebaseDatastore.stop();
            }

        }

        async function doGroupProvision(mockDoc: MockDoc,
                                        email: EmailStr = 'getpolarized.test+test1@gmail.com',
                                        key?: string): Promise<GroupDocRef> {

            console.log("doGroupProvision");

            const {docMeta} = mockDoc;
            const docID = FirebaseDatastores.computeDocMetaID(docMeta.docInfo.fingerprint);

            const docRef = DocRefs.fromDocMeta(docID, docMeta);

            const userRef = UserRefs.fromEmail(email);

            const request: GroupProvisionRequest = {
                key,
                docs: [
                    docRef
                ],
                invitations: {
                    message: "Private invite to my special group",
                    to: [
                        userRef
                    ]
                },
                visibility: 'private'
            };

            const response = await GroupProvisions.exec(request);
            return {groupID: response.id, docRef};

        }

        async function doGroupProvisionPublic(mockDoc: MockDoc,
                                              template: Partial<GroupInit> = {}) {

            console.log("doGroupProvisionPublic");

            const {docMeta} = mockDoc;
            const docID = FirebaseDatastores.computeDocMetaID(docMeta.docInfo.fingerprint);

            const docRef = DocRefs.fromDocMeta(docID, docMeta);

            const request: GroupProvisionRequest = {
                docs: [
                    docRef
                ],
                invitations: {
                    message: "Private invite to my special group",
                    to: [
                        UserRefs.fromEmail('getpolarized.test+test1@gmail.com')
                    ]
                },
                name: 'linux',
                tags: ['linux', 'ubuntu', 'debian'],
                visibility: template.visibility || 'public',
                description: template.description,
                links: template.links

            };

            const response = await GroupProvisions.exec(request);
            return response.id;

        }


        async function doGroupJoinForUser1(groupID: GroupIDStr) {

            const app = Firebase.init();

            console.log("doGroupJoin");

            // now switch to the user that was invited and join that group.

            await app.auth().signInWithEmailAndPassword(FIREBASE_USER1, FIREBASE_PASS1);

            console.log("Listing group invitations...");

            const groupMemberInvitations = await GroupMemberInvitations.list();

            console.log("Listing group invitations...done");

            // it's important that the user can see their own invitations.
            assert.equal(groupMemberInvitations.filter(current => current.groupID === groupID).length, 1,
                         "groupID not in the list of groups: " + groupID);

            const profileUpdateRequest: ProfileUpdateRequest = {
                name: "Bob Johnson",
                bio: "An example user from Mars",
                location: "Capitol City, Mars",
                links: ['https://www.mars.org']
            };

            console.log("Updating profile...");
            await ProfileUpdates.exec(profileUpdateRequest);
            console.log("Updating profile...done");

            console.log("Joining group...");
            await GroupJoins.exec({groupID});
            console.log("Joining group...done");

        }

        interface AssertFetchOpts {
            readonly status?: number;
            readonly type?: string;
            readonly contentType?: string;
            readonly byteLength?: number;
        }

        /**
         * Assert that we can fetch the given URL properly.
         * @param url
         */
        async function assertFetch(url: string, opts: AssertFetchOpts) {

            const response = await fetch(url);

            if (opts.status !== undefined) {
                assert.equal(response.status, 200);
            }

            if (opts.type !== undefined) {
                assert.equal(response.type, 'cors');
            }

            if (opts.contentType !== undefined) {
                assert.equal(response.headers.get('content-type'), 'application/pdf');
            }

            if (opts.byteLength !== undefined) {
                const arrayBuffer = await response.arrayBuffer();

                assert.equal(arrayBuffer.byteLength, opts.byteLength);
            }

        }

        async function getGroupCanonicalized(groupID: GroupIDStr): Promise<any> {

            const app = Firebase.init();
            const user = app.auth().currentUser!;

            console.log("Reading with uid: " + user.uid);
            console.log("Trying to read group " + groupID);

            const group = await Groups.get(groupID);

            console.log("Read group properly.");

            if (group) {
                const obj = <any> group;
                delete obj.id;
                delete obj.created;
            }

            return group;

        }
        //
        beforeEach(async function() {
            await purge();
        });

        afterEach(async function() {
            await purge();
        });

        it("group provision of private group", async function() {

            const app = Firebase.init();

            const mockDoc = await provisionAccountData();
            const {groupID} = await doGroupProvision(mockDoc);

            async function validateUserGroupForPrimaryUser() {

                const userGroup = await UserGroups.get();

                const obj = canonicalize(userGroup, obj => {
                    delete obj.uid;
                });

                assertJSON(obj, {
                    "admin": [
                        groupID
                    ],
                    "groups": [
                        groupID
                    ],
                    "invitations": [
                        groupID
                    ],
                    "moderator": [],
                });

            }

            await validateUserGroupForPrimaryUser();

            async function validateGroupsOnDocMetaAndDocPermissions(groupID: GroupIDStr) {

                console.log("validateGroupsOnDocMetaAndDocPermissions");

                const groupDocs = await GroupDocs.list(groupID);

                assert.equal(groupDocs.length, 1, "No group docs found.");

                const groupDoc = groupDocs[0];

                assert.equal(groupDoc.groupID, groupID, "Wrong groupID");
                assert.isDefined(groupDoc.id);
                assert.isDefined(groupDoc.created);

                const firestore = app.firestore();

                const ref = firestore
                    .collection(DatastoreCollection.DOC_META)
                    .doc(groupDoc.docID);

                const doc = await ref.get();
                const recordHolder = <RecordHolder<IDocMeta> | undefined> doc.data();

                assert.isDefined(recordHolder);
                assert.isDefined(recordHolder!.groups);

                assert.isTrue(recordHolder!.groups!.includes(groupID), "Does not include group ID");

                console.log("SUCCESS... groups properly has the right groupID");

            }

            await validateGroupsOnDocMetaAndDocPermissions(groupID);

            await doGroupJoinForUser1(groupID);

            async function validateGroupSettingsAfterJoin(groupID: GroupIDStr) {

                console.log("validateGroupSettingsAfterJoin");

                const user = app.auth().currentUser!;
                assert.equal(user.email, FIREBASE_USER1);

                console.log("Testing permissions for user: " + user.uid);
                console.log("Testing permissions for group: " + groupID);

                const group = await Groups.get(groupID);

                assert.isDefined(group);

                // make sure nrMembers counts on the groups are setup properly.
                assert.equal(group!.nrMembers, 2, "nrMembers in group is wrong.");

                const groupMembers = await GroupMembers.list(groupID);

                console.log("groupMembers: ", groupMembers);

                assert.equal(groupMembers.length, 2, "Wrong number of groups members");

                console.log("Fetching profile owner to validate group member profileID");
                const profileOwner = await ProfileOwners.get(user.uid);

                assert.isDefined(profileOwner);

                const groupMemberProfileIDs = groupMembers.map(current => current.profileID);

                assert.isTrue(groupMemberProfileIDs.includes(profileOwner!.profileID), "Profile owner is not member of group");

                // now make sure there are no invitations for this group after ...
                const groupMemberInvitations = await GroupMemberInvitations.list();

                assert.equal(groupMemberInvitations.filter(current => current.groupID === groupID).length, 0);

            }

            await validateGroupSettingsAfterJoin(groupID);

            async function validateContacts() {
                const user = app.auth().currentUser!;

                const contacts = await Contacts.list();
                assert.equal(contacts.length , 1, "No contacts found for user: " + user.uid);

                const contact = canonicalize(contacts[0], obj => {

                    obj.profileID = obj.profileID ? 'xxx' : obj.profileID;

                    delete obj.id;
                    delete obj.created;
                });

                assertJSON(contact, {
                       "profileID": "xxx",
                       "reciprocal": true,
                       "rel": [
                         "shared"
                       ],
                       "uid": "SSVzZnZrmZbCnavWVw6LmoVVCeA3"
                });

            }

            await validateContacts();

            async function validateGroupDocs(groupID: GroupIDStr) {

                console.log("== validateGroupDocs");

                const user = app.auth().currentUser!;

                assert.equal(user.email, FIREBASE_USER1);

                const userGroup = await UserGroups.get(user.uid);

                if (! userGroup) {
                    throw new Error("No user group");
                }

                assert.isTrue(userGroup.groups.includes(groupID), "We don't have the group ID in our user_group record");

                console.log(`Attempting to fetch group docs with uid=${user.uid}, groupID: ${groupID}`);

                await waitForGroupDelay();

                const groupDocs = await GroupDocs.list(groupID);

                assert.equal(groupDocs.length, 1, "No group docs found.");

                const groupDoc = groupDocs[0];

                assert.equal(groupDoc.groupID, groupID);
                assert.isDefined(groupDoc.id);
                assert.isDefined(groupDoc.created);

            }

            await validateGroupDocs(groupID);

            async function validatePermissionDeniedForOthers(groupID: GroupIDStr) {

                console.log("== validatePermissionDeniedForOthers");

                await app.auth().signInWithEmailAndPassword(FIREBASE_USER2, FIREBASE_PASS2);

                await verifyFailed(async () => await Groups.get(groupID));
            }

            await validatePermissionDeniedForOthers(groupID);

            async function validatePermissionsForDocMeta(groupID: GroupIDStr) {

                console.log("validatePermissionsForDocMeta");

                const auth = app.auth();
                await auth.signInWithEmailAndPassword(FIREBASE_USER1, FIREBASE_PASS1);
                const user = auth.currentUser!;

                const firebaseDatastore = new FirebaseDatastore();

                try {

                    await firebaseDatastore.init();

                    const groupDocs = await GroupDocs.list(groupID);

                    console.log(`Attempting to read documents to validate permissions: uid: ${user.uid}...`);
                    const firestore = app.firestore();

                    for (const groupDoc of groupDocs) {

                        console.log(`Validating docID: ${groupDoc.docID}`);

                        console.log("Reading it directly from the firebase API...");

                        const ref = firestore
                            .collection(DatastoreCollection.DOC_META)
                            .doc(groupDoc.docID);

                        await ref.get();

                        console.log("Reading it directly from the firebase API...done");

                        await firebaseDatastore.getDocMetaDirectly(groupDoc.docID);
                    }

                } finally {
                    await firebaseDatastore.stop();
                }

            }

            await validatePermissionsForDocMeta(groupID);

            async function validateGetFile(groupID: GroupDocIDStr) {
                console.log("validateGetFile");

                const auth = app.auth();
                const user = auth.currentUser!;

                const idToken = await user.getIdToken();

                // verify that I can actually fetch the data associated with the
                // file...

                const groupDocs = await GroupDocs.list(groupID);

                const firebaseDatastore = new FirebaseDatastore();

                try {

                    await firebaseDatastore.init();

                    for (const groupDoc of groupDocs) {

                        console.log("Validating we can fetch doc: ", groupDoc);

                        const data = await firebaseDatastore.getDocMetaDirectly(groupDoc.docID);
                        const docMeta = DocMetas.deserialize(data!, groupDoc.fingerprint);

                        const backendFileRefs = BackendFileRefs.toBackendFileRefs(Either.ofLeft(docMeta));

                        assert.equal(backendFileRefs.length, 1);

                        for (const backendFileRef of backendFileRefs) {

                            console.log("Validating we can fetch backend file ref: ", backendFileRef);

                            const url = FirebaseDatastores.computeDatastoreGetFileURL({
                                docID: groupDoc.docID,
                                idToken,
                                backend: backendFileRef.backend,
                                fileRef: backendFileRef,
                            });

                            await assertFetch(url, {
                                status: 200,
                                type: 'cors',
                                contentType: 'application/pdf',
                                byteLength: 117687
                            });

                        }

                    }

                } finally {
                    await firebaseDatastore.stop();
                }

            }

            await validateGetFile(groupID);

        });

        it("group provision of private group and verify group members includes the group creator", async function() {

            const mockDoc = await provisionAccountData();
            const {groupID} = await doGroupProvision(mockDoc);

            async function validateGroupMembers() {

                const profile = await Profiles.currentProfile();

                assert.isTrue(isPresent(profile));

                const groupMembers = await GroupMembers.list(groupID);

                assert.isTrue(isPresent(groupMembers));
                assert.equal(groupMembers.length, 1);

                const groupMember = groupMembers[0];

                assert.equal(groupMember.groupID, groupID);
                assert.equal(groupMember.profileID, profile!.id);

                const group = await Groups.get(groupID);
                assert.equal(group!.nrMembers, 1);

            }

            await validateGroupMembers();

        });

        it("join and then leave group", async function() {

            const mockDoc = await provisionAccountData();
            const {groupID} = await doGroupProvision(mockDoc);
            await doGroupJoinForUser1(groupID);
            await waitForGroupDelay();

            async function assertGroupBefore() {

                const group = await getGroupCanonicalized(groupID);

                assertJSON(group, {
                    visibility: 'private',
                    tags: [],
                    nrMembers: 2
                });

            }

            await assertGroupBefore();

            await GroupLeaves.exec({groupID});

            async function assertGroupAfter() {

                const app = Firebase.init();
                await app.auth().signInWithEmailAndPassword(FIREBASE_USER, FIREBASE_PASS);

                const group = await getGroupCanonicalized(groupID);

                assertJSON(group, {
                    visibility: 'private',
                    tags: [],
                    nrMembers: 1
                });

            }

            await assertGroupAfter();

        });

        it("double provision of group with key", async function() {


            const mockDoc = await provisionAccountData();
            const email = 'getpolarized.test+test1@gmail.com';
            const fingerprint = mockDoc.docMeta.docInfo.fingerprint;

            const groupDocRefBefore = await doGroupProvision(mockDoc, email, fingerprint);
            const groupDocRefAfter = await doGroupProvision(mockDoc, email, fingerprint);

            assert.equal(groupDocRefBefore.groupID, groupDocRefAfter.groupID);

            const contacts = await Contacts.list();

            assert.equal(contacts.length, 1);

            const contact = canonicalize(contacts[0], obj => {
                delete obj.id;
                delete obj.created;
                obj.profileID = 'xxx';
            });

            assertJSON(contact, {
                "email": "getpolarized.test+test1@gmail.com",
                "profileID": "xxx",
                "reciprocal": false,
                "rel": [
                    "shared"
                ],
                "uid": "GdTRyWWIjsPtAcguFfH8FOiGryf1"
            });

            async function doTestGroupMemberInvitations() {
                const app = Firebase.init();
                const auth = app.auth();
                await auth.signInWithEmailAndPassword(FIREBASE_USER1, FIREBASE_PASS1);

                const invitations = await GroupMemberInvitations.list();

                assert.equal(invitations.length, 1);

                const invitation = canonicalize(invitations[0], obj => {
                    delete obj.id;
                    delete obj.created;
                    obj.from.profileID = 'xxx';
                    obj.groupID = 'xxx';
                });

                assertJSON(invitation, {
                    "docs": [
                        {
                            "docID": "121XWG5nPM492A1q6tFs1fLy5S6ndJZF",
                            "fingerprint": "0x001",
                            "nrPages": 4,
                            "tags": {},
                            "title": ""
                        }
                    ],
                    "from": {
                        "email": "getpolarized.test+test@gmail.com",
                        "image": null,
                        "name": "",
                        "profileID": "xxx"
                    },
                    "groupID": "xxx",
                    "message": "Private invite to my special group",
                    "to": "getpolarized.test+test1@gmail.com"
                });

            }

            await doTestGroupMemberInvitations();

            // await doGroupJoinForUser1(groupID);

            // TODO: have a second user join this group and then enumerage
            // the message



        });

        it("join and then add my own docs", async function() {

            async function doUser0() {
                const mockDoc = await provisionAccountData();
                const groupID = await doGroupProvision(mockDoc);
                await waitForGroupDelay();
                return groupID;
            }

            const {groupID} = await doUser0();

            async function doGroupJoinForUser1(groupID: GroupIDStr) {

                const app = Firebase.init();

                console.log("doGroupJoin");

                // now switch to the user that was invited and join that group.

                await app.auth().signInWithEmailAndPassword(FIREBASE_USER1, FIREBASE_PASS1);

                await GroupJoins.exec({groupID});

            }

            await doGroupJoinForUser1(groupID);

            async function doGroupDocsAdd(mockDoc: MockDoc) {

                const {docMeta} = mockDoc;
                const docID = FirebaseDatastores.computeDocMetaID(docMeta.docInfo.fingerprint);

                const docRef = DocRefs.fromDocMeta(docID, docMeta);

                const request: GroupDocAddRequest = {
                    groupID,
                    docs: [
                        docRef
                    ],
                };

                await GroupDocsAdd.exec(request);

            }

            const mockDoc = await provisionAccountData({user: FIREBASE_USER1, pass: FIREBASE_PASS1});
            await doGroupDocsAdd(mockDoc);

            const groupDocs = await GroupDocs.list(groupID);
            assert.equal(groupDocs.length, 2);

            // TODO: now make sure BOTH users can read these docs and
            // download/fetch the PDFs

        });

        it("delete users from a group with just the invitation", async function() {

            const alice = 'alice@example.com';

            const mockDoc = await provisionAccountData();
            const fingerprint = mockDoc.docMeta.docInfo.fingerprint;
            const {groupID} = await doGroupProvision(mockDoc, alice, fingerprint);

            const profile = await Profiles.currentProfile();
            assert.isDefined(profile);

            const invitationBefore = await GroupMemberInvitations.listByGroupIDAndProfileID(groupID, profile!.id);

            assert.equal(invitationBefore.length, 1);

            const userRef = UserRefs.fromEmail(alice);
            await GroupMemberDeletes.exec({groupID, userRefs: [userRef]});

            const invitationAfter = await GroupMemberInvitations.listByGroupIDAndProfileID(groupID, profile!.id);

            assert.equal(invitationAfter.length, 0);

        });

        it("delete users from a group after they have joined", async function() {

            const mockDoc = await provisionAccountData();
            const fingerprint = mockDoc.docMeta.docInfo.fingerprint;
            const {groupID} = await doGroupProvision(mockDoc, undefined, fingerprint);
            await doGroupJoinForUser1(groupID);

            // now switch back to the main user and get the members of this group
            // then try to delete via the profileID

            const app = Firebase.init();
            await app.auth().signInWithEmailAndPassword(FIREBASE_USER, FIREBASE_PASS);

            const groupMembers = await GroupMembers.list(groupID);

            assert.equal(groupMembers.length, 2);

            const groupMember = groupMembers[0];

            const userRef = UserRefs.fromProfileID(groupMember.profileID);
            await GroupMemberDeletes.exec({groupID, userRefs: [userRef]});

            const groupMembersAfter = await GroupMembers.list(groupID);

            assert.equal(groupMembersAfter.length, 1);

        });

        it("provision a user for a group who isn't yet using polar", async function() {

            const mockDoc = await provisionAccountData();
            await doGroupProvision(mockDoc, 'alice@example.com');

            // now make sure the contact are correct...

            const contacts = await Contacts.list();

            assert.equal(contacts.length, 1);
            const contact = canonicalize(contacts[0], obj => {
                delete obj.created;
                delete obj.id;
            });

            assertJSON(contact, {
                "email": "alice@example.com",
                "reciprocal": false,
                "rel": [
                    "shared"
                ],
                "uid": "GdTRyWWIjsPtAcguFfH8FOiGryf1"
            });

        });

        it("join group twice and validate metadata (private group)", async function() {

            const mockDoc = await provisionAccountData();
            const {groupID} = await doGroupProvision(mockDoc);
            await doGroupJoinForUser1(groupID);

            // now run the second group join twice.
            await GroupJoins.exec({ groupID });

            await waitForGroupDelay();

            async function assertGroupAfter() {

                const group = await getGroupCanonicalized(groupID);

                assertJSON(group, {
                    visibility: 'private',
                    tags: [],
                    nrMembers: 2
                });

            }

            await assertGroupAfter();

            const groupMemberInvitations =  await GroupMemberInvitations.list();

            assert.equal(groupMemberInvitations.length, 0);

        });

        it("Import the doc from a private group into my datastore", async function() {

            const mockDoc = await provisionAccountData();
            const {groupID, docRef} = await doGroupProvision(mockDoc);
            await doGroupJoinForUser1(groupID);

            await waitForGroupDelay();

            async function withPersistenceLayer<T>(delegate: (persistenceLayer: PersistenceLayer) => Promise<T>) {

                const datastore = new FirebaseDatastore();
                const persistenceLayer = new DefaultPersistenceLayer(datastore);

                try {

                    await persistenceLayer.init();

                    return await delegate(persistenceLayer);

                } finally {
                    await persistenceLayer.stop();
                }

            }

            const docMetaFileRef = await withPersistenceLayer(async (persistenceLayer: PersistenceLayer) => {

                const {fingerprint} = docRef;

                await GroupDatastores.importFromGroup(persistenceLayer, {groupID, docRef});

                const docMeta = await persistenceLayer.getDocMeta(fingerprint);

                assert.isDefined(docMeta);

                const backendFileRef = BackendFileRefs.toBackendFileRef(Either.ofLeft(docMeta!));
                assert.isDefined(backendFileRef);

                const docFileMeta = await persistenceLayer.getFile(backendFileRef!.backend, backendFileRef!);

                await assertFetch(docFileMeta.url, {
                    status: 200,
                    type: 'cors',
                    contentType: 'application/pdf',
                    byteLength: 117687
                });

                const docMetaFileRef: DocMetaFileRef = {
                    fingerprint,
                    docFile: backendFileRef!,
                    docInfo: docMeta!.docInfo
                };

                return docMetaFileRef;

            });

            async function verifyUserAccessToGroupDocs(groupID: GroupIDStr, userPass: UserPass) {

                const app = Firebase.init();

                const auth = app.auth();
                await auth.signInWithEmailAndPassword(userPass.user, userPass.pass);

                const groupDocs = await GroupDocs.list(groupID);

                async function getDocMeta(docID: DocIDStr): Promise<RecordHolder<DocMetaHolder> | undefined> {

                    const firestore = app.firestore();

                    const ref = firestore
                        .collection(DatastoreCollection.DOC_META)
                        .doc(docID);

                    const snapshot = await ref.get();

                    return <RecordHolder<DocMetaHolder>> snapshot.data();

                }

                for (const groupDoc of groupDocs) {
                    const docMeta = await getDocMeta(groupDoc.docID);
                    assert.isDefined(docMeta, "Could not find doc for: " + groupDoc.docID);
                }

            }

            await verifyUserAccessToGroupDocs(groupID, {user: FIREBASE_USER, pass: FIREBASE_PASS});
            await verifyUserAccessToGroupDocs(groupID, {user: FIREBASE_USER1, pass: FIREBASE_PASS1});

            await withPersistenceLayer(async (persistenceLayer: PersistenceLayer) => {
                await persistenceLayer.delete(docMetaFileRef);
            });

        });

        it("Public group settings", async function() {

            const mockDoc = await provisionAccountData();

            const groupID = await doGroupProvisionPublic(mockDoc);

            async function assertGroup() {

                const group = await getGroupCanonicalized(groupID);

                assertJSON(group, {
                    name: 'linux',
                    visibility: 'public',
                    nrMembers: 1,
                    tags: [
                        'linux',
                        'ubuntu',
                        'debian'
                    ]
                });

            }

            function assertGroupJSON(group: Group) {

                assert.isDefined(group.created);

                const groupCanonicalized = canonicalize(group, obj => {
                    obj.created = 'xxx';
                });

                assertJSON(groupCanonicalized, {
                    "created": "xxx",
                    "id": "1iASZEzNPRe5xKreNty2",
                    "name": "linux",
                    "nrMembers": 1,
                    "tags": [
                        "linux",
                        "ubuntu",
                        "debian"
                    ],
                    "visibility": "public"
                });


            }
            
            await assertGroup();

            async function assertGroupSearch() {
                
                const hits = await Groups.executeSearchWithTags(['linux']);

                assert.equal(hits.length, 1);

                const first = hits[0];
                assertGroupJSON(first);
            }
            
            await assertGroupSearch();

            async function assertGetByName() {
                
                const group = await Groups.getByName('linux');
                assert.isDefined(group);
                assertGroupJSON(group!);

            }
            
            await assertGetByName();
            
        });

        it("Public docs in public groups", async function() {

            const mockDoc = await provisionAccountData();

            const groupID = await doGroupProvisionPublic(mockDoc);

            async function doGroupJoinForUser1(groupID: GroupIDStr) {

                const app = Firebase.init();

                console.log("doGroupJoin");

                // now switch to the user that was invited and join that group.

                await app.auth().signInWithEmailAndPassword(FIREBASE_USER1, FIREBASE_PASS1);

                console.log("Listing group invitations...");

                const groupMemberInvitations = await GroupMemberInvitations.list();

                console.log("Listing group invitations...done");

                // it's important that the user can see their own invitations.
                assert.equal(groupMemberInvitations.filter(current => current.groupID === groupID).length, 1,
                             "groupID not in the list of groups: " + groupID);

                const profileUpdateRequest: ProfileUpdateRequest = {
                    name: "Bob Johnson",
                    bio: "An example user from Mars",
                    location: "Capitol City, Mars",
                    links: ['https://www.mars.org']
                };

                console.log("Updating profile...");
                await ProfileUpdates.exec(profileUpdateRequest);
                console.log("Updating profile...done");

                console.log("Joining group...");
                await GroupJoins.exec({groupID});
                console.log("Joining group...done");

            }

        });

        it("Profile update", async function() {

            const app = Firebase.init();

            await app.auth().signInWithEmailAndPassword(FIREBASE_USER, FIREBASE_PASS);

            const request: ProfileUpdateRequest = {
                name: "Alice Smith",
                bio: "An example user from the land of Oz",
                location: "Capitol City, Oz",
                links: ['https://www.wonderland.org']
            };

            await ProfileUpdates.exec(request);

            const profile = await Profiles.currentProfile();

            assert.isDefined(profile);

            assert.equal(profile!.name, request.name);
            assert.equal(profile!.bio, request.bio);
            assert.equal(profile!.location, request.location);

        });

    });

    mocha.run((nrFailures: number) => {

        state.testResultWriter.write(nrFailures === 0)
            .catch(err => console.error("Unable to write results: ", err));

    });

});

interface UserPass {
    readonly user: string;
    readonly pass: string;
}

