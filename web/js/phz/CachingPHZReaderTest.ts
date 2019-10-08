import {assert} from 'chai';

import {assertJSON} from '../test/Assertions';
import {Files} from 'polar-shared/src/util/Files';
import {ResourceFactory} from './ResourceFactory';
import {CachingPHZReader} from './CachingPHZReader';
import {PHZWriter} from './PHZWriter';
import {TestingTime} from '../test/TestingTime';
import {Time} from '../util/Time';
import {Dictionaries} from 'polar-shared/src/util/Dictionaries';
import {FilePaths} from 'polar-shared/src/util/FilePaths';

TestingTime.freeze();

describe('CachingPHZReader', function() {

    let path = FilePaths.tmpfile("test.phz");

    async function assertPHZReader(phzReader: CachingPHZReader) {

        let resources = await phzReader.getResources();

        let expected: any = {
            "entries": {
                "1XKZEWhTwbtoPFSkR2TJ": {
                    "id": "1XKZEWhTwbtoPFSkR2TJ",
                    "path": "1XKZEWhTwbtoPFSkR2TJ.html",
                    "resource": {
                        "id": "1XKZEWhTwbtoPFSkR2TJ",
                        "created": "2012-03-02T11:38:49.321Z",
                        "meta": {},
                        "url": "http://example.com",
                        "contentType": "text/html",
                        "mimeType": "text/html",
                        "encoding": "UTF-8",
                        "method": "GET",
                        "statusCode": 200,
                        "headers": {},
                    }
                }
            }
        };

        assertJSON(Dictionaries.sorted(resources), Dictionaries.sorted(expected));

        let resourceEntry = resources.entries["1XKZEWhTwbtoPFSkR2TJ"];

        let buffer = await phzReader.getResource(resourceEntry);

        let content = buffer.toString("UTF-8");

        assert.equal(content, "<html></html>");

        // test getting the metadata (when there isn't any)

        let metadata = await phzReader.getMetadata();

        expected = {
            "title": "this is the title"
        };

        assertJSON(Dictionaries.sorted(metadata), Dictionaries.sorted(expected));


    }

    beforeEach(async function() {

        await Files.removeAsync(path);

        let phzWriter = new PHZWriter(path);
        let resource = ResourceFactory.create("http://example.com", "text/html");

        await phzWriter.writeMetadata({
            title: "this is the title"
        });

        await phzWriter.writeResource(resource, "<html></html>");
        await phzWriter.close();

    });

    it("Reading from a new caching reader (not closed)", async function() {

        let phzReader = new CachingPHZReader(path);
        await phzReader.init();

        await assertPHZReader(phzReader);

    });

    it("Reading from a new caching reader (closed)", async function () {

        let phzReader = new CachingPHZReader(path, 1);
        await phzReader.init();

        // we told the reader to only wait for 1ms ...
        await Time.sleep(100);

        await assertPHZReader(phzReader);

        assert.equal(phzReader.reopened > 0, true);

    });

});

