import {TestingTime} from '../test/TestingTime';
import {DocAnnotationIndex} from "./DocAnnotationIndex";
import {DocAnnotationIndexManager} from "./DocAnnotationIndexManager";
import {DocFileResolver} from "../datastore/DocFileResolvers";
import {Backend} from "polar-shared/src/datastore/Backend";
import {GetFileOpts} from "../datastore/Datastore";
import {DocFileMeta} from "../datastore/DocFileMeta";
import {
    DocMetaListener,
    DocMetaRecord,
    DocMetaRecords
} from "../datastore/sharing/db/DocMetaListeners";
import {DocMetas} from "../metadata/DocMetas";
import {UserProfile} from "../datastore/sharing/db/UserProfiles";
import {assert} from 'chai';
import {Proxies} from "../proxies/Proxies";
import {DocMeta} from "../metadata/DocMeta";
import {DefaultDocAnnotation, DocAnnotation} from "./DocAnnotation";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {Visibility} from "polar-shared/src/datastore/Visibility";
import {FileRef} from "polar-shared/src/datastore/FileRef";

describe('DocAnnotationIndexManager', function() {

    beforeEach(function() {
        TestingTime.freeze();
    });

    it("Updates and making sure the file is updated properly", async function() {

        const docFileResolver: DocFileResolver = (backend: Backend, ref: FileRef, opts?: GetFileOpts): DocFileMeta => {
            return {backend, ref, url: 'file:///fake/url/path.jpg'};
        };

        let nrUpdates = 0;

        const docAnnotationIndex = new DocAnnotationIndex();
        const docAnnotationIndexManager = new DocAnnotationIndexManager(docFileResolver, docAnnotationIndex, () => {
            console.log("onUpdated called properly");
            ++nrUpdates;
        });

        const fingerprint = "39b730b6e9d281b0eae91b2c2c29b842";
        const docID = 'docID:0x00001';
        const profileID = 'prof:0x00002';

        const docMetaHandler = (docMeta: IDocMeta) => {
            docAnnotationIndexManager.registerListenerForDocMeta(docMeta);
        };

        const errHandler = () => {

        };

        const docMetaListener = new DocMetaListener(fingerprint, profileID, docMetaHandler, errHandler);

        function toDocMeta(obj: any) {
            return DocMetas.deserialize(JSON.stringify(docMeta0), fingerprint);
        }

        function handlePrimaryDoc() {

            const docMeta = Proxies.create(toDocMeta(docMeta0));
            const userProfile: UserProfile = {
                self: true,
                profile: {
                    id: 'profile:1',
                    name: 'Alice',
                    handle: 'alice'
                }
            };

            DocMetaRecords.applyAuthorsFromUserProfile(docMeta, userProfile);

            docAnnotationIndexManager.registerListenerForDocMeta(docMeta);

        }

        assert.equal(docAnnotationIndex.getDocAnnotationsSorted().length, 0);
        handlePrimaryDoc();
        assert.equal(docAnnotationIndex.getDocAnnotationsSorted().length, 1);

        function verify0() {
            const sorted = docAnnotationIndex.getDocAnnotationsSorted();
            const first = sorted[0];
            assert.equal(first.id, '1BfJTbv3EZ');
            const children = first.getChildren();
            assert.equal(children.length, 1);
        }

        verify0();

        const userProfile1: UserProfile = {
            self: true,
            profile: {
                id: 'profile:1',
                name: 'Alice',
                handle: 'alice'
            }
        };

        function createDocMetaRecord(docMeta: IDocMeta): DocMetaRecord {

            const docMetaRecord: DocMetaRecord = {
                uid: 'uid:0x00001',
                id: docID,
                visibility: Visibility.PRIVATE,
                value: {
                    docInfo: docMeta.docInfo,
                    value: JSON.stringify(docMeta)
                }
            };

            return docMetaRecord;

        }

        async function handleSecondaryDoc() {

            const docMetaRecord = createDocMetaRecord(docMeta1);

            await docMetaListener.handleDocMetaRecordWithUserProfile({docID, fingerprint}, userProfile1, docMetaRecord);

        }

        await handleSecondaryDoc();

        function dumpDocAnnotations(docAnnotations: ReadonlyArray<DefaultDocAnnotation>) {

            for (const docAnnotation of docAnnotations) {
                console.log("==========");
                console.log("id: " + docAnnotation.id);
                console.log(docAnnotation.html);

                const children = docAnnotation.getChildren()
                for (const child of children) {
                    console.log("    ====");
                    console.log("    id: ", child.id);
                    console.log("    html: ", child.html);
                }

            }

        }


        function verify1() {

            console.log("========== Verify1")

            const docAnnotationsSorted = docAnnotationIndex.getDocAnnotationsSorted();
            dumpDocAnnotations(docAnnotationsSorted);
            assert.equal(docAnnotationsSorted.length, 2);
            assert.equal(nrUpdates, 2);

        }

        verify1();

        async function handleSecondaryDoc1() {

            const docMetaRecord = createDocMetaRecord(docMeta2);

            await docMetaListener.handleDocMetaRecordWithUserProfile({docID, fingerprint}, userProfile1, docMetaRecord);

        }

        await handleSecondaryDoc1();

        function annotationsToMap(docAnnotations: ReadonlyArray<DocAnnotation>) {
            return Dictionaries.toDict(docAnnotations, current => current.id);
        }

        function verify2() {

            console.log("========== Verify2")

            const annotationsSorted = docAnnotationIndex.getDocAnnotationsSorted();

            dumpDocAnnotations(annotationsSorted);

            const annotationsMap = annotationsToMap(annotationsSorted);

            const textHighlight = annotationsMap['12QDRhMd6B'];

            assert.equal(textHighlight.html, "Highly available cloud storage is often implemented with");

            const comments = textHighlight.getChildren();

            const commentsMap = annotationsToMap(comments);

            assert.equal(commentsMap['123zriqZgHZWjq7jRnEC'].html, "<p>kkkkkkdddddddaaa two</p>");


        }

        verify2();

        async function handleSecondaryDoc2() {

            const docMetaRecord = createDocMetaRecord(docMeta3);

            await docMetaListener.handleDocMetaRecordWithUserProfile({docID, fingerprint}, userProfile1, docMetaRecord);

        }

        await handleSecondaryDoc2();

        function verify3() {

            console.log("========== Verify3")

            const annotationsSorted = docAnnotationIndex.getDocAnnotationsSorted();
            dumpDocAnnotations(annotationsSorted);

            const annotationsMap = annotationsToMap(annotationsSorted);

            const textHighlight = annotationsMap['12QDRhMd6B'];

            const comments = textHighlight.getChildren();

            const commentsMap = annotationsToMap(comments);

            assert.equal(commentsMap['12P5mqA4Ye3ofTyMhum5'].html, "<p>kkkkkkdddddddaaa three</p>");

        }

        verify3();

    });

});

