import {assert} from 'chai';
import {Decks} from './Decks';

describe('Decks', function() {

    it("basic", async function() {
        assert.equal(Decks.toSubDeck("foo/bar"), "foo::bar");
        assert.equal(Decks.toSubDeck("foo"), "foo");
    });

});
