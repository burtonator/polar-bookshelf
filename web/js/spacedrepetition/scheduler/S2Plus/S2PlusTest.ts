
import {expect} from 'chai';
import {oneWeekAgo} from './DateConstants';
import {oneDayAgo} from './DateConstants';
import {today} from './DateConstants';
import {Dates} from './Dates';
import {S2Plus} from './S2Plus';
import {TestingTime} from '../../../test/TestingTime';
import {DEFAULT_DIFFICULTY} from './S2Plus';
import {DEFAULT_INTERVAL} from './S2Plus';
import {Days} from './Dates';
import {Difficulty} from './S2Plus';
import {twoDaysAgo} from './DateConstants';

const testData = [
    {
        reviewedAt: oneWeekAgo,
        interval: 7,
        percentOverdue: 1,
        recallRate: 0.5,
    },
    {
        reviewedAt: oneWeekAgo,
        interval: 14,
        percentOverdue: 0.5,
        recallRate: 0.71,
    },
    {
        reviewedAt: oneWeekAgo,
        interval: 1,
        percentOverdue: 2,
        recallRate: 0.01,
    },
    {
        reviewedAt: oneDayAgo,
        interval: 1,
        percentOverdue: 1,
        recallRate: 0.5,
    },
    {
        reviewedAt: oneDayAgo,
        interval: 4,
        percentOverdue: 0.25,
        recallRate: 0.85,
    },
    {
        reviewedAt: today,
        interval: 4,
        percentOverdue: 0,
        recallRate: 1,
    },
];

const testDataCalculate = [
    {
        reviewedAt: Dates.subtractDays(today, 1),
        performanceRating: 1,
        difficulty: 0.5,
        interval: 1,
        nextDifficulty: 0.44,
        nextInterval: 2,
    },
    {
        reviewedAt: Dates.subtractDays(today, 10),
        performanceRating: 1,
        difficulty: 0.5,
        interval: 5,
        nextDifficulty: 0.38,
        nextInterval: 20,
    },
    {
        reviewedAt: Dates.subtractDays(today, 18),
        performanceRating: 0,
        difficulty: 0.3,
        interval: 14,
        nextDifficulty: 0.91,
        nextInterval: 14,
    },
    {
        reviewedAt: Dates.subtractDays(today, 200),
        performanceRating: 1,
        difficulty: 0.3,
        interval: 100,
        nextDifficulty: 0.18,
        nextInterval: 400,
    },
];

describe("calcRecallRate", () => {
    it("it should return recall rate", () => {
        testData.forEach(({ reviewedAt, interval, recallRate }, i) => {
            const result = S2Plus.calcRecallRate(reviewedAt, interval);
            expect(result).to.equal(recallRate);
        });
    });
});

describe("calcPercentOverdue", () => {
    it("should return the percent overdue for an item reviewed in the past", () => {
        testData.forEach(({ reviewedAt, interval, percentOverdue }) => {
            const actual = S2Plus.calcPercentOverdue(reviewedAt, interval);
            expect(actual).to.equal(percentOverdue);
        });
    });
    it("should return a maximum value of 2", () => {
        const actual = S2Plus.calcPercentOverdue(oneWeekAgo, 1);
        expect(actual).to.equal(2);
    });
});

describe("calculate", () => {

    beforeEach(function() {
        TestingTime.freeze();
    });

    afterEach(function() {
        TestingTime.unfreeze();
    });

    it("should calculate the next review data", () => {
        testDataCalculate.forEach(data => {
            const { reviewedAt, difficulty, interval, performanceRating } = data;
            const result = S2Plus.calculate(reviewedAt, difficulty, interval, performanceRating, today);
            expect(result.reviewedAt).to.equal(today);
            expect(result.interval).to.equal(data.nextInterval);
            expect(result.difficulty.toFixed(2)).to.equal(data.nextDifficulty.toString());
        });
    });


    it("basic", () => {

        // TODO: what is difficulty and interval.. ???
        //
        //  - why is reviewedAt its own value?
        //
        //  - I think by default we have to have a queue of new cards which do
        //    not yet have reviews..

        const debugCalc = (reviewedAt: Date,
                           prevDifficulty: Difficulty,
                           prevInterval: Days,
                           performanceRating: number,
                           timestamp = new Date()) => {

            const result = S2Plus.calculate(reviewedAt, prevDifficulty, prevInterval, performanceRating, timestamp);
            console.log(JSON.stringify(result, null, "  "));

        };

        // const [reviewedAt, difficulty, interval, performanceRating] = [oneDayAgo, DEFAULT_DIFFICULTY, DEFAULT_INTERVAL, 1.0 ];
        debugCalc(oneDayAgo, DEFAULT_DIFFICULTY, DEFAULT_INTERVAL, 1.0, today);
        debugCalc(twoDaysAgo, DEFAULT_DIFFICULTY, DEFAULT_INTERVAL, 1.0, today);

    });

});


