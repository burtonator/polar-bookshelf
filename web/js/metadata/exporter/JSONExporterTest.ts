import {BufferWriter} from './writers/BufferWriter';
import {JSONExporter} from './JSONExporter';
import {Comments} from '../Comments';
import {AnnotationType} from 'polar-shared/src/metadata/AnnotationType';
import {assert} from 'chai';
import {assertJSON} from '../../test/Assertions';
import {TestingTime} from '../../test/TestingTime';
import {MockReadableBinaryDatastore} from "../../datastore/MockDatastore";

const datastore = new MockReadableBinaryDatastore();

describe('JSONExporter', function() {

    beforeEach(function() {
        Comments.SEQUENCE = 0;
    });

    it("basic with one item", async function() {

        TestingTime.freeze();

        const writer = new BufferWriter();

        const converter = new JSONExporter();

        await converter.init(writer, datastore);

        const comment = Comments.createTextComment("hello world", 'page:1');

        await converter.write({type: AnnotationType.COMMENT, annotation: comment} );

        await converter.close();

        const expected = {
            "items": [
                {
                    "content": {
                        "TEXT": "hello world"
                    },
                    "created": "2012-03-02T11:38:49.321Z",
                    "guid": "12exn26R8gkD2fjouKQU",
                    "id": "12exn26R8gkD2fjouKQU",
                    "lastUpdated": "2012-03-02T11:38:49.321Z",
                    "ref": "page:1"
                }
            ],
            "version": 1
        };

        assertJSON(writer.toString(), expected);

    });


    it("with two items", async function() {

        TestingTime.freeze();

        const writer = new BufferWriter();

        const converter = new JSONExporter();

        await converter.init(writer, datastore);

        const comment0 = Comments.createTextComment("hello world", 'page:1');
        await converter.write({type: AnnotationType.COMMENT, annotation: comment0} );

        const comment1 = Comments.createTextComment("hello world", 'page:1');
        await converter.write({type: AnnotationType.COMMENT, annotation: comment1} );

        await converter.close();

        const expected = {
            "items": [
                {
                    "content": {
                        "TEXT": "hello world"
                    },
                    "created": "2012-03-02T11:38:49.321Z",
                    "guid": "12exn26R8gkD2fjouKQU",
                    "id": "12exn26R8gkD2fjouKQU",
                    "lastUpdated": "2012-03-02T11:38:49.321Z",
                    "ref": "page:1"
                },
                {
                    "content": {
                        "TEXT": "hello world"
                    },
                    "created": "2012-03-02T11:38:49.321Z",
                    "guid": "1QF1kkH7VXZNYzbcDaPu",
                    "id": "1QF1kkH7VXZNYzbcDaPu",
                    "lastUpdated": "2012-03-02T11:38:49.321Z",
                    "ref": "page:1"
                }
            ],
            "version": 1
        };

        assertJSON(writer.toString(), expected);

    });


});

