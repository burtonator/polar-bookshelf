import {assert} from 'chai';
import {assertJSON} from './test/Assertions';
import {Delegator, getBoundingClientRectFromBCRs} from './utils';
import { Tuples } from 'polar-shared/src/util/Tuples';

// stable reference date for all tests.
var date = new Date(Date.parse("2018-05-30T02:47:44.411Z"));

describe('Test computeRows for highlighting text...', function() {

    it('Test with no entries', function () {

        assert.deepEqual([], []);


    });




})


describe('Testing createSiblingTuples.', function() {

    it('Test with no entries', function() {

        assert.deepEqual( Tuples.createSiblings([]), []);

    });

    it('Test with 1 entry', function() {

        assert.deepEqual( Tuples.createSiblings([1]), [
            { idx: 0, curr: 1, prev: undefined, next: undefined }
        ]);

    });

    it('Test with 2 entries', function() {

        assert.deepEqual( Tuples.createSiblings([1,2]),
                          [
                              { idx: 0, curr: 1, prev: undefined, next: 2 },
                              { idx: 1, curr: 2, prev: 1, next: undefined }
                          ]);

    });

    it('Test with 3 entries', function() {

        assert.deepEqual( Tuples.createSiblings([1,2,3]),
            [
                { idx: 0, curr: 1, prev: undefined, next: 2 },
                { idx: 1, curr: 2, prev: 1, next: 3 },
                { idx: 2, curr: 3, prev: 2, next: undefined }
            ]);

    });

    it('Test with 4 entries', function() {

        assert.deepEqual( Tuples.createSiblings([1,2,3,4]),
            [
                { idx: 0, curr: 1, prev: undefined, next: 2 },
                { idx: 1, curr: 2, prev: 1, next: 3 },
                { idx: 2, curr: 3, prev: 2, next: 4 },
                { idx: 3, curr: 4, prev: 3, next: undefined }
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
