import {assert} from 'chai'
import {JSDOM} from 'jsdom';
import {HTMLFormat} from "./HTMLFormat";

declare var global: any;

describe('HTMLFormat', function() {

    describe('currentDocFingerprint', function() {

        it("get", function () {

            const dom = new JSDOM(HTML);

            global.document = dom.window.document;

            const htmlFormat = new HTMLFormat();

            assert.equal(htmlFormat.currentDocFingerprint(), "0x0001");

        });

        it("set", async function () {
            const dom = new JSDOM(HTML);

            global.document = dom.window.document;

            const htmlFormat = new HTMLFormat();

            htmlFormat.setCurrentDocFingerprint("0x9999")

            assert.equal(htmlFormat.currentDocFingerprint(), "0x9999");

        });

    });

});

const HTML = `
<html>
    <head>
        <meta name="polar-fingerprint" content="0x0001">                
    </head>
</html>
`
