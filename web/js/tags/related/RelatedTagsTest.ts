import {RelatedTagsManager} from './RelatedTagsManager';
import {assertJSON} from '../../test/Assertions';
import {assert} from 'chai';
import {Tags} from "polar-shared/src/tags/Tags";

describe('RelatedTags', function() {

    const getTagDocsIndex = (relatedTags: RelatedTagsManager) => {
        return (<any> relatedTags).tagDocsIndex;
    };

    it("basic", async function() {

        const relatedTags = new RelatedTagsManager();

        relatedTags.update('0x01', 'set', [Tags.create('linux')]);
        relatedTags.update('0x01', 'set', [Tags.create('microsoft')]);

        relatedTags.update('0x02', 'set', [Tags.create('linux')]);
        relatedTags.update('0x02', 'set', [Tags.create('google')]);

        relatedTags.update('0x03', 'set', [Tags.create('linux')]);
        relatedTags.update('0x03', 'set', [Tags.create('microsoft')]);

        relatedTags.update('0x04', 'set', [Tags.create('linux')]);
        relatedTags.update('0x04', 'set', [Tags.create('microsoft')]);

        relatedTags.update('0x05', 'set', [Tags.create('linux')]);
        relatedTags.update('0x05', 'set', [Tags.create('google')]);

        const tagDocsIndex = getTagDocsIndex(relatedTags);

        assert.isDefined(tagDocsIndex);

        assertJSON(tagDocsIndex, {
            "linux": {
                "tag": "linux",
                "docs": {
                    "0x01": true,
                    "0x02": true,
                    "0x03": true,
                    "0x04": true,
                    "0x05": true
                }
            },
            "microsoft": {
                "tag": "microsoft",
                "docs": {
                    "0x01": true,
                    "0x03": true,
                    "0x04": true
                }
            },
            "google": {
                "tag": "google",
                "docs": {
                    "0x02": true,
                    "0x05": true
                }
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
