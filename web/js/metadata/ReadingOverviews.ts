import {ReadingProgress} from 'polar-shared/src/metadata/ReadingProgress';
import {PageMeta} from './PageMeta';
import {isPresent} from 'polar-shared/src/Preconditions';
import {HitMap} from 'polar-shared/src/util/HitMap';
import {ReadingOverview} from 'polar-shared/src/metadata/ReadingOverview';
import {ISODateString, ISODateTimeString, ISODateTimeStrings} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {PagemarkMode} from 'polar-shared/src/metadata/PagemarkMode';
import {Reducers} from 'polar-shared/src/util/Reducers';
import {Tuples} from '../util/Tuples';
import {IPageMeta} from "polar-shared/src/metadata/IPageMeta";
import {ArrayListMultimap} from "polar-shared/src/util/Multimap";
import {Numbers} from "polar-shared/src/util/Numbers";

const PRE_EXISTING_DAY = '!preexisting';

export class ReadingOverviews {

    private static toDatePercs(records: ReadonlyArray<ReadingProgress>): ReadonlyArray<DatePerc> {

        interface DateToReadPerc {
            readonly created: ISODateTimeString;
            readonly perc: Perc;
        }

        const mapping = new ArrayListMultimap<string /* ISODateString */, DateToReadPerc>();

        for (const record of records) {

            const date = record.preExisting ? PRE_EXISTING_DAY : ISODateTimeStrings.toISODate(record.created);
            const created = record.created;

            mapping.put(date, {
                created,
                perc: record.progressByMode[PagemarkMode.READ] || 0
            });

        }

        const dates = [...mapping.keys()].sort();

        const result: DatePerc[] = [];

        for (const date of dates) {

            const perc =
                mapping.get(date)
                    .sort(((a, b) => a.created.localeCompare(b.created)))
                    .reduce(Reducers.LAST)
                    .perc;

            result.push({date, perc});
        }

        return result;

    }

    private static toDatePercDeltas(readingEntries: ReadonlyArray<DatePercDelta>) {

        const tuples = Tuples.createSiblings(readingEntries);

        const result: DatePercDelta[] = [];

        for (const tuple of tuples) {

            if (! tuple.prev) {
                result.push(tuple.curr);
            } else {
                const perc = Math.abs(tuple.curr.perc - tuple.prev.perc);
                result.push({date: tuple.curr.date, perc});
            }

        }

        return result;

    }

    private static toLogicalPages(pageMeta: IPageMeta) {

        const dimensions = pageMeta.pageInfo.dimensions;

        if (dimensions && isPresent(dimensions.height)) {
            // this in HTML document and we should assume 850px x 1100px
            // is a page.
            return dimensions.height / 1100;
        }

        return 1;

    }

    private static toFixedFloat(value: number) {
        return Numbers.toFixedFloat(value, 2);
    }

    public static compute(pageMetas: ReadonlyArray<IPageMeta>): ReadingOverview {

        const hitMap = new HitMap();

        for (const pageMeta of pageMetas) {

            const logicalPages = this.toLogicalPages(pageMeta);

            const datePercs
                = this.toDatePercs(Object.values(pageMeta.readingProgress));

            const datePercDeltas = this.toDatePercDeltas(datePercs);

            for (const datePercDelta of datePercDeltas) {

                const date = datePercDelta.date;
                const perc = datePercDelta.perc;
                const nrPages = this.toFixedFloat((perc / 100) * logicalPages);
                hitMap.registerHit(date, nrPages);

            }

        }

        const result = hitMap.toLiteralMap();
        delete result[PRE_EXISTING_DAY];

        return result;

    }

}

interface DatePerc {
    readonly date: ISODateString;
    readonly perc: Perc;
}

/**
 * Just like reading entry but the reading entries are delta encoded with
 * the first being the initial value.
 */
interface DatePercDelta extends DatePerc {

}

/**
 *
 * Percentage from 0 to 100
 */
type Perc = number;