const docMeta0: any = {
    "annotationInfo": {},
    "version": 2,
    "attachments": {},
    "docInfo": {
        "progress": 0,
        "pagemarkType": "SINGLE_COLUMN",
        "properties": {},
        "archived": false,
        "flagged": false,
        "tags": {},
        "attachments": {},
        "nrPages": 14,
        "fingerprint": "39b730b6e9d281b0eae91b2c2c29b842",
        "added": "2019-06-29T16:54:21.768Z",
        "filename": "12Ji9JDcRn-availability.pdf",
        "uuid": "z2019-07-05T15:18:40.554Z+000001-145375091201",
        "title": "availability.pdf",
        "backend": "stash",
        "hashcode": {
            "alg": "keccak256",
            "data": "12Ji9JDcRnZT27jeckr4HusYY29QVwj4Wv2J6iYc5YXjtzn3ZJT",
            "enc": "base58check"
        },
        "lastUpdated": "2019-07-05T15:18:40.554Z",
        "nrComments": 2,
        "nrNotes": 0,
        "nrFlashcards": 0,
        "nrTextHighlights": 1,
        "nrAreaHighlights": 0,
        "nrAnnotations": 3
    },
    "pageMetas": {
        "1": {
            "pagemarks": {},
            "notes": {},
            "comments": {
                "14E85Nrc4pH1h5fdcpVv": {
                    "id": "14E85Nrc4pH1h5fdcpVv",
                    "guid": "14E85Nrc4pH1h5fdcpVv",
                    "created": "2019-07-04T16:06:09.454Z",
                    "lastUpdated": "2019-07-04T16:06:09.454Z",
                    "content": {
                        "HTML": "<p>this is a test...</p>"
                    },
                    "ref": "text-highlight:12QDRhMd6B",
                    "author": {
                        "name": "Kevin Burton",
                        "profileID": "12Erv4jCF5HEBFBVszBZ",
                        "image": {
                            "src": "https://lh5.googleusercontent.com/-BldJH1bae3o/AAAAAAAAAAI/AAAAAAAAADY/Di36-YNrKqk/photo.jpg"
                        },
                        "guest": false
                    }
                },
                "1YdGwTN2RJFEtvqXgN8g": {
                    "id": "1YdGwTN2RJFEtvqXgN8g",
                    "guid": "1YdGwTN2RJFEtvqXgN8g",
                    "created": "2019-07-05T14:14:41.518Z",
                    "lastUpdated": "2019-07-05T14:36:38.851Z",
                    "content": {
                        "HTML": "<p>asdf asdf</p>"
                    },
                    "ref": "text-highlight:1BfJTbv3EZ",
                    "author": {
                        "name": "Kevin Burton",
                        "profileID": "12Erv4jCF5HEBFBVszBZ",
                        "image": {
                            "src": "https://lh5.googleusercontent.com/-BldJH1bae3o/AAAAAAAAAAI/AAAAAAAAADY/Di36-YNrKqk/photo.jpg"
                        },
                        "guest": false
                    }
                }
            },
            "questions": {},
            "flashcards": {},
            "textHighlights": {
                "1BfJTbv3EZ": {
                    "id": "1BfJTbv3EZ",
                    "guid": "1BfJTbv3EZ",
                    "created": "2019-07-02T19:43:58.417Z",
                    "lastUpdated": "2019-07-02T19:43:58.417Z",
                    "rects": {
                        "0": {
                            "left": 506,
                            "top": 370,
                            "right": 567,
                            "bottom": 385,
                            "width": 61,
                            "height": 15
                        }
                    },
                    "textSelections": {
                        "0": {
                            "text": " Google an",
                            "rect": {
                                "left": 506,
                                "top": 370,
                                "right": 567,
                                "bottom": 385,
                                "width": 60,
                                "height": 15
                            }
                        }
                    },
                    "text": {
                        "TEXT": " Google an"
                    },
                    "images": {},
                    "notes": {},
                    "questions": {},
                    "flashcards": {},
                    "color": "red",
                    "author": {
                        "name": "Kevin Burton",
                        "profileID": "12Erv4jCF5HEBFBVszBZ",
                        "image": {
                            "src": "https://lh5.googleusercontent.com/-BldJH1bae3o/AAAAAAAAAAI/AAAAAAAAADY/Di36-YNrKqk/photo.jpg"
                        },
                        "guest": false
                    }
                }
            },
            "areaHighlights": {},
            "screenshots": {},
            "thumbnails": {},
            "readingProgress": {},
            "pageInfo": {
                "num": 1
            }
        },
        "2": {
            "pagemarks": {},
            "notes": {},
            "comments": {},
            "questions": {},
            "flashcards": {},
            "textHighlights": {},
            "areaHighlights": {},
            "screenshots": {},
            "thumbnails": {},
            "readingProgress": {},
            "pageInfo": {
                "num": 2
            }
        },
        "3": {
            "pagemarks": {},
            "notes": {},
            "comments": {},
            "questions": {},
            "flashcards": {},
            "textHighlights": {},
            "areaHighlights": {},
            "screenshots": {},
            "thumbnails": {},
            "readingProgress": {},
            "pageInfo": {
                "num": 3
            }
        },
        "4": {
            "pagemarks": {},
            "notes": {},
            "comments": {},
            "questions": {},
            "flashcards": {},
            "textHighlights": {},
            "areaHighlights": {},
            "screenshots": {},
            "thumbnails": {},
            "readingProgress": {},
            "pageInfo": {
                "num": 4
            }
        },
        "5": {
            "pagemarks": {},
            "notes": {},
            "comments": {},
            "questions": {},
            "flashcards": {},
            "textHighlights": {},
            "areaHighlights": {},
            "screenshots": {},
            "thumbnails": {},
            "readingProgress": {},
            "pageInfo": {
                "num": 5
            }
        },
        "6": {
            "pagemarks": {},
            "notes": {},
            "comments": {},
            "questions": {},
            "flashcards": {},
            "textHighlights": {},
            "areaHighlights": {},
            "screenshots": {},
            "thumbnails": {},
            "readingProgress": {},
            "pageInfo": {
                "num": 6
            }
        },
        "7": {
            "pagemarks": {},
            "notes": {},
            "comments": {},
            "questions": {},
            "flashcards": {},
            "textHighlights": {},
            "areaHighlights": {},
            "screenshots": {},
            "thumbnails": {},
            "readingProgress": {},
            "pageInfo": {
                "num": 7
            }
        },
        "8": {
            "pagemarks": {},
            "notes": {},
            "comments": {},
            "questions": {},
            "flashcards": {},
            "textHighlights": {},
            "areaHighlights": {},
            "screenshots": {},
            "thumbnails": {},
            "readingProgress": {},
            "pageInfo": {
                "num": 8
            }
        },
        "9": {
            "pagemarks": {},
            "notes": {},
            "comments": {},
            "questions": {},
            "flashcards": {},
            "textHighlights": {},
            "areaHighlights": {},
            "screenshots": {},
            "thumbnails": {},
            "readingProgress": {},
            "pageInfo": {
                "num": 9
            }
        },
        "10": {
            "pagemarks": {},
            "notes": {},
            "comments": {},
            "questions": {},
            "flashcards": {},
            "textHighlights": {},
            "areaHighlights": {},
            "screenshots": {},
            "thumbnails": {},
            "readingProgress": {},
            "pageInfo": {
                "num": 10
            }
        },
        "11": {
            "pagemarks": {},
            "notes": {},
            "comments": {},
            "questions": {},
            "flashcards": {},
            "textHighlights": {},
            "areaHighlights": {},
            "screenshots": {},
            "thumbnails": {},
            "readingProgress": {},
            "pageInfo": {
                "num": 11
            }
        },
        "12": {
            "pagemarks": {},
            "notes": {},
            "comments": {},
            "questions": {},
            "flashcards": {},
            "textHighlights": {},
            "areaHighlights": {},
            "screenshots": {},
            "thumbnails": {},
            "readingProgress": {},
            "pageInfo": {
                "num": 12
            }
        },
        "13": {
            "pagemarks": {},
            "notes": {},
            "comments": {},
            "questions": {},
            "flashcards": {},
            "textHighlights": {},
            "areaHighlights": {},
            "screenshots": {},
            "thumbnails": {},
            "readingProgress": {},
            "pageInfo": {
                "num": 13
            }
        },
        "14": {
            "pagemarks": {},
            "notes": {},
            "comments": {},
            "questions": {},
            "flashcards": {},
            "textHighlights": {},
            "areaHighlights": {},
            "screenshots": {},
            "thumbnails": {},
            "readingProgress": {},
            "pageInfo": {
                "num": 14
            }
        }
    }
};

