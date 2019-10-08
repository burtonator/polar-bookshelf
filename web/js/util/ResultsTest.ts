import {assert} from 'chai';
import {Results} from './Results';
import {Logger} from 'polar-shared/src/logger/Logger';
import {assertJSON} from '../test/Assertions';

const log = Logger.create();
describe('Results', function() {

    function hello() {
        return "hello";
    }

    function helloAny(): any {
        return "hello";
    }

    it("Execute basic", function () {

        assert.equal((Results.execute(() => hello())).get(), 'hello');

    });

    it("Execute any", function () {

        assert.equal((Results.execute(() => helloAny())).get(), 'hello');

    });

    it("Serializing an error", async function () {

        let error = new Error("test");

        let result = Results.createError(error);

        assert.equal(result.value, undefined);
        assert.notEqual(result.err, undefined);

        log.error("this is a test error", result.err);

        result = JSON.parse(JSON.stringify(result));

        assert.notEqual(result.err, undefined);
        assert.notEqual(result.err!.stack, undefined);

        let expected = {
            err: {
                name: "Error",
                message: "test",
                stack: "..."
            }
        };

        let canonicalizedResult = Object.assign({}, result);

        canonicalizedResult.err!.stack = "...";

        assertJSON(canonicalizedResult, expected)

        result = Results.create(result);

        console.log("============ after create");
        console.log(result);
        console.log("============ ")

        log.error("This is after re-creation: ", result.err);

    });


});
