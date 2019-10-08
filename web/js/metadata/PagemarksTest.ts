import {assertJSON} from '../test/Assertions';
import {Pagemarks} from "./Pagemarks";
import {DocMetas} from "./DocMetas";
import {TestingTime} from "../test/TestingTime";
import {assert} from 'chai';
import {DocMeta} from './DocMeta';
import {ISODateTimeStrings} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {Objects} from '../util/Objects';
import {ReadingProgresses} from './ReadingProgresses';
import {PagemarkMode} from 'polar-shared/src/metadata/PagemarkMode';
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";


function reset() {
    TestingTime.freeze();
    Pagemarks.sequences.id = 0;
    Pagemarks.sequences.batch = 0;
    ReadingProgresses.sequences.id = 0;
}

describe('Pagemarks', function() {

    describe('updatePagemarksForRange', function() {

        beforeEach(function() {
            reset();
        });

        it("less than zero", function() {

            // we had a test that was breaking when less than one

            const docMeta = DocMetas.create('0x0001', 1);

            const pageMeta = DocMetas.getPageMeta(docMeta, 1);

            assertJSON(pageMeta.readingProgress, {});

            Pagemarks.updatePagemarksForRange(docMeta, 1, 0.999);

            const expected = [
                {
                    "id": "1s2gw2Mkwb",
                    "guid": "1s2gw2Mkwb",
                    "created": "2012-03-02T11:38:49.321Z",
                    "lastUpdated": "2012-03-02T11:38:49.321Z",
                    "type": "SINGLE_COLUMN",
                    "percentage": 0.999,
                    "column": 0,
                    "rect": {
                        "left": 0,
                        "top": 0,
                        "width": 100,
                        "height": 0.999
                    },
                    "batch": "1Y9CcEHSxc",
                    "mode": "READ",
                    "notes": {}
                }
            ];

            assertJSON(Object.values(pageMeta.pagemarks), expected);

            assertJSON(pageMeta.readingProgress, {
                "1AS9DE87jw": {
                    "created": "2012-03-02T11:38:49.321Z",
                    "id": "1AS9DE87jw",
                    "progress": 0.999,
                    "progressByMode": {
                        "READ": 0.999
                    }
                }
            });

        });

        it("for one page", function() {

            const docMeta = DocMetas.create('0x0001', 1);

            const pageMeta = DocMetas.getPageMeta(docMeta, 1);

            assertJSON(pageMeta.readingProgress, {});

            Pagemarks.updatePagemarksForRange(docMeta, 1);

            const expected = [
                {
                    "id": "1s2gw2Mkwb",
                    "guid": "1s2gw2Mkwb",
                    "created": "2012-03-02T11:38:49.321Z",
                    "lastUpdated": "2012-03-02T11:38:49.321Z",
                    "type": "SINGLE_COLUMN",
                    "percentage": 100,
                    "column": 0,
                    "rect": {
                        "left": 0,
                        "top": 0,
                        "width": 100,
                        "height": 100
                    },
                    "batch": "1Y9CcEHSxc",
                    "mode": "READ",
                    "notes": {}
                }
            ];

            assertJSON(Object.values(pageMeta.pagemarks), expected);

            assertJSON(pageMeta.readingProgress, {
                "1AS9DE87jw": {
                    "created": "2012-03-02T11:38:49.321Z",
                    "id": "1AS9DE87jw",
                    "progress": 100,
                    "progressByMode": {
                        "READ": 100,
                    }
                }
            });

        });

        it("for two pages", function() {

            const docMeta = DocMetas.create('0x0001', 2);

            Pagemarks.updatePagemarksForRange(docMeta, 2);

            const pagemark1 = [
                {
                    "id": "1s2gw2Mkwb",
                    "guid": "1s2gw2Mkwb",
                    "created": "2012-03-02T11:38:49.321Z",
                    "lastUpdated": "2012-03-02T11:38:49.321Z",
                    "type": "SINGLE_COLUMN",
                    "percentage": 100,
                    "column": 0,
                    "rect": {
                        "left": 0,
                        "top": 0,
                        "width": 100,
                        "height": 100
                    },
                    "batch": "1Y9CcEHSxc",
                    "mode": "READ",
                    "notes": {}
                }
            ];

            const pagemark2 = [
                    {
                        "id": "126nS8PMqF",
                        "guid": "126nS8PMqF",
                        "created": "2012-03-02T11:38:49.321Z",
                        "lastUpdated": "2012-03-02T11:38:49.321Z",
                        "type": "SINGLE_COLUMN",
                        "percentage": 100,
                        "column": 0,
                        "rect": {
                            "left": 0,
                            "top": 0,
                            "width": 100,
                            "height": 100
                        },
                        "batch": "1Y9CcEHSxc",
                        "mode": "READ",
                        "notes": {}
                    }
                ]
            ;


            assertJSON(Object.values(DocMetas.getPageMeta(docMeta, 1).pagemarks), pagemark1);
            assertJSON(Object.values(DocMetas.getPageMeta(docMeta, 2).pagemarks), pagemark2);

        });


        it("for existing", function() {

            const docMeta = DocMetas.create('0x0001', 10);

            Pagemarks.updatePagemark(docMeta, 3, Pagemarks.create({percentage: 100}));

            Pagemarks.updatePagemarksForRange(docMeta, 4);

            const assertPagemark = (pageNum: number) => {

                const pagemarks = Object.values(DocMetas.getPageMeta(docMeta, pageNum).pagemarks);

                assert.equal(pagemarks.length, 1);

                assert.equal(pagemarks[0].percentage, 100);
            };


            assertPagemark(3);
            assertPagemark(4);

        });

        it("for existing large range", function() {

            const docMeta = DocMetas.create('0x0001', 10);

            Pagemarks.updatePagemark(docMeta, 3, Pagemarks.create({percentage: 100}));

            Pagemarks.updatePagemarksForRange(docMeta, 8);

            assertPagemark(docMeta, 3, "1Y9CcEHSxc");

            assertPagemark(docMeta, 4, "1yNbsiPseh");
            assertPagemark(docMeta, 5, "1yNbsiPseh");
            assertPagemark(docMeta, 6, "1yNbsiPseh");
            assertPagemark(docMeta, 7, "1yNbsiPseh");
            assertPagemark(docMeta, 8, "1yNbsiPseh");

        });


        it("for fractional range", function() {

            const docMeta = DocMetas.create('0x0001', 10);

            Pagemarks.updatePagemark(docMeta, 3, Pagemarks.create({percentage: 50}));

            Pagemarks.updatePagemarksForRange(docMeta, 4);

            const pagemarks = Object.values(DocMetas.getPageMeta(docMeta, 3).pagemarks);

            assert.equal(pagemarks.length, 2);

            assert.equal(pagemarks[0].percentage, 50);
            assert.equal(pagemarks[1].percentage, 50);

            assertPagemark(docMeta, 4, "1yNbsiPseh");

        });

        it("Delete all within batch", function() {

            const docMeta = DocMetas.create('0x0001', 10);

            Pagemarks.updatePagemarksForRange(docMeta, 8);

            const pageMeta = DocMetas.getPageMeta(docMeta, 8);

            const pagemarks = Object.values(pageMeta.pagemarks);

            assert.equal(pagemarks.length, 1);

            assert.equal(Object.values(DocMetas.getPageMeta(docMeta, 1).pagemarks).length, 1);

            Pagemarks.deletePagemark(docMeta, 8, pagemarks[0].id);

            assert.equal(Object.values(DocMetas.getPageMeta(docMeta, 1).pagemarks).length, 0);

        });

    });

    describe("reading overview", function() {

        beforeEach(function() {
            reset();
        });

        it("basic over multiple pages", function() {

            const docMeta = DocMetas.create('0x0001', 10);
            Pagemarks.updatePagemarksForRange(docMeta, 2);

            assertJSON(docMeta.docInfo.readingPerDay, {
                "2012-03-02": 2
            });

        });


        it("basic over multiple days and pages", function() {

            const docMeta = DocMetas.create('0x0001', 10);

            Pagemarks.updatePagemarksForRange(docMeta, 1);

            TestingTime.forward(24 * 60 * 60 * 1000);
            assert.equal(ISODateTimeStrings.create(), "2012-03-03T11:38:49.321Z");
            Pagemarks.updatePagemarksForRange(docMeta, 2);

            TestingTime.forward(24 * 60 * 60 * 1000);
            assert.equal(ISODateTimeStrings.create(), "2012-03-04T11:38:49.321Z");
            Pagemarks.updatePagemarksForRange(docMeta, 3);

            assertJSON(docMeta.docInfo.readingPerDay, {
                "2012-03-02": 1,
                "2012-03-03": 1,
                "2012-03-04": 1
            });

        });


        it("create range over batch then set the mode to 'previously read'", function() {

            const docMeta = DocMetas.create('0x0001', 10);

            Pagemarks.updatePagemarksForRange(docMeta, 5);

            assert.equal(Object.values(DocMetas.getPageMeta(docMeta, 1).pagemarks).length, 1);
            assert.equal(Object.values(DocMetas.getPageMeta(docMeta, 5).pagemarks).length, 1);

            const pagemark = Object.values(DocMetas.getPageMeta(docMeta, 5).pagemarks)[0];

            Pagemarks.replacePagemark(docMeta, {batch: pagemark.batch}, {mode: PagemarkMode.PRE_READ});

            assertJSON(DocMetas.getPageMeta(docMeta, 1).pagemarks, {
                "1s2gw2Mkwb": {
                    "batch": "1Y9CcEHSxc",
                    "column": 0,
                    "created": "2012-03-02T11:38:49.321Z",
                    "guid": "1s2gw2Mkwb",
                    "id": "1s2gw2Mkwb",
                    "lastUpdated": "2012-03-02T11:38:49.321Z",
                    "mode": "PRE_READ",
                    "notes": {},
                    "percentage": 100,
                    "rect": {
                        "height": 100,
                        "left": 0,
                        "top": 0,
                        "width": 100
                    },
                    "type": "SINGLE_COLUMN"
                }
            });

            assertJSON(DocMetas.getPageMeta(docMeta, 5).pagemarks, {
                "12CDjpvoCY": {
                    "batch": "1Y9CcEHSxc",
                    "column": 0,
                    "created": "2012-03-02T11:38:49.321Z",
                    "guid": "12CDjpvoCY",
                    "id": "12CDjpvoCY",
                    "lastUpdated": "2012-03-02T11:38:49.321Z",
                    "mode": "PRE_READ",
                    "notes": {},
                    "percentage": 100,
                    "rect": {
                        "height": 100,
                        "left": 0,
                        "top": 0,
                        "width": 100
                    },
                    "type": "SINGLE_COLUMN"
                }
            });

        });


        it("drop back in progress on the same day", function() {

            const docMeta = DocMetas.create('0x0001', 1);

            Pagemarks.updatePagemark(docMeta, 1, Pagemarks.create({percentage: 80}));

            assertJSON(docMeta.docInfo.readingPerDay, {
                "2012-03-02": 0.8
            });

            Pagemarks.deletePagemark(docMeta, 1);
            Pagemarks.updatePagemark(docMeta, 1, Pagemarks.create({percentage: 20}));

            assertJSON(docMeta.docInfo.readingPerDay, {
                "2012-03-02": 0.2
            });

        });


        it("legacy doc that doesn't have reading history", function() {

            const docMeta = DocMetas.create('0x0001', 1);

            const pageMeta = DocMetas.getPageMeta(docMeta, 1);

            assert.equal(Object.values(pageMeta.pagemarks).length, 0);

            Pagemarks.updatePagemark(docMeta, 1, Pagemarks.create({percentage: 80}));

            assertJSON(docMeta.docInfo.readingPerDay, {
                "2012-03-02": 0.8
            });

            assertJSON(pageMeta.readingProgress, {
                "1AS9DE87jw": {
                    "created": "2012-03-02T11:38:49.321Z",
                    "id": "1AS9DE87jw",
                    "progress": 80,
                    "progressByMode": {
                        "READ": 80
                    }
                }
            });

            // now that it has the pagemark clear out the existing data...

            Objects.clear(docMeta.docInfo.readingPerDay);
            Objects.clear(pageMeta.readingProgress);

            TestingTime.forward('1w');

            Pagemarks.updatePagemark(docMeta, 1, Pagemarks.create({percentage: 10}));

            assertJSON(pageMeta.pagemarks, {
                "12mskuuTzp": {
                    "batch": "1SDFF4T2Rj",
                    "column": 0,
                    "created": "2012-03-09T11:38:49.321Z",
                    "guid": "12mskuuTzp",
                    "id": "12mskuuTzp",
                    "lastUpdated": "2012-03-09T11:38:49.321Z",
                    "mode": "READ",
                    "notes": {},
                    "percentage": 10,
                    "rect": {
                        "height": 10,
                        "left": 0,
                        "top": 0,
                        "width": 100
                    },
                    "type": "SINGLE_COLUMN"
                },
                "1s2gw2Mkwb": {
                    "batch": "1Y9CcEHSxc",
                    "column": 0,
                    "created": "2012-03-02T11:38:49.321Z",
                    "guid": "1s2gw2Mkwb",
                    "id": "1s2gw2Mkwb",
                    "lastUpdated": "2012-03-02T11:38:49.321Z",
                    "mode": "READ",
                    "notes": {},
                    "percentage": 80,
                    "rect": {
                        "height": 80,
                        "left": 0,
                        "top": 0,
                        "width": 100
                    },
                    "type": "SINGLE_COLUMN"
                }
            });

            assertJSON(pageMeta.readingProgress, {
                   "123r9JKcE5": {
                       "created": "2012-03-09T11:38:49.321Z",
                       "id": "123r9JKcE5",
                       "progress": 90,
                       "progressByMode": {
                           "READ": 90
                       }
                   },
                   "1SfHn5ScW2": {
                       "created": "2012-03-09T11:38:49.321Z",
                       "id": "1SfHn5ScW2",
                       "preExisting": true,
                       "progress": 80,
                       "progressByMode": {
                           "READ": 80
                       }
                   }
               }
            );

            assertJSON(docMeta.docInfo.readingPerDay, {
                "2012-03-09": 0.1
            });

        });

        it("fake HTML page", function() {

            const docMeta = DocMetas.create('0x0001', 1);

            DocMetas.getPageMeta(docMeta, 1).pageInfo.dimensions = {
                width: 850,
                height: 2500
            };

            const pagemark = Pagemarks.create({percentage: 80});
            Pagemarks.updatePagemark(docMeta, 1, pagemark);

            assertJSON(docMeta.docInfo.readingPerDay, {
                "2012-03-02": 1.82
            });

        });

        it("fake HTML page with deltas across days..", function() {

            const docMeta = DocMetas.create('0x0001', 1);

            DocMetas.getPageMeta(docMeta, 1).pageInfo.dimensions = {
                width: 850,
                height: 2500
            };

            Pagemarks.updatePagemark(docMeta, 1, Pagemarks.create({percentage: 40}));

            TestingTime.forward('1d');

            Pagemarks.updatePagemark(docMeta, 1, Pagemarks.create({percentage: 40}));

            assertJSON(docMeta.docInfo.readingPerDay, {
                "2012-03-02": 0.91,
                "2012-03-03": 0.91
            });

        });


    });

});


const assertPagemark = (docMeta: IDocMeta, pageNum: number, batch: string) => {

    const pagemarks = Object.values(DocMetas.getPageMeta(docMeta, pageNum).pagemarks);

    assert.equal(pagemarks.length, 1);
    const pagemark = pagemarks[0];
    assert.equal(pagemark.percentage, 100);

    assert.equal(pagemark.batch, batch);

};
