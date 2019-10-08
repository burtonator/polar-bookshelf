import {FontReplacer} from './FontReplacer';

describe('FontReplacer', function() {

    it("basic", async function() {
        const styles = FontReplacer.createFontReplacements();
        console.log(styles);
    });

});

