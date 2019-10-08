import {assert} from 'chai';
import {Tags} from './Tags';
import {TagMatcherFactory} from './TagMatcher';


function createTags(...tags: string[]) {
    return tags.map(current => Tags.create(current));
}

function runMatcher(queryTagStrs: string[], docTagsStrs: string[]) {

    const queryTags = createTags(...queryTagStrs);
    const docTags = createTags(...docTagsStrs);

    const tagMatcherFactory = new TagMatcherFactory(queryTags);

    const tagMatcher = tagMatcherFactory.create(docTags);

    return tagMatcher.matches();

}

describe('TagMatcher', function() {

    it("basic matching folder", function() {

        assert.equal(runMatcher(['/foo'], ['/foo/bar']), true);

    });

    it("basic matching tag", function() {

        assert.equal(runMatcher(['linux'], ['linux']), true);

    });

    it("folder and tags", function() {

        assert.equal(runMatcher(['/foo', 'linux'], ['/foo/bar', 'linux']), true);

    });

});
