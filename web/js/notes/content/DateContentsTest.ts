import { DateContents } from "./DateContents";
import {assertJSON} from "../../test/Assertions";
import {TestingTime} from "polar-shared/src/test/TestingTime";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {assert} from 'chai';

describe('DateContents', function() {


    beforeEach(() => {
        TestingTime.freeze()
    });

    afterEach(() => {
        TestingTime.unfreeze();
    });

    it('basic', () => {

        TestingTime.freeze('2012-01-01T00:00:00.000Z')

        assert.equal(ISODateTimeStrings.create(), "2012-01-01T00:00:00.000Z");

        assertJSON(DateContents.create({timezone: "America/Bogota", locale: 'en-US'}), {
            "data": "2011-12-31",
            "format": "YYYY-MM-DD",
            "type": "date"
        });

        TestingTime.forward('5d');

        assertJSON(DateContents.create({timezone: "America/Bogota", locale: 'en-US'}), {
            "data": "2012-01-05",
            "format": "YYYY-MM-DD",
            "type": "date"
        });

        assertJSON(DateContents.create({timezone: "America/Bogota", locale: 'es-US'}), {
            "data": "2012-01-05",
            "format": "YYYY-MM-DD",
            "type": "date"
        });

        // assertJSON(DateContents.create({timezone: "America/Bogota", locale: 'ja-JP'}), {
        //     "data": "Enero 5, 2012",
        //     "format": "MMMM D, YYYY",
        //     "locale": "ja-JP",
        //     "timezone": "America/Bogota",
        //     "type": "date"
        // });


        //
        // assertJSON(DateContents.create({timezone: "America/Bogota", locale: 'es-US'}), {
        //     "data": "Mar 2, 2012",
        //     "format": "MMM D, YYYY",
        //     "locale": "en-US",
        //     "timezone": "America/Bogota",
        //     "type": "date"
        // });

    });


    it('parse', () => {

        assertJSON(DateContents.parse('2020-01-01'), {
            "day": 1,
            "month": 1,
            "year": 2020
        });

        assertJSON(DateContents.parse('2020-11-20'), {
            "day": 20,
            "month": 11,
            "year": 2020
        });

        assert.isUndefined(DateContents.parse('asdf2020-01-01'))

    });

});
