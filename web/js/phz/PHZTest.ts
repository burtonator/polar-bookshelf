import {assert} from 'chai';
import {TestingTime} from '../test/TestingTime';
import {ResourceFactory} from './ResourceFactory';
import {assertJSON} from '../test/Assertions';
import {Files} from 'polar-shared/src/util/Files';
import {PHZWriter} from './PHZWriter';
import {PHZReader} from './PHZReader';
import {Dictionaries} from 'polar-shared/src/util/Dictionaries';
import {FilePaths} from 'polar-shared/src/util/FilePaths';
import JSZip from 'jszip';
import {Streams} from 'polar-shared/src/util/Streams';

TestingTime.freeze();

describe('PHZ functionality', function() {

    it("JSZIP support", function() {
        console.log("FIXME: " , JSZip.support);
    });

    it("ResourceFactory", function() {

        const resource = ResourceFactory.create("http://example.com", "text/html");

        const expected = {
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
        };

        assertJSON(Dictionaries.sorted(resource), Dictionaries.sorted(expected));

    });

    it("Writing with no data", async function() {

        const path = FilePaths.createTempName("test.phz");

        await Files.removeAsync(path);

        const phzWriter = new PHZWriter(path);

        await phzWriter.close();

        assert.equal( await Files.existsAsync(path), true );

    });

    it("Writing one resource", async function() {

        const path = FilePaths.createTempName("test.phz");

        await Files.removeAsync(path);

        const phzWriter = new PHZWriter(path);

        const resource = ResourceFactory.create("http://example.com", "text/html");

        await phzWriter.writeResource(resource, "<html></html>");

        await phzWriter.close();

        assert.equal( await Files.existsAsync(path), true );

    });

    it("Reading", async function() {

        const path = FilePaths.createTempName("test.phz");

        await Files.removeAsync(path);

        const phzWriter = new PHZWriter(path);
        const resource = ResourceFactory.create("http://example.com", "text/html");

        await phzWriter.writeMetadata({
            title: "this is the title"
        });

        await phzWriter.writeResource(resource, "<html></html>");
        await phzWriter.close();

        const phzReader = new PHZReader();
        await phzReader.init(path);

        const resources = await phzReader.getResources();

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

        const resourceEntry = resources.entries["1XKZEWhTwbtoPFSkR2TJ"];

        const buffer = await phzReader.getResource(resourceEntry);

        const content = buffer.toString("UTF-8");

        assert.equal(content, "<html></html>");

        const stream = await phzReader.getResourceAsStream(resourceEntry);
        assert.ok(stream);

        assert.equal((await Streams.toBuffer(stream)).toString("UTF-8"), "<html></html>");

        // test getting the metadata (when there isn't any)

        const metadata = await phzReader.getMetadata();

        expected = {
            "title": "this is the title"
        };

        assertJSON(metadata, expected);

    });

    it("Reading with no metadata or resources", async function() {

        const path = FilePaths.createTempName("test.phz");

        await Files.removeAsync(path);

        const phzWriter = new PHZWriter(path);
        await phzWriter.close();

        const phzReader = new PHZReader();
        await phzReader.init(path);

        const resources = await phzReader.getResources();

        const expected = {
            "entries": {
            }
        };

        assertJSON(resources, expected);

        const metadata = await phzReader.getMetadata();
        assert.equal(metadata, null);

    });

});

