import {FilePaths} from 'polar-shared/src/util/FilePaths';
import {MockCapturedContent} from './MockCapturedContent';
import {CapturedPHZWriter} from './CapturedPHZWriter';
import {TestingTime} from '../test/TestingTime';

describe('CapturedPHZWriter', function() {

    it("write out captured JSON", async function () {
        TestingTime.freeze();

        const captured = MockCapturedContent.create();

        const capturedPHZWriter = new CapturedPHZWriter(FilePaths.tmpfile("captured.phz"));
        await capturedPHZWriter.convert(captured);

    });

});
