// this test needs to be commented out because node in circleci fails with it...

// import firebase from 'firebase';
//
// xdescribe('FirebaseNode', function() {
//
//     it("basic", async function() {
//
//         console.log(firebase);
//         const app = firebase.initializeApp({
//             apiKey: "AIzaSyDokaZQO8TkmwtU4WKGnxKNyVumD79JYW0",
//             authDomain: "polar-32b0f.firebaseapp.com",
//             databaseURL: "https://polar-32b0f.firebaseio.com",
//             projectId: "polar-32b0f",
//             storageBucket: "polar-32b0f.appspot.com",
//             messagingSenderId: "919499255851",
//             // timestampsInSnapshots: true
//         });
//
//         const auth = firebase.auth();
//         const firestore = app.firestore();
//
//         // this work!!! but this has a fake ID ... so now we just have to restore the user when in node / backend
//         // context and eject and it will work just fine.
//         // const doc = await firestore.collection('unique_machines').doc('xxx').get()
//
//     });
//
// });
