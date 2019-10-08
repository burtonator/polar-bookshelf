import {Files} from 'polar-shared/src/util/Files';

import url from 'url';

import PDFJS from 'pdfjs-dist';

xdescribe('PDF', function() {

    xit("basic", async function() {

        const buffer = await Files.readFileAsync("/home/burton/Downloads/1010.3003v1.pdf")
        const uint8 = toArray(buffer);

        // const url = "file:///home/burton/Downloads/1010.3003v1.pdf";
        // const url = "file:///home/burton/incremental-reading/A%20Crypto%20Incubator%20or%20Accelerator%20Can%20Make%20A%20Safe%20ICO%20_%20Crypto%20Briefing.pdf";

        const filePath = "/home/burton/incremental-reading/.stash/The Toyota Way _ 14 Management Principles from the World's Greatest Manufac.pdf";

        if (! await Files.existsAsync(filePath)) {
            throw new Error("File does not exist at path: " + filePath);
        }

        const fileURL = url.format({
            protocol: 'file',
            slashes: true,
            pathname: filePath,
        });

        // const fileURL = "file:///home/burton/incremental-reading/bitcoin/Mastering%20Bitcoin.pdf";

        // const doc = await pdfjs.getDocument(uint8!)

        const pdfLoadingTask = PDFJS.getDocument(fileURL);
        const doc = await pdfLoadingTask.promise;

        const metadata = await doc.getMetadata();

        if(metadata.metadata && metadata.metadata.get('dc:title')) {

            // FIXME: we have dc:language , dc:date, dc:publisher dc:creator dc:description

            console.log("FIXME !!!");
        }

        // metadata.metadata.parse();

        console.log("metadata: ", metadata);

        // doc.
        console.log("numPages: " + doc.numPages);
        console.log("fingerprint: " + doc.fingerprint);

        //assert.ok(PDFJS.getDocument);

    });

});


function toArray(buf: Buffer) {
    if (!buf) return undefined;
    if (buf.constructor.name === 'Uint8Array'
        || buf.constructor === Uint8Array) {
        return buf;
    }
    if (typeof buf === 'string') buf = Buffer.from(buf);
    var a = new Uint8Array(buf.length);
    for (var i = 0; i < buf.length; i++) a[i] = buf[i];
    return a;
};
