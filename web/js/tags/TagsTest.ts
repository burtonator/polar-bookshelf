import {Tags} from './Tags';
import {assert} from 'chai';

describe('basename', function() {

    it("basename", function() {
        assert.equal(Tags.basename('linux'), 'linux');
        assert.equal(Tags.basename(''), '');
        assert.equal(Tags.basename('/foo/bar'), 'bar');
        assert.equal(Tags.basename('/foo'), 'foo');

    });

});


describe('RegExp', function() {

    it("test unicode literal", function() {

        Tags.assertValid("#deck:microsoft");

        Tags.assertValid("#hashtag");
        Tags.assertValid("#Azərbaycanca");
        Tags.assertValid("#mûǁae");
        Tags.assertValid("#Čeština");
        Tags.assertValid("#Ċaoiṁín");
        Tags.assertValid("#Caoiṁín");
        Tags.assertValid("#ta\u0301im");
        Tags.assertValid("#hag\u0303ua");
        Tags.assertValid("#caf\u00E9");
        Tags.assertValid("#\u05e2\u05d1\u05e8\u05d9\u05ea"); // "#Hebrew"
        // assertCaptureCount(3, Regex.VALID_HASHTAG,
        //                    "#\u05d0\u05b2\u05e9\u05b6\u05c1\u05e8"); // with marks
        // assertCaptureCount(3, Regex.VALID_HASHTAG,
        //                    "#\u05e2\u05b7\u05dc\u05be\u05d9\u05b0\u05d3\u05b5\u05d9"); // with maqaf 05be
        Tags.assertValid("#\u05d5\u05db\u05d5\u05f3"); // with geresh 05f3
        Tags.assertValid("#\u05de\u05f4\u05db"); // with gershayim 05f4
        // assertCaptureCount(3, Regex.VALID_HASHTAG,
        //                    "#\u0627\u0644\u0639\u0631\u0628\u064a\u0629"); // "#Arabic"
        // assertCaptureCount(3, Regex.VALID_HASHTAG,
        //                    "#\u062d\u0627\u0644\u064a\u0627\u064b"); // with mark
        // assertCaptureCount(3, Regex.VALID_HASHTAG,
        //                    "#\u064a\u0640\ufbb1\u0640\u064e\u0671"); // with pres. form
        Tags.assertValid("#ประเทศไทย");
        Tags.assertValid("#ฟรี"); // with mark
        Tags.assertValid("#日本語ハッシュタグ");

        // TODO: the twitter-text JAva library says this is valid but not the
        // JS library.
        // Tags.assertValid("＃日本語ハッシュタグ");

        assert.throws(() => Tags.assertValid("#deck::microsoft"));

        assert.throws(() => Tags.assertValid("#deck:foo:bar"));
        assert.throws(() => Tags.assertValid("#deck::foo"));

    });

    it("tags with two colons", function() {
        assert.throws(() => Tags.assertValid("#bar:cat:dog"));
    });

});

describe('folders', function() {

    it("test unicode literal", function() {

        // Tags.assertValid("/");
        Tags.assertValid("/tmp");
        Tags.assertValid("/tmp/foo");
        Tags.assertValid("/tmp/foo/CatDog");

        // TODO this SHOULD pass but it does not... I think we should support
        // spaces in tags now. even though they're not really supported in
        // other systems.
        // Tags.assertValid("/tmp/foo/Cat Dog");

        assert.throws(() => Tags.assertValid("/tmp/foo/"));
        assert.throws(() => Tags.assertValid("/"));
        assert.throws(() => Tags.assertValid("/tmp//foo"));

    });

});

describe('type tags', function() {

    it("basic functionality", function() {

        assert.equal(Tags.stripTypedLabel("#foo:bar").get(), "#foobar");
        assert.equal(Tags.stripTypedLabel("#:bar").get(), "#:bar");
        assert.equal(Tags.stripTypedLabel("#bar:").get(), "#bar:");

        assert.equal(Tags.stripTypedLabel("#foo/bar").get(), "#foobar");
        assert.equal(Tags.stripTypedLabel("#foo/bar/blah").get(), "#foobarblah");

        assert.equal(Tags.stripTypedLabel("#base:foo/bar").get(), "#basefoobar");
        assert.equal(Tags.stripTypedLabel("#base:foo/bar/blah").get(), "#basefoobarblah");
    });

    it("don't allow multiple colons", function() {
        assert.ok(! Tags.stripTypedLabel("#bar:cat:dog").isPresent());
        });

    it("don't allow multi slashes", function() {
        assert.ok(! Tags.stripTypedLabel("#bar//dog").isPresent());
        assert.ok(! Tags.stripTypedLabel("#//dog").isPresent());
        assert.ok(! Tags.stripTypedLabel("#dog//").isPresent());
        assert.ok(! Tags.stripTypedLabel("#//").isPresent());
        assert.ok(! Tags.stripTypedLabel("#bar///dog").isPresent());
        assert.ok(! Tags.stripTypedLabel("#///dog").isPresent());
        assert.ok(! Tags.stripTypedLabel("#dog///").isPresent());
        assert.ok(! Tags.stripTypedLabel("#///").isPresent());
    });

});


describe('folder tags', function() {

    it("basic functionality", function() {
        Tags.assertValid('foo/bar');
        Tags.assertValid('/foo/bar');

        Tags.assertValid('cat/dog/boy/girl');
    });


});
