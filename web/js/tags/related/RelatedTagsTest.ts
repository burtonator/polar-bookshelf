import {RelatedTags} from './RelatedTags';
import {assertJSON} from '../../test/Assertions';
import {assert} from 'chai';

describe('RelatedTags', function() {

    const getTagDocsIndex = (relatedTags: RelatedTags) => {
        return (<any> relatedTags).tagDocsIndex;
    };

    it("basic", async function() {

        const relatedTags = new RelatedTags();

        relatedTags.update('0x01', 'set', 'linux');
        relatedTags.update('0x01', 'set', 'microsoft');

        relatedTags.update('0x02', 'set', 'linux');
        relatedTags.update('0x02', 'set', 'google');

        relatedTags.update('0x03', 'set', 'linux');
        relatedTags.update('0x03', 'set', 'microsoft');

        relatedTags.update('0x04', 'set', 'linux');
        relatedTags.update('0x04', 'set', 'microsoft');

        relatedTags.update('0x05', 'set', 'linux');
        relatedTags.update('0x05', 'set', 'google');

        const tagMetaIndex = getTagDocsIndex(relatedTags);

        assert.isDefined(tagMetaIndex);

        assertJSON(tagMetaIndex, {
               "linux": {
                   "tag": "linux",
                   "docs": [
                       "0x01",
                       "0x02",
                       "0x03",
                       "0x04",
                       "0x05"
                   ]
               },
               "microsoft": {
                   "tag": "microsoft",
                   "docs": [
                       "0x01",
                       "0x03",
                       "0x04"
                   ]
               },
               "google": {
                   "tag": "google",
                   "docs": [
                       "0x02",
                       "0x05"
                   ]
               }
           }, undefined, true);

        const tagHits = relatedTags.compute(['linux']);

        assertJSON(tagHits, [
               {
                   "tag": "microsoft",
                   "hits": 3
               },
               {
                   "tag": "google",
                   "hits": 2
               }
           ], undefined, true);

    });

});
