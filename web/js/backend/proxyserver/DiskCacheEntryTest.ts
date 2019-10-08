import {FilePaths} from "polar-shared/src/util/FilePaths";
import {DiskCacheEntry} from './DiskCacheEntry';
import {assert} from 'chai';
import * as fs from 'fs';

describe('DiskCacheEntry', function() {

    describe('Test reading data', function() {

        it("basic", async function () {

            const path = FilePaths.tmpfile("test.txt");
            const testData = "this is some data";
            fs.writeFileSync(path, testData);

            const diskCacheEntry = new DiskCacheEntry({
                url: "http://foo.com/second.txt",
                method: "GET",
                headers: {
                    "Content-Type": "text/html"
                },
                statusCode: 200,
                statusMessage: "OK",
                contentLength: 30,
                path
            });

            let data = null;

            await diskCacheEntry.handleData(function (d) {
                data = d;
            });

            assert.equal(data, testData);

        });

    });

});
