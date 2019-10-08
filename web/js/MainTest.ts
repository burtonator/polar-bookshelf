// all our unit tests...

import {assert, expect} from 'chai';
import chai from 'chai';
import {assertJSON} from './test/Assertions';
import {DocMetas} from './metadata/DocMetas';
import {DocMeta} from './metadata/DocMeta';
import { createSiblingTuples } from 'polar-shared/src/util/Functions';
import {Delegator, getBoundingClientRectFromBCRs} from './utils';
import {TextHighlightRows} from "./highlights/text/controller/TextHighlightRows";


//import * as utils from "./utils.js";

//chai.config.truncateThreshold = 0;
//chai.use(chaiDiff);

// stable reference date for all tests.
var date = new Date(Date.parse("2018-05-30T02:47:44.411Z"));

describe('Test computeRectForRow for highlighting text...', function() {

    it('Test with 1 entries', function () {

        var rectElements = [
            {
                rect: {
                    "left": 0,
                    "top": 4,
                    "width": 721,
                    "height": 18,
                    "right": 721,
                    "bottom": 22
                },
                element: null
            }
        ];

        var expected = { left: 0, top: 4, width: 721, height: 18, right: 721, bottom: 22 };

        assert.deepEqual(TextHighlightRows.computeRectForRow(rectElements), expected);

    });

    it('Test with 2 entries', function () {

        var rects = [
            {
                rect: {
                    "left": 0,
                    "top": 4,
                    "width": 721,
                    "height": 18,
                    "right": 721,
                    "bottom": 22
                },
                element: null
            },
            {
                rect: {
                    "left": 0,
                    "top": 4,
                    "width": 721,
                    "height": 18,
                    "right": 800,
                    "bottom": 50
                },
                element: null
            }

        ];

        var expected = { left: 0, top: 4, width: 800, height: 46, right: 800, bottom: 50 };

        assert.deepEqual(TextHighlightRows.computeRectForRow(rects), expected);

    });

});

describe('Test computeRows for highlighting text...', function() {

    it('Test with no entries', function () {

        assert.deepEqual([], []);


    });

    it('Test with 1 entries', function () {

        var rects = [
            {
                rect: {
                    "left": 0,
                    "top": 4,
                    "width": 721,
                    "height": 18,
                    "right": 721,
                    "bottom": 22
                },
                element: null
            }
        ];

        var expected = [
            [ { rect: {left: 0, top: 4, width: 721, height: 18, right: 721, bottom: 22 }, element: null} ]
        ];

        assert.deepEqual(TextHighlightRows.computeRows(rects), expected);


    });

    it('Test with 2 entries and two rows', function () {

        var rectElements = [
            {
                rect: {
                    "left": 0,
                    "top": 4,
                    "width": 200,
                    "height": 20,
                    "right": 200,
                    "bottom": 24
                },
                element: null
            },
            {
                rect: {
                    "left": 200,
                    "top": 4,
                    "width": 200,
                    "height": 20,
                    "right": 400,
                    "bottom": 24
                },
                element: null
            }
        ];

        var expected = [
            [
                { rect: { left: 0, top: 4, width: 200, height: 20, right: 200, bottom: 24}, element: null },
                { rect: { left: 200, top: 4, width: 200, height: 20, right: 400, bottom: 24}, element: null }
            ]
        ];

        assert.deepEqual(TextHighlightRows.computeRows(rectElements), expected);

    });



})


describe('Testing for gaps in contiguous rects', function() {

    it('Test with no entries', function () {

        // FIXME: break this out into a real test...

        var rects = [
            {
                rect: {
                    "left": 0,
                    "top": 4,
                    "width": 721,
                    "height": 18,
                    "right": 721,
                    "bottom": 22
                },
                element: null
            },
            {
                rect: {
                    "left": 0,
                    "top": 4,
                    "width": 721,
                    "height": 18,
                    "right": 721,
                    "bottom": 22
                },
                element: null
            },
            {
                rect: {
                    "left": 0,
                    "top": 4,
                    "width": 721,
                    "height": 18,
                    "right": 721,
                    "bottom": 22
                },
                element: null
            },
            {
                rect: {
                    "left": 0,
                    "top": 4,
                    "width": 721,
                    "height": 18,
                    "right": 721,
                    "bottom": 22
                },
                element: null

            },
            {
                rect: {
                    "left": 0,
                    "top": 4,
                    "width": 297,
                    "height": 18,
                    "right": 297,
                    "bottom": 22
                },
                element: null
            }
        ];

        assert.deepEqual(TextHighlightRows.computeContiguousRects([]), []);

    });

})

