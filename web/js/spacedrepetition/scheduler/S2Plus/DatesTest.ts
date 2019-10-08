import {expect} from 'chai';
import {Dates} from './Dates';
import {today} from './DateConstants';
import {oneDayAgo} from './DateConstants';
import {oneWeekAgo} from './DateConstants';
import {twoDaysInFuture} from './DateConstants';
import {twoWeeksInFuture} from './DateConstants';

describe("dateUtils", () => {
    describe("diffDays", () => {
        it("it should return the difference of two dates", () => {
            expect(Dates.diffDays(today, oneDayAgo)).to.equal(1);
            expect(Dates.diffDays(today, oneWeekAgo)).to.equal(7);
            expect(Dates.diffDays(today, twoDaysInFuture)).to.equal(-2);
            expect(Dates.diffDays(today, twoWeeksInFuture)).to.equal(-14);
        });
    });

    describe("addDays", () => {
        it("it should add a given number of days to a date", () => {
            expect(Dates.addDays(today, 2).getTime()).to.equal(twoDaysInFuture.getTime());
            expect(Dates.addDays(today, 14).getTime()).to.equal(twoWeeksInFuture.getTime());
        });
    });

    describe("addDays", () => {
        it("it should subtract a given number of days from a date", () => {
            expect(Dates.subtractDays(today, 1).getTime()).to.equal(oneDayAgo.getTime());
            expect(Dates.subtractDays(today, 7).getTime()).to.equal(oneWeekAgo.getTime());
        });
    });
});
