import {assert} from 'chai';
import {EmailAddressParser} from './EmailAddressParser';

describe('EmailAddressParser', function() {

    it("basic", function() {

        assert.deepEqual([], EmailAddressParser.parse(""));

        assert.deepEqual(["alice@example.com"],
                         EmailAddressParser.parse("alice@example.com"));

        assert.deepEqual(["alice+foo@example.com"],
                         EmailAddressParser.parse("alice+foo@example.com"));

        assert.deepEqual(["alice@example.com", "bob@example.com"],
                         EmailAddressParser.parse("alice@example.com, bob@example.com"));

        assert.deepEqual(["alice@example.com", "bob+test@example.com"],
                         EmailAddressParser.parse("alice@example.com; bob+test@example.com"));

    });

});
