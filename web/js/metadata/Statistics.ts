/**
 * Main entrypoint for computing stats on underlying metadata...
 */
import {DocInfo} from './DocInfo';
import {ISODateString, ISODateTimeStrings} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {Dictionaries} from 'polar-shared/src/util/Dictionaries';
import {HitMap} from 'polar-shared/src/util/HitMap';
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {Arrays} from "polar-shared/src/util/Arrays";

export class Statistics {

    public static computeDocumentsAddedRate(docInfos: Iterable<IDocInfo>): DateStats {

        const result: DateStatMap = {};

        for (const docInfo of docInfos) {

            // merge the 'added' time to a Date map and convert it ot the
            // date...

            if (docInfo.added) {
               const addedDate = ISODateTimeStrings.parse(docInfo.added!);
               const key = ISODateTimeStrings.toISODateString(addedDate);

               if (key) {

                   const entry = Dictionaries.computeIfAbsent(result, key, () => {
                       return {date: key, value: 0};
                   });

                   ++entry.value;

               }

            }

        }

        return Object.values(result)
            .sort((a, b) => a.date.localeCompare(b.date));

    }

    public static computeTopTags(docInfos: Iterable<IDocInfo>, topN: number = 25) {

        const hitMap = new HitMap();

        for (const docInfo of docInfos) {

            const tags = Object.values(docInfo.tags || {});

            for (const tag of tags) {
                hitMap.registerHit(tag.label);
            }

        }

        return Arrays.head(hitMap.toRanked(), topN);

    }

}

export interface DateStatMap {
    [date: string]: DateStat;
}

export type DateStats = ReadonlyArray<DateStat>;

export interface DateStat {
    readonly date: ISODateString;
    readonly value: number;
}
