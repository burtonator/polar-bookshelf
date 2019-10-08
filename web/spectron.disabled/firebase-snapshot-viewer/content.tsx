import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import * as firebase from '../../js/firebase/lib/firebase';
import {DatastoreCollection} from '../../js/datastore/FirebaseDatastore';
import {FirebaseTestRunner} from '../../js/firebase/FirebaseTestRunner';
import {Logging} from '../../js/logger/Logging';
import {Preconditions} from 'polar-shared/src/Preconditions';
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import ReactJson from 'react-json-view';
import {ISODateTimeStrings} from 'polar-shared/src/metadata/ISODateTimeStrings';

Logging.initForTesting();

function renderJSON(name: string, object: any) {

    const id = 'snapshot-logger';

    let parent = document.getElementById(id);

    if (! parent) {
        parent = document.createElement('div');
        parent.setAttribute("id", id);
        document.body.appendChild(parent);
    }

    const objectElementHolder = document.createElement('div');

    ReactDOM.render( <ReactJson src={object} name={name} shouldCollapse={() => true}/>, objectElementHolder);

    const timestampElement = document.createElement("pre");
    timestampElement.setAttribute("style", 'white-space: pre; font-weight: bold;');
    timestampElement.innerText = ISODateTimeStrings.create();

    const rowElement = document.createElement('div');
    rowElement.appendChild(timestampElement);
    rowElement.appendChild(objectElementHolder);

    parent.appendChild(rowElement);

    window.scrollTo(0, document!.body.scrollHeight);

}

SpectronRenderer.run(async (state) => {

    new FirebaseTestRunner(state).run(async () => {

        const onSnapshot = (collection: string,
                            snapshot: firebase.firestore.QuerySnapshot) => {

            const snapshotFacade = SnapshotFacades.toSnapshotFacade(collection, snapshot);

            console.log(snapshotFacade);

            renderJSON(collection, snapshotFacade);

        };

        const onSnapshotError = (err: Error) => {
            console.error("onSnapshotError: Could not handle snapshot: ", err);
        };

        const handleSnapshotsForCollection = (collection: string) => {

            const auth = firebase.auth();
            Preconditions.assertPresent(auth, "Not authenticated");

            const user = auth.currentUser;

            Preconditions.assertPresent(user, "No user");

            const uid = user!.uid;

            const query = firebase.firestore()
                .collection(collection)
                .where('uid', '==', uid);

            const unsubscribe =
                query.onSnapshot({includeMetadataChanges: true},
                                 (snapshot: firebase.firestore.QuerySnapshot) => onSnapshot(collection, snapshot),
                                 onSnapshotError);

        };

        async function monitorSnapshots() {

            // monitor the doc_info and doc_meta tables

            handleSnapshotsForCollection(DatastoreCollection.DOC_INFO);
            handleSnapshotsForCollection(DatastoreCollection.DOC_META);

        }

        await monitorSnapshots();

    }).catch(err => console.error(err));

});

export interface SnapshotFacade {
    readonly collection: string;
    readonly size: number;
    readonly empty: boolean;
    readonly metadata: SnapshotMetadataFacade;
    readonly docChanges: ReadonlyArray<DocumentChangeFacade>;
    readonly docs: ReadonlyArray<DocFacade>;

}

export interface SnapshotMetadataFacade {
    readonly fromCache: boolean;
    readonly hasPendingWrites: boolean;
}

export interface DocumentChangeFacade {
    readonly type: firebase.firestore.DocumentChangeType;
    readonly data: firebase.firestore.DocumentData;
}

export interface DocFacade {
    readonly data: firebase.firestore.DocumentData;
}

export class SnapshotFacades {

    public static toSnapshotFacade(collection: string,
                                   snapshot: firebase.firestore.QuerySnapshot): SnapshotFacade {

        const docChanges: DocumentChangeFacade[] =
            snapshot.docChanges().map(current => {
                return {
                    type: current.type,
                    data: current.doc.data()
                };
            });


        const docs: DocFacade[] =
            snapshot.docs.map(current => {
                return {
                    data: current.data()
                };
            });

        return {
            collection,
            size: snapshot.size,
            empty: snapshot.empty,
            docChanges,
            docs,
            metadata: {
                fromCache: snapshot.metadata.fromCache,
                hasPendingWrites: snapshot.metadata.hasPendingWrites
            }
        };

    }

}
