import {TestingTime} from '../test/TestingTime';
import {assert} from 'chai';
import {FilePaths} from 'polar-shared/src/util/FilePaths';
import {MockPHZWriter} from './MockPHZWriter';
import * as fs from 'fs';

TestingTime.freeze();

describe('MockPHZWriter', function() {

    it("Write basic file", async function () {

        const path = FilePaths.createTempName("test-mock-phz-writer.phz");
        await MockPHZWriter.write(path);
        assert.equal(fs.existsSync(path), true);
        console.log("Wrote file: " + path);

    });

});

