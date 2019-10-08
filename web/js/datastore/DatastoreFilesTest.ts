import {assert} from "chai";
import {DiskDatastore} from './DiskDatastore';
import {DatastoreFiles} from "./DatastoreFiles";

describe('DastastoreFiles', function() {

    it("isValidFileName", async function() {

        assert.ok(DatastoreFiles.isValidFileName('test.jpg'));
        assert.ok(DatastoreFiles.isValidFileName('test.html'));
        assert.ok(DatastoreFiles.isValidFileName('abc124ABC.txt'));
        assert.ok(DatastoreFiles.isValidFileName('abc124ABC'));

        // assert.ok(! DatastoreFiles.isValidFileName('test this.jpg'));
        assert.ok(! DatastoreFiles.isValidFileName('testthis.jpggg'));

    });



    it("sanitizeFilename", async function() {
        assert.equal(DatastoreFiles.sanitizeFileName('asdf/ \\ : * ? " < > |asdf'), 'asdf_ _ _ _ _ _ _ _ _asdf');

        assert.equal(DatastoreFiles.isSanitizedFileName('asdf/ \\ : * ? " < > |asdf'), false);
        assert.equal(DatastoreFiles.isSanitizedFileName('asdf_ _ _ _ _ _ _ _ _asdf'), true);

    });

});
