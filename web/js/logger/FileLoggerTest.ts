import {assert} from 'chai';
import {FileLogger} from './FileLogger';
import {FilePaths} from 'polar-shared/src/util/FilePaths';
import {Files} from 'polar-shared/src/util/Files';

describe('FileLogger', function() {

    it("Basic", async function() {

        const path = FilePaths.createTempName('file-logger-test.log');
        await Files.removeAsync(path);

        const fileLogger = await FileLogger.create(path);

        assert.ok(await Files.existsAsync(path));

        fileLogger.info("Hello world");

        fileLogger.info("This is an object: ", {'hello': 'world'});
        fileLogger.info("This is a basic string: ", "basic string");

        fileLogger.error("This is an error: ", new Error("Fake error"));

        await fileLogger.sync();
        await fileLogger.close();

        const data = await Files.readFileAsync(path);

        console.log("data: ", data.toString("UTF8"));

        assert.ok(data.indexOf("[info] Hello world") !== -1);
        assert.ok(data.indexOf("[info] This is an object: { hello: 'world' }") !== -1);
        assert.ok(data.indexOf("[info] This is a basic string: basic string") !== -1);
        assert.ok(data.indexOf("[error] This is an error: \n" +
                                   "Error: Fake error\n" +
                                   "    at ") !== -1);

    });

});