const docMeta1: any = {
    "annotationInfo": {},
    "version": 2,
    "attachments": {},
    "docInfo": {
        "progress": 0,
        "pagemarkType": "SINGLE_COLUMN",
        "properties": {},
        "archived": false,
        "flagged": false,
        "tags": {},
        "attachments": {},
        "nrPages": 14,
        "fingerprint": "39b730b6e9d281b0eae91b2c2c29b842",
        "added": "2019-06-29T16:52:36.339Z",
        "filename": "12Ji9JDcRn-availability.pdf",
        "uuid": "z2019-07-04T21:52:01.020Z+000015-079792152584",
        "title": "availability.pdf",
        "hashcode": {
            "enc": "base58check",
            "alg": "keccak256",
            "data": "12Ji9JDcRnZT27jeckr4HusYY29QVwj4Wv2J6iYc5YXjtzn3ZJT"
        },
        "lastUpdated": "2019-07-04T21:52:01.020Z",
        "nrComments": 6,
        "nrNotes": 0,
        "nrFlashcards": 0,
        "nrTextHighlights": 1,
        "nrAreaHighlights": 0,
        "nrAnnotations": 7
    },
    "pageMetas": {
        "1": {
            "pagemarks": {},
            "notes": {},
            "comments": {
                "126j66FgcfUnarx6wt9x": {
                    "id": "126j66FgcfUnarx6wt9x",
                    "guid": "126j66FgcfUnarx6wt9x",
                    "created": "2019-06-29T16:52:58.621Z",
                    "lastUpdated": "2019-06-29T16:52:58.621Z",
                    "content": {
                        "HTML": "<p>this is a example highlight and comment from the test user.</p>"
                    },
                    "ref": "text-highlight:12QDRhMd6B",
                    "author": {
                        "name": "test test",
                        "profileID": "1mAd24CXixoN99esmfLL",
                        "image": {
                            "src": "https://lh6.googleusercontent.com/-HM8tIi-Ug1Q/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rdFOSaGL3nUcMqVCxU3GmT11JttSQ/mo/photo.jpg"
                        },
                        "guest": true
                    }
                },
                "12S4rbb47bSStNtMXmMx": {
                    "id": "12S4rbb47bSStNtMXmMx",
                    "guid": "12S4rbb47bSStNtMXmMx",
                    "created": "2019-06-29T17:04:48.896Z",
                    "lastUpdated": "2019-06-29T17:04:48.896Z",
                    "content": {
                        "HTML": "<p>another one.</p>"
                    },
                    "ref": "text-highlight:12QDRhMd6B",
                    "author": {
                        "name": "test test",
                        "profileID": "1mAd24CXixoN99esmfLL",
                        "image": {
                            "src": "https://lh6.googleusercontent.com/-HM8tIi-Ug1Q/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rdFOSaGL3nUcMqVCxU3GmT11JttSQ/mo/photo.jpg"
                        },
                        "guest": true
                    }
                },
                "12EpQCYjAteYhmcVfLF2": {
                    "id": "12EpQCYjAteYhmcVfLF2",
                    "guid": "12EpQCYjAteYhmcVfLF2",
                    "created": "2019-07-04T03:29:01.654Z",
                    "lastUpdated": "2019-07-04T03:29:01.654Z",
                    "content": {
                        "HTML": "<p>asdf</p>"
                    },
                    "ref": "text-highlight:12QDRhMd6B",
                    "author": {
                        "name": "test test",
                        "profileID": "1mAd24CXixoN99esmfLL",
                        "image": {
                            "src": "https://lh6.googleusercontent.com/-HM8tIi-Ug1Q/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rdFOSaGL3nUcMqVCxU3GmT11JttSQ/mo/photo.jpg"
                        },
                        "guest": true
                    }
                },
                "12e21r79FDBWpwhDgs86": {
                    "id": "12e21r79FDBWpwhDgs86",
                    "guid": "12e21r79FDBWpwhDgs86",
                    "created": "2019-07-04T21:26:47.828Z",
                    "lastUpdated": "2019-07-04T21:26:47.828Z",
                    "content": {
                        "HTML": "<p>ok.. updates don't work but what about new comments?</p>"
                    },
                    "ref": "text-highlight:12QDRhMd6B",
                    "author": {
                        "name": "test test",
                        "profileID": "1mAd24CXixoN99esmfLL",
                        "image": {
                            "src": "https://lh6.googleusercontent.com/-HM8tIi-Ug1Q/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rdFOSaGL3nUcMqVCxU3GmT11JttSQ/mo/photo.jpg"
                        },
                        "guest": true
                    }
                },
                "12LZuo2Z1jovsW2phPu6": {
                    "id": "12LZuo2Z1jovsW2phPu6",
                    "guid": "12LZuo2Z1jovsW2phPu6",
                    "created": "2019-07-04T21:27:20.355Z",
                    "lastUpdated": "2019-07-04T21:27:20.355Z",
                    "content": {
                        "HTML": "<p>another test.</p>"
                    },
                    "ref": "text-highlight:12QDRhMd6B",
                    "author": {
                        "name": "test test",
                        "profileID": "1mAd24CXixoN99esmfLL",
                        "image": {
                            "src": "https://lh6.googleusercontent.com/-HM8tIi-Ug1Q/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rdFOSaGL3nUcMqVCxU3GmT11JttSQ/mo/photo.jpg"
                        },
                        "guest": true
                    }
                },
                "12rcBjJNPuVVKGBtt3i4": {
                    "id": "12rcBjJNPuVVKGBtt3i4",
                    "guid": "12rcBjJNPuVVKGBtt3i4",
                    "created": "2019-07-04T21:26:12.258Z",
                    "lastUpdated": "2019-07-04T21:52:00.973Z",
                    "content": {
                        "HTML": "<p>kkkkkkdddddddaaa</p>"
                    },
                    "ref": "text-highlight:12QDRhMd6B",
                    "author": {
                        "name": "test test",
                        "profileID": "1mAd24CXixoN99esmfLL",
                        "image": {
                            "src": "https://lh6.googleusercontent.com/-HM8tIi-Ug1Q/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rdFOSaGL3nUcMqVCxU3GmT11JttSQ/mo/photo.jpg"
                        },
                        "guest": true
                    }
                }
            },
            "questions": {},
            "flashcards": {},
            "textHighlights": {
                "12QDRhMd6B": {
                    "id": "12QDRhMd6B",
                    "guid": "12QDRhMd6B",
                    "created": "2019-06-29T16:52:46.249Z",
                    "lastUpdated": "2019-06-29T16:52:46.249Z",
                    "rects": {
                        "0": {
                            "left": 96,
                            "top": 364,
                            "right": 396,
                            "bottom": 379,
                            "width": 300,
                            "height": 15
                        }
                    },
                    "textSelections": {
                        "0": {
                            "text": "Highly available cloud storage ",
                            "rect": {
                                "left": 96,
                                "top": 364,
                                "right": 260,
                                "bottom": 379,
                                "width": 163,
                                "height": 15
                            }
                        },
                        "1": {
                            "text": "is often implemented with",
                            "rect": {
                                "left": 260,
                                "top": 364,
                                "right": 396,
                                "bottom": 379,
                                "width": 136,
                                "height": 15
                            }
                        }
                    },
                    "text": {
                        "TEXT": "Highly available cloud storage is often implemented with"
                    },
                    "images": {},
                    "notes": {},
                    "questions": {},
                    "flashcards": {},
                    "color": "red",
                    "author": {
                        "name": "test test",
                        "profileID": "1mAd24CXixoN99esmfLL",
                        "image": {
                            "src": "https://lh6.googleusercontent.com/-HM8tIi-Ug1Q/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rdFOSaGL3nUcMqVCxU3GmT11JttSQ/mo/photo.jpg"
                        },
                        "guest": true
                    }
                }
            },
            "areaHighlights": {},
            "screenshots": {},
            "thumbnails": {},
            "readingProgress": {},
            "pageInfo": {
                "num": 1
            }
        },
        "2": {
            "pagemarks": {},
            "notes": {},
            "comments": {},
            "questions": {},
            "flashcards": {},
            "textHighlights": {},
            "areaHighlights": {},
            "screenshots": {},
            "thumbnails": {},
            "readingProgress": {},
            "pageInfo": {
                "num": 2
            }
        },
        "3": {
            "pagemarks": {},
            "notes": {},
            "comments": {},
            "questions": {},
            "flashcards": {},
            "textHighlights": {},
            "areaHighlights": {},
            "screenshots": {},
            "thumbnails": {},
            "readingProgress": {},
            "pageInfo": {
                "num": 3
            }
        },
        "4": {
            "pagemarks": {},
            "notes": {},
            "comments": {},
            "questions": {},
            "flashcards": {},
            "textHighlights": {},
            "areaHighlights": {},
            "screenshots": {},
            "thumbnails": {},
            "readingProgress": {},
            "pageInfo": {
                "num": 4
            }
        },
        "5": {
            "pagemarks": {},
            "notes": {},
            "comments": {},
            "questions": {},
            "flashcards": {},
            "textHighlights": {},
            "areaHighlights": {},
            "screenshots": {},
            "thumbnails": {},
            "readingProgress": {},
            "pageInfo": {
                "num": 5
            }
        },
        "6": {
            "pagemarks": {},
            "notes": {},
            "comments": {},
            "questions": {},
            "flashcards": {},
            "textHighlights": {},
            "areaHighlights": {},
            "screenshots": {},
            "thumbnails": {},
            "readingProgress": {},
            "pageInfo": {
                "num": 6
            }
        },
        "7": {
            "pagemarks": {},
            "notes": {},
            "comments": {},
            "questions": {},
            "flashcards": {},
            "textHighlights": {},
            "areaHighlights": {},
            "screenshots": {},
            "thumbnails": {},
            "readingProgress": {},
            "pageInfo": {
                "num": 7
            }
        },
        "8": {
            "pagemarks": {},
            "notes": {},
            "comments": {},
            "questions": {},
            "flashcards": {},
            "textHighlights": {},
            "areaHighlights": {},
            "screenshots": {},
            "thumbnails": {},
            "readingProgress": {},
            "pageInfo": {
                "num": 8
            }
        },
        "9": {
            "pagemarks": {},
            "notes": {},
            "comments": {},
            "questions": {},
            "flashcards": {},
            "textHighlights": {},
            "areaHighlights": {},
            "screenshots": {},
            "thumbnails": {},
            "readingProgress": {},
            "pageInfo": {
                "num": 9
            }
        },
        "10": {
            "pagemarks": {},
            "notes": {},
            "comments": {},
            "questions": {},
            "flashcards": {},
            "textHighlights": {},
            "areaHighlights": {},
            "screenshots": {},
            "thumbnails": {},
            "readingProgress": {},
            "pageInfo": {
                "num": 10
            }
        },
        "11": {
            "pagemarks": {},
            "notes": {},
            "comments": {},
            "questions": {},
            "flashcards": {},
            "textHighlights": {},
            "areaHighlights": {},
            "screenshots": {},
            "thumbnails": {},
            "readingProgress": {},
            "pageInfo": {
                "num": 11
            }
        },
        "12": {
            "pagemarks": {},
            "notes": {},
            "comments": {},
            "questions": {},
            "flashcards": {},
            "textHighlights": {},
            "areaHighlights": {},
            "screenshots": {},
            "thumbnails": {},
            "readingProgress": {},
            "pageInfo": {
                "num": 12
            }
        },
        "13": {
            "pagemarks": {},
            "notes": {},
            "comments": {},
            "questions": {},
            "flashcards": {},
            "textHighlights": {},
            "areaHighlights": {},
            "screenshots": {},
            "thumbnails": {},
            "readingProgress": {},
            "pageInfo": {
                "num": 13
            }
        },
        "14": {
            "pagemarks": {},
            "notes": {},
            "comments": {},
            "questions": {},
            "flashcards": {},
            "textHighlights": {},
            "areaHighlights": {},
            "screenshots": {},
            "thumbnails": {},
            "readingProgress": {},
            "pageInfo": {
                "num": 14
            }
        }
    }
};