describe('Testing computeContiguousRects.', function() {

    it('Test with no entries', function () {
        assert.deepEqual(TextHighlightRows.computeContiguousRects([]), []);
    });

    xit('Test with one entry', function () {

        let rects = [
            { rect: {top: 10, left: 10, bottom: 50, right: 50}, element: null }
        ];

        let expected = [
            {
                "rect": {
                    "left": 10,
                    "top": 10,
                    "right": 50,
                    "bottom": 50,
                    "width": 40,
                    "height": 40
                },
                "rectElements": [
                    {
                        "rect": {
                            "top": 10,
                            "left": 10,
                            "bottom": 50,
                            "right": 50
                        },
                        "element": null
                    }
                ]
            }
        ];

        let actual = TextHighlightRows.computeContiguousRects(rects);

        assertJSON(actual, expected);

    });

    xit('Test with two entries', function () {

        var boundingClientRects = [
            {rect: {top: 10, left: 10, bottom: 20, right: 50}, element: null },
            {rect: {top: 50, left: 10, bottom: 70, right: 50}, element: null }
        ];

        var expected = [
            {
                "rect": {
                    "left": 10,
                    "top": 10,
                    "right": 50,
                    "bottom": 50,
                    "width": 40,
                    "height": 40
                },
                "rectElements": [
                    {
                        "rect": {
                            "top": 10,
                            "left": 10,
                            "bottom": 20,
                            "right": 50
                        },
                        "element": null
                    }
                ]
            },
            {
                "rect": {
                    "left": 10,
                    "top": 50,
                    "right": 50,
                    "bottom": 70,
                    "width": 40,
                    "height": 20
                },
                "rectElements": [
                    {
                        "rect": {
                            "top": 50,
                            "left": 10,
                            "bottom": 70,
                            "right": 50
                        },
                        "element": null
                    }
                ]
            }
        ];

        assertJSON(TextHighlightRows.computeContiguousRects(boundingClientRects), expected);

    });

});

describe('Testing createSiblingTupples.', function() {

    it('Test with no entries', function() {

        assert.deepEqual( createSiblingTuples([]), []);

    });

    it('Test with 1 entry', function() {

        assert.deepEqual( createSiblingTuples([1]), [ { curr: 1, prev: null, next: null } ]);

    });

    it('Test with 2 entries', function() {

        assert.deepEqual( createSiblingTuples([1,2]),
                          [
                              { curr: 1, prev: null, next: 2 },
                              { curr: 2, prev: 1, next: null }
                          ]);

    });

    it('Test with 3 entries', function() {

        assert.deepEqual( createSiblingTuples([1,2,3]),
            [
                { curr: 1, prev: null, next: 2 },
                { curr: 2, prev: 1, next: 3 },
                { curr: 3, prev: 2, next: null }
            ]);

    });

    it('Test with 4 entries', function() {

        assert.deepEqual( createSiblingTuples([1,2,3,4]),
            [
                { curr: 1, prev: null, next: 2 },
                { curr: 2, prev: 1, next: 3 },
                { curr: 3, prev: 2, next: 4 },
                { curr: 4, prev: 3, next: null }
            ]);

    });


});

describe('Testing bounding client rect utils.', function() {

    it('Test with one element', function() {

        var boundingClientRects = [
            {top: 10, left: 10, bottom: 50, right: 50}
        ];

        var cbr = getBoundingClientRectFromBCRs(boundingClientRects);

        assert.deepEqual(cbr, { left: 10, top: 10, bottom: 50, right: 50 });

    });

    it('Test with four elements', function() {

        var boundingClientRects = [
            {top: 10, left: 10, bottom: 50, right: 50},
            {top: 20, left: 5,  bottom: 50, right: 50},
            {top: 30, left: 10, bottom: 55, right: 50},
            {top: 40, left: 10, bottom: 50, right: 55}
        ];

        var cbr = getBoundingClientRectFromBCRs(boundingClientRects);

        assert.deepEqual(cbr, { left: 5, top: 10, bottom: 55, right: 55 });

    });

});


