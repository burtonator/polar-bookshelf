import {PagemarkMode} from 'polar-shared/src/metadata/PagemarkMode';
import {assertJSON} from '../test/Assertions';
import {PagemarkModes} from './PagemarkModes';

describe('PagemarkMode', function() {

    it("toDescriptors", function() {

        const expected = [
            {
                "name": "PRE_READ",
                "title": "pre read",
                "key": "pre-read"
            },
            {
                "name": "READ",
                "title": "read",
                "key": "read"
            },
            {
                "name": "IGNORED",
                "title": "ignored",
                "key": "ignored"
            },
            {
                "name": "TABLE_OF_CONTENTS",
                "title": "table of contents",
                "key": "table-of-contents"
            },
            {
                "name": "APPENDIX",
                "title": "appendix",
                "key": "appendix"
            },
            {
                "name": "REFERENCES",
                "title": "references",
                "key": "references"
            }
        ];

        assertJSON(PagemarkModes.toDescriptors(), expected);

    });

});