const docMeta2: any = {
    "annotationInfo": {},
    "version": 2,
    "attachments": {},
    "docInfo": {
        "progress": 0,
        "pagemarkType": "SINGLE_COLUMN",
        "properties": {},
        "archived": false,
        "flagged": false,
        "tags": {},
        "attachments": {},
        "nrPages": 14,
        "fingerprint": "39b730b6e9d281b0eae91b2c2c29b842",
        "added": "2019-06-29T16:52:36.339Z",
        "filename": "12Ji9JDcRn-availability.pdf",
        "uuid": "z2019-07-07T16:57:15.035Z+000001-201567762762",
        "title": "availability.pdf",
        "hashcode": {
            "enc": "base58check",
            "alg": "keccak256",
            "data": "12Ji9JDcRnZT27jeckr4HusYY29QVwj4Wv2J6iYc5YXjtzn3ZJT"
        },
        "lastUpdated": "2019-07-07T16:57:15.035Z",
        "nrComments": 6,
        "nrNotes": 0,
        "nrFlashcards": 0,
        "nrTextHighlights": 1,
        "nrAreaHighlights": 0,
        "nrAnnotations": 7
    },
    "pageMetas": {
        "1": {
            "pagemarks": {},
            "notes": {},
            "comments": {
                "126j66FgcfUnarx6wt9x": {
                    "id": "126j66FgcfUnarx6wt9x",
                    "guid": "126j66FgcfUnarx6wt9x",
                    "created": "2019-06-29T16:52:58.621Z",
                    "lastUpdated": "2019-06-29T16:52:58.621Z",
                    "content": {
                        "HTML": "<p>this is a example highlight and comment from the test user.</p>"
                    },
                    "ref": "text-highlight:12QDRhMd6B",
                    "author": {
                        "name": "test test",
                        "profileID": "1mAd24CXixoN99esmfLL",
                        "image": {
                            "src": "https://lh6.googleusercontent.com/-HM8tIi-Ug1Q/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rdFOSaGL3nUcMqVCxU3GmT11JttSQ/mo/photo.jpg"
                        },
                        "guest": true
                    }
                },
                "12S4rbb47bSStNtMXmMx": {
                    "id": "12S4rbb47bSStNtMXmMx",
                    "guid": "12S4rbb47bSStNtMXmMx",
                    "created": "2019-06-29T17:04:48.896Z",
                    "lastUpdated": "2019-06-29T17:04:48.896Z",
                    "content": {
                        "HTML": "<p>another one.</p>"
                    },
                    "ref": "text-highlight:12QDRhMd6B",
                    "author": {
                        "name": "test test",
                        "profileID": "1mAd24CXixoN99esmfLL",
                        "image": {
                            "src": "https://lh6.googleusercontent.com/-HM8tIi-Ug1Q/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rdFOSaGL3nUcMqVCxU3GmT11JttSQ/mo/photo.jpg"
                        },
                        "guest": true
                    }
                },
                "12EpQCYjAteYhmcVfLF2": {
                    "id": "12EpQCYjAteYhmcVfLF2",
                    "guid": "12EpQCYjAteYhmcVfLF2",
                    "created": "2019-07-04T03:29:01.654Z",
                    "lastUpdated": "2019-07-04T03:29:01.654Z",
                    "content": {
                        "HTML": "<p>asdf</p>"
                    },
                    "ref": "text-highlight:12QDRhMd6B",
                    "author": {
                        "name": "test test",
                        "profileID": "1mAd24CXixoN99esmfLL",
                        "image": {
                            "src": "https://lh6.googleusercontent.com/-HM8tIi-Ug1Q/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rdFOSaGL3nUcMqVCxU3GmT11JttSQ/mo/photo.jpg"
                        },
                        "guest": true
                    }
                },
                "12e21r79FDBWpwhDgs86": {
                    "id": "12e21r79FDBWpwhDgs86",
                    "guid": "12e21r79FDBWpwhDgs86",
                    "created": "2019-07-04T21:26:47.828Z",
                    "lastUpdated": "2019-07-04T21:26:47.828Z",
                    "content": {
                        "HTML": "<p>ok.. updates don't work but what about new comments?</p>"
                    },
                    "ref": "text-highlight:12QDRhMd6B",
                    "author": {
                        "name": "test test",
                        "profileID": "1mAd24CXixoN99esmfLL",
                        "image": {
                            "src": "https://lh6.googleusercontent.com/-HM8tIi-Ug1Q/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rdFOSaGL3nUcMqVCxU3GmT11JttSQ/mo/photo.jpg"
                        },
                        "guest": true
                    }
                },
                "12LZuo2Z1jovsW2phPu6": {
                    "id": "12LZuo2Z1jovsW2phPu6",
                    "guid": "12LZuo2Z1jovsW2phPu6",
                    "created": "2019-07-04T21:27:20.355Z",
                    "lastUpdated": "2019-07-04T21:27:20.355Z",
                    "content": {
                        "HTML": "<p>another test.</p>"
                    },
                    "ref": "text-highlight:12QDRhMd6B",
                    "author": {
                        "name": "test test",
                        "profileID": "1mAd24CXixoN99esmfLL",
                        "image": {
                            "src": "https://lh6.googleusercontent.com/-HM8tIi-Ug1Q/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rdFOSaGL3nUcMqVCxU3GmT11JttSQ/mo/photo.jpg"
                        },
                        "guest": true
                    }
                },
                "123zriqZgHZWjq7jRnEC": {
                    "id": "123zriqZgHZWjq7jRnEC",
                    "guid": "123zriqZgHZWjq7jRnEC",
                    "created": "2019-07-04T21:26:12.258Z",
                    "lastUpdated": "2019-07-07T16:57:14.986Z",
                    "content": {
                        "HTML": "<p>kkkkkkdddddddaaa two</p>"
                    },
                    "ref": "text-highlight:12QDRhMd6B",
                    "author": {
                        "name": "test test",
                        "profileID": "1mAd24CXixoN99esmfLL",
                        "image": {
                            "src": "https://lh6.googleusercontent.com/-HM8tIi-Ug1Q/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rdFOSaGL3nUcMqVCxU3GmT11JttSQ/mo/photo.jpg"
                        },
                        "guest": true
                    }
                }
            },
            "questions": {},
            "flashcards": {},
            "textHighlights": {
                "12QDRhMd6B": {
                    "id": "12QDRhMd6B",
                    "guid": "12QDRhMd6B",
                    "created": "2019-06-29T16:52:46.249Z",
                    "lastUpdated": "2019-06-29T16:52:46.249Z",
                    "rects": {
                        "0": {
                            "left": 96,
                            "top": 364,
                            "right": 396,
                            "bottom": 379,
                            "width": 300,
                            "height": 15
                        }
                    },
                    "textSelections": {
                        "0": {
                            "text": "Highly available cloud storage ",
                            "rect": {
                                "left": 96,
                                "top": 364,
                                "right": 260,
                                "bottom": 379,
                                "width": 163,
                                "height": 15
                            }
                        },
                        "1": {
                            "text": "is often implemented with",
                            "rect": {
                                "left": 260,
                                "top": 364,
                                "right": 396,
                                "bottom": 379,
                                "width": 136,
                                "height": 15
                            }
                        }
                    },
                    "text": {
                        "TEXT": "Highly available cloud storage is often implemented with"
                    },
                    "images": {},
                    "notes": {},
                    "questions": {},
                    "flashcards": {},
                    "color": "red",
                    "author": {
                        "name": "test test",
                        "profileID": "1mAd24CXixoN99esmfLL",
                        "image": {
                            "src": "https://lh6.googleusercontent.com/-HM8tIi-Ug1Q/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rdFOSaGL3nUcMqVCxU3GmT11JttSQ/mo/photo.jpg"
                        },
                        "guest": true
                    }
                }
            },
            "areaHighlights": {},
            "screenshots": {},
            "thumbnails": {},
            "readingProgress": {},
            "pageInfo": {
                "num": 1
            }
        },
        "2": {
            "pagemarks": {},
            "notes": {},
            "comments": {},
            "questions": {},
            "flashcards": {},
            "textHighlights": {},
            "areaHighlights": {},
            "screenshots": {},
            "thumbnails": {},
            "readingProgress": {},
            "pageInfo": {
                "num": 2
            }
        },
        "3": {
            "pagemarks": {},
            "notes": {},
            "comments": {},
            "questions": {},
            "flashcards": {},
            "textHighlights": {},
            "areaHighlights": {},
            "screenshots": {},
            "thumbnails": {},
            "readingProgress": {},
            "pageInfo": {
                "num": 3
            }
        },
        "4": {
            "pagemarks": {},
            "notes": {},
            "comments": {},
            "questions": {},
            "flashcards": {},
            "textHighlights": {},
            "areaHighlights": {},
            "screenshots": {},
            "thumbnails": {},
            "readingProgress": {},
            "pageInfo": {
                "num": 4
            }
        },
        "5": {
            "pagemarks": {},
            "notes": {},
            "comments": {},
            "questions": {},
            "flashcards": {},
            "textHighlights": {},
            "areaHighlights": {},
            "screenshots": {},
            "thumbnails": {},
            "readingProgress": {},
            "pageInfo": {
                "num": 5
            }
        },
        "6": {
            "pagemarks": {},
            "notes": {},
            "comments": {},
            "questions": {},
            "flashcards": {},
            "textHighlights": {},
            "areaHighlights": {},
            "screenshots": {},
            "thumbnails": {},
            "readingProgress": {},
            "pageInfo": {
                "num": 6
            }
        },
        "7": {
            "pagemarks": {},
            "notes": {},
            "comments": {},
            "questions": {},
            "flashcards": {},
            "textHighlights": {},
            "areaHighlights": {},
            "screenshots": {},
            "thumbnails": {},
            "readingProgress": {},
            "pageInfo": {
                "num": 7
            }
        },
        "8": {
            "pagemarks": {},
            "notes": {},
            "comments": {},
            "questions": {},
            "flashcards": {},
            "textHighlights": {},
            "areaHighlights": {},
            "screenshots": {},
            "thumbnails": {},
            "readingProgress": {},
            "pageInfo": {
                "num": 8
            }
        },
        "9": {
            "pagemarks": {},
            "notes": {},
            "comments": {},
            "questions": {},
            "flashcards": {},
            "textHighlights": {},
            "areaHighlights": {},
            "screenshots": {},
            "thumbnails": {},
            "readingProgress": {},
            "pageInfo": {
                "num": 9
            }
        },
        "10": {
            "pagemarks": {},
            "notes": {},
            "comments": {},
            "questions": {},
            "flashcards": {},
            "textHighlights": {},
            "areaHighlights": {},
            "screenshots": {},
            "thumbnails": {},
            "readingProgress": {},
            "pageInfo": {
                "num": 10
            }
        },
        "11": {
            "pagemarks": {},
            "notes": {},
            "comments": {},
            "questions": {},
            "flashcards": {},
            "textHighlights": {},
            "areaHighlights": {},
            "screenshots": {},
            "thumbnails": {},
            "readingProgress": {},
            "pageInfo": {
                "num": 11
            }
        },
        "12": {
            "pagemarks": {},
            "notes": {},
            "comments": {},
            "questions": {},
            "flashcards": {},
            "textHighlights": {},
            "areaHighlights": {},
            "screenshots": {},
            "thumbnails": {},
            "readingProgress": {},
            "pageInfo": {
                "num": 12
            }
        },
        "13": {
            "pagemarks": {},
            "notes": {},
            "comments": {},
            "questions": {},
            "flashcards": {},
            "textHighlights": {},
            "areaHighlights": {},
            "screenshots": {},
            "thumbnails": {},
            "readingProgress": {},
            "pageInfo": {
                "num": 13
            }
        },
        "14": {
            "pagemarks": {},
            "notes": {},
            "comments": {},
            "questions": {},
            "flashcards": {},
            "textHighlights": {},
            "areaHighlights": {},
            "screenshots": {},
            "thumbnails": {},
            "readingProgress": {},
            "pageInfo": {
                "num": 14
            }
        }
    }
};