describe('Testing Delegates', function() {

    it('Test basic functionality', function() {

        class MyDelegate {

            testArg0: string | null = null;
            testArg1: string | null = null;


            constructor() {
                this.testArg0 = null;
                this.testArg1 = null;
            }

            testFunction(testArg0: string, testArg1: string) {
                this.testArg0 = testArg0;
                this.testArg1 = testArg1;
            }

        }

        var delegate0 = new MyDelegate();
        var delegate1 = new MyDelegate();

        var delegator = new Delegator([delegate0, delegate1]);

        delegator.apply("testFunction", "hello", "world");

        assert.equal(delegate0.testArg0, "hello");
        assert.equal(delegate0.testArg1, "world");

        assert.equal(delegate1.testArg0, "hello");
        assert.equal(delegate1.testArg1, "world");

    });

});

describe('Testing progress computation', function() {

    // xit('Compute basic progress', function() {
    //
    //     let docMeta = DocMetas.createWithinInitialPagemarks("0x0000", 10);
    //
    //     let webView = new WebView();
    //     let progress = webView.computeProgress(docMeta);
    //
    //     assert.equal(progress, 0.3);
    //
    // });
    //
    // xit('Compute basic progress at 100 percent', function() {
    //
    //     let docMeta = DocMetas.createWithinInitialPagemarks("0x0000", 3);
    //
    //     let webView = new WebView();
    //     let progress = webView.computeProgress(docMeta);
    //
    //     assert.equal(progress, 1.0);
    //
    // });

});

describe('testing data serialization', function() {

    xit('Test basic serialization ... both ways.', function() {
        // let fingerprint = "0xdecafbad";
        //
        // let docMeta = DocMetas.create(fingerprint, 2);
        //
        // let serialized = MetadataSerializer.serialize(docMeta, "  ");
        //
        // assertJSON(serialized, "{\n" +
        //                        "  \"docInfo\": {\n" +
        //                        "    \"title\": null,\n" +
        //                        "    \"url\": null,\n" +
        //                        "    \"nrPages\": 2,\n" +
        //                        "    \"fingerprint\": \"0xdecafbad\"\n" +
        //                        "  },\n" +
        //                        "  \"pageMetas\": {\n" +
        //                        "    \"1\": {\n" +
        //                        "      \"pageInfo\": {\n" +
        //                        "        \"num\": 1\n" +
        //                        "      },\n" +
        //                        "      \"pagemarks\": {}\n" +
        //                        "    },\n" +
        //                        "    \"2\": {\n" +
        //                        "      \"pageInfo\": {\n" +
        //                        "        \"num\": 2\n" +
        //                        "      },\n" +
        //                        "      \"pagemarks\": {}\n" +
        //                        "    }\n" +
        //                        "  },\n" +
        //                        "  \"version\": 1\n" +
        //                        "}");
        //
        // let docMetaDeserialized = MetadataSerializer.deserialize(new DocMeta(), serialized);
        //
        // expect(docMetaDeserialized).to.deep.equal(docMeta);


    });

});

describe('testing model interaction', function() {


    // it('Test compute initial .', async function() {
    //
    //     var clock = new SyntheticClock();
    //     var datastore = new MemoryDatastore();
    //     var model = new Model(datastore, clock);
    //     var view = new MockView(model);
    //
    //     let fingerprint = "fake-fingerprint";
    //
    //     var docMeta = await model.documentLoaded(fingerprint, 1);
    //
    //     assert.equal(model.computeInitialPagemarkPageNumbers(docMeta, 1),
    // []);  });


});

// assert.deepJSON = function(actual,expected) {
//
//     // first convert both to JSON if necessary.
//     actual = toJSON(actual);
//     expected = toJSON(expected);
//
//     if ( actual !== expected) {
//         console.error("The following content was not expected: ");
//         console.error(actual);
//     }
//
//     //assert.equal(actual,expected);
//
//     expect(expected).not.differentFrom(actual);
//
// }
//
// function toJSON(obj) {
//
//     if(typeof obj === "string") {
//         return obj;
//     }
//
//     return JSON.stringify(obj, null, "  ");
//
// }
