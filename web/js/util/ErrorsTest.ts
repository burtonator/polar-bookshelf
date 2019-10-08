import {assert} from 'chai';
import {EmailAddressParser} from './EmailAddressParser';
import {Errors} from './Errors';
import {Simulate} from 'react-dom/test-utils';
import compositionStart = Simulate.compositionStart;

describe('Errors', function() {

    it("basic", function() {

        try {

            Errors.rethrow(new Error("root cause: "), "rethrow cause: ");

            assert.ok(false, "Should not have reached here");

        } catch (e) {
            assert.equal(e.msg, "rethrow cause: : root cause: ");
        }

    });

});
