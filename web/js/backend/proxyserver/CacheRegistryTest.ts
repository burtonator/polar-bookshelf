import {TestingTime} from '../../test/TestingTime';
import {CapturedPHZWriter} from '../../capture/CapturedPHZWriter';
import {CacheRegistry} from './CacheRegistry';
import {MockCapturedContent} from '../../capture/MockCapturedContent';
import {FilePaths} from 'polar-shared/src/util/FilePaths';

TestingTime.freeze();

describe('CacheRegistryTest', function() {

    describe('Load PHZ', function() {

        it("registerFile", async function() {

            TestingTime.freeze();

            const captured = MockCapturedContent.create();

            const path = FilePaths.tmpfile("cached-entries-factory.phz");
            const capturedPHZWriter = new CapturedPHZWriter(path);
            await capturedPHZWriter.convert(captured);

            const cacheRegistry = new CacheRegistry();

            await cacheRegistry.registerFile(path);

        });

    });

});