const docMeta3: any = {
    "annotationInfo": {},
    "version": 2,
    "attachments": {},
    "docInfo": {
        "progress": 0,
        "pagemarkType": "SINGLE_COLUMN",
        "properties": {},
        "archived": false,
        "flagged": false,
        "tags": {},
        "attachments": {},
        "nrPages": 14,
        "fingerprint": "39b730b6e9d281b0eae91b2c2c29b842",
        "added": "2019-06-29T16:52:36.339Z",
        "filename": "12Ji9JDcRn-availability.pdf",
        "uuid": "z2019-07-07T16:57:52.721Z+000002-201567762762",
        "title": "availability.pdf",
        "hashcode": {
            "enc": "base58check",
            "alg": "keccak256",
            "data": "12Ji9JDcRnZT27jeckr4HusYY29QVwj4Wv2J6iYc5YXjtzn3ZJT"
        },
        "lastUpdated": "2019-07-07T16:57:52.720Z",
        "nrComments": 6,
        "nrNotes": 0,
        "nrFlashcards": 0,
        "nrTextHighlights": 1,
        "nrAreaHighlights": 0,
        "nrAnnotations": 7
    },
    "pageMetas": {
        "1": {
            "pagemarks": {},
            "notes": {},
            "comments": {
                "126j66FgcfUnarx6wt9x": {
                    "id": "126j66FgcfUnarx6wt9x",
                    "guid": "126j66FgcfUnarx6wt9x",
                    "created": "2019-06-29T16:52:58.621Z",
                    "lastUpdated": "2019-06-29T16:52:58.621Z",
                    "content": {
                        "HTML": "<p>this is a example highlight and comment from the test user.</p>"
                    },
                    "ref": "text-highlight:12QDRhMd6B",
                    "author": {
                        "name": "test test",
                        "profileID": "1mAd24CXixoN99esmfLL",
                        "image": {
                            "src": "https://lh6.googleusercontent.com/-HM8tIi-Ug1Q/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rdFOSaGL3nUcMqVCxU3GmT11JttSQ/mo/photo.jpg"
                        },
                        "guest": true
                    }
                },
                "12S4rbb47bSStNtMXmMx": {
                    "id": "12S4rbb47bSStNtMXmMx",
                    "guid": "12S4rbb47bSStNtMXmMx",
                    "created": "2019-06-29T17:04:48.896Z",
                    "lastUpdated": "2019-06-29T17:04:48.896Z",
                    "content": {
                        "HTML": "<p>another one.</p>"
                    },
                    "ref": "text-highlight:12QDRhMd6B",
                    "author": {
                        "name": "test test",
                        "profileID": "1mAd24CXixoN99esmfLL",
                        "image": {
                            "src": "https://lh6.googleusercontent.com/-HM8tIi-Ug1Q/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rdFOSaGL3nUcMqVCxU3GmT11JttSQ/mo/photo.jpg"
                        },
                        "guest": true
                    }
                },
                "12EpQCYjAteYhmcVfLF2": {
                    "id": "12EpQCYjAteYhmcVfLF2",
                    "guid": "12EpQCYjAteYhmcVfLF2",
                    "created": "2019-07-04T03:29:01.654Z",
                    "lastUpdated": "2019-07-04T03:29:01.654Z",
                    "content": {
                        "HTML": "<p>asdf</p>"
                    },
                    "ref": "text-highlight:12QDRhMd6B",
                    "author": {
                        "name": "test test",
                        "profileID": "1mAd24CXixoN99esmfLL",
                        "image": {
                            "src": "https://lh6.googleusercontent.com/-HM8tIi-Ug1Q/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rdFOSaGL3nUcMqVCxU3GmT11JttSQ/mo/photo.jpg"
                        },
                        "guest": true
                    }
                },
                "12e21r79FDBWpwhDgs86": {
                    "id": "12e21r79FDBWpwhDgs86",
                    "guid": "12e21r79FDBWpwhDgs86",
                    "created": "2019-07-04T21:26:47.828Z",
                    "lastUpdated": "2019-07-04T21:26:47.828Z",
                    "content": {
                        "HTML": "<p>ok.. updates don't work but what about new comments?</p>"
                    },
                    "ref": "text-highlight:12QDRhMd6B",
                    "author": {
                        "name": "test test",
                        "profileID": "1mAd24CXixoN99esmfLL",
                        "image": {
                            "src": "https://lh6.googleusercontent.com/-HM8tIi-Ug1Q/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rdFOSaGL3nUcMqVCxU3GmT11JttSQ/mo/photo.jpg"
                        },
                        "guest": true
                    }
                },
                "12LZuo2Z1jovsW2phPu6": {
                    "id": "12LZuo2Z1jovsW2phPu6",
                    "guid": "12LZuo2Z1jovsW2phPu6",
                    "created": "2019-07-04T21:27:20.355Z",
                    "lastUpdated": "2019-07-04T21:27:20.355Z",
                    "content": {
                        "HTML": "<p>another test.</p>"
                    },
                    "ref": "text-highlight:12QDRhMd6B",
                    "author": {
                        "name": "test test",
                        "profileID": "1mAd24CXixoN99esmfLL",
                        "image": {
                            "src": "https://lh6.googleusercontent.com/-HM8tIi-Ug1Q/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rdFOSaGL3nUcMqVCxU3GmT11JttSQ/mo/photo.jpg"
                        },
                        "guest": true
                    }
                },
                "12P5mqA4Ye3ofTyMhum5": {
                    "id": "12P5mqA4Ye3ofTyMhum5",
                    "guid": "12P5mqA4Ye3ofTyMhum5",
                    "created": "2019-07-04T21:26:12.258Z",
                    "lastUpdated": "2019-07-07T16:57:52.672Z",
                    "content": {
                        "HTML": "<p>kkkkkkdddddddaaa three</p>"
                    },
                    "ref": "text-highlight:12QDRhMd6B",
                    "author": {
                        "name": "test test",
                        "profileID": "1mAd24CXixoN99esmfLL",
                        "image": {
                            "src": "https://lh6.googleusercontent.com/-HM8tIi-Ug1Q/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rdFOSaGL3nUcMqVCxU3GmT11JttSQ/mo/photo.jpg"
                        },
                        "guest": true
                    }
                }
            },
            "questions": {},
            "flashcards": {},
            "textHighlights": {
                "12QDRhMd6B": {
                    "id": "12QDRhMd6B",
                    "guid": "12QDRhMd6B",
                    "created": "2019-06-29T16:52:46.249Z",
                    "lastUpdated": "2019-06-29T16:52:46.249Z",
                    "rects": {
                        "0": {
                            "left": 96,
                            "top": 364,
                            "right": 396,
                            "bottom": 379,
                            "width": 300,
                            "height": 15
                        }
                    },
                    "textSelections": {
                        "0": {
                            "text": "Highly available cloud storage ",
                            "rect": {
                                "left": 96,
                                "top": 364,
                                "right": 260,
                                "bottom": 379,
                                "width": 163,
                                "height": 15
                            }
                        },
                        "1": {
                            "text": "is often implemented with",
                            "rect": {
                                "left": 260,
                                "top": 364,
                                "right": 396,
                                "bottom": 379,
                                "width": 136,
                                "height": 15
                            }
                        }
                    },
                    "text": {
                        "TEXT": "Highly available cloud storage is often implemented with"
                    },
                    "images": {},
                    "notes": {},
                    "questions": {},
                    "flashcards": {},
                    "color": "red",
                    "author": {
                        "name": "test test",
                        "profileID": "1mAd24CXixoN99esmfLL",
                        "image": {
                            "src": "https://lh6.googleusercontent.com/-HM8tIi-Ug1Q/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rdFOSaGL3nUcMqVCxU3GmT11JttSQ/mo/photo.jpg"
                        },
                        "guest": true
                    }
                }
            },
            "areaHighlights": {},
            "screenshots": {},
            "thumbnails": {},
            "readingProgress": {},
            "pageInfo": {
                "num": 1
            }
        },
        "2": {
            "pagemarks": {},
            "notes": {},
            "comments": {},
            "questions": {},
            "flashcards": {},
            "textHighlights": {},
            "areaHighlights": {},
            "screenshots": {},
            "thumbnails": {},
            "readingProgress": {},
            "pageInfo": {
                "num": 2
            }
        },
        "3": {
            "pagemarks": {},
            "notes": {},
            "comments": {},
            "questions": {},
            "flashcards": {},
            "textHighlights": {},
            "areaHighlights": {},
            "screenshots": {},
            "thumbnails": {},
            "readingProgress": {},
            "pageInfo": {
                "num": 3
            }
        },
        "4": {
            "pagemarks": {},
            "notes": {},
            "comments": {},
            "questions": {},
            "flashcards": {},
            "textHighlights": {},
            "areaHighlights": {},
            "screenshots": {},
            "thumbnails": {},
            "readingProgress": {},
            "pageInfo": {
                "num": 4
            }
        },
        "5": {
            "pagemarks": {},
            "notes": {},
            "comments": {},
            "questions": {},
            "flashcards": {},
            "textHighlights": {},
            "areaHighlights": {},
            "screenshots": {},
            "thumbnails": {},
            "readingProgress": {},
            "pageInfo": {
                "num": 5
            }
        },
        "6": {
            "pagemarks": {},
            "notes": {},
            "comments": {},
            "questions": {},
            "flashcards": {},
            "textHighlights": {},
            "areaHighlights": {},
            "screenshots": {},
            "thumbnails": {},
            "readingProgress": {},
            "pageInfo": {
                "num": 6
            }
        },
        "7": {
            "pagemarks": {},
            "notes": {},
            "comments": {},
            "questions": {},
            "flashcards": {},
            "textHighlights": {},
            "areaHighlights": {},
            "screenshots": {},
            "thumbnails": {},
            "readingProgress": {},
            "pageInfo": {
                "num": 7
            }
        },
        "8": {
            "pagemarks": {},
            "notes": {},
            "comments": {},
            "questions": {},
            "flashcards": {},
            "textHighlights": {},
            "areaHighlights": {},
            "screenshots": {},
            "thumbnails": {},
            "readingProgress": {},
            "pageInfo": {
                "num": 8
            }
        },
        "9": {
            "pagemarks": {},
            "notes": {},
            "comments": {},
            "questions": {},
            "flashcards": {},
            "textHighlights": {},
            "areaHighlights": {},
            "screenshots": {},
            "thumbnails": {},
            "readingProgress": {},
            "pageInfo": {
                "num": 9
            }
        },
        "10": {
            "pagemarks": {},
            "notes": {},
            "comments": {},
            "questions": {},
            "flashcards": {},
            "textHighlights": {},
            "areaHighlights": {},
            "screenshots": {},
            "thumbnails": {},
            "readingProgress": {},
            "pageInfo": {
                "num": 10
            }
        },
        "11": {
            "pagemarks": {},
            "notes": {},
            "comments": {},
            "questions": {},
            "flashcards": {},
            "textHighlights": {},
            "areaHighlights": {},
            "screenshots": {},
            "thumbnails": {},
            "readingProgress": {},
            "pageInfo": {
                "num": 11
            }
        },
        "12": {
            "pagemarks": {},
            "notes": {},
            "comments": {},
            "questions": {},
            "flashcards": {},
            "textHighlights": {},
            "areaHighlights": {},
            "screenshots": {},
            "thumbnails": {},
            "readingProgress": {},
            "pageInfo": {
                "num": 12
            }
        },
        "13": {
            "pagemarks": {},
            "notes": {},
            "comments": {},
            "questions": {},
            "flashcards": {},
            "textHighlights": {},
            "areaHighlights": {},
            "screenshots": {},
            "thumbnails": {},
            "readingProgress": {},
            "pageInfo": {
                "num": 13
            }
        },
        "14": {
            "pagemarks": {},
            "notes": {},
            "comments": {},
            "questions": {},
            "flashcards": {},
            "textHighlights": {},
            "areaHighlights": {},
            "screenshots": {},
            "thumbnails": {},
            "readingProgress": {},
            "pageInfo": {
                "num": 14
            }
        }
    }
};

