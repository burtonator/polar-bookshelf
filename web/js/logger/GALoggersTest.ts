import {assert} from 'chai';
import {GALoggers} from './GALoggers';
import {assertJSON} from '../test/Assertions';

describe('GALoggers', function() {

    it("getError", function() {

        const error = new Error("asdf");

        assert.equal(error, GALoggers.getError(["asdf", error , "asdf"]));
        assert.equal(error, GALoggers.getError([error , "asdf"]));
        assert.equal(error, GALoggers.getError([error]));

        assert.isTrue(GALoggers.getError([]) === undefined);
        assert.isTrue(GALoggers.getError(["asdf"]) === undefined);

    });

    it("toEvent", function() {

        assert.isTrue(GALoggers.toEvent(undefined) === undefined);

        const error = new Error("This is my error");
        assertJSON(GALoggers.toEvent(error), {
            "action": "this-is-my-error",
            "category": "error"
        });

    });

    it("toEvent with long string", function() {

        assert.isTrue(GALoggers.toEvent(undefined) === undefined);

        const error = new Error("This is my error This is my error This is my error This is my error This is my error This is my error This is my error This is my error");
        assertJSON(GALoggers.toEvent(error), {
            "action": "this-is-my-error-this-is-my-error-this-is-my-error-this-is-my-error-this-is-my-e",
            "category": "error"
        });

    });


});
