import {IDateContent, LocaleStr, TimezoneStr} from "./IDateContent";

export namespace DateContents {

    export interface IDate {
        readonly year: number;
        readonly month: number;
        readonly day: number;
    }

    interface ICreateOpts {
        readonly timezone?: TimezoneStr;
        readonly locale?: LocaleStr;
    }

    /**
     * Create a new IDateContent object
     */
    export function create(opts?: ICreateOpts): IDateContent {

        const resolvedOptions = Intl.DateTimeFormat().resolvedOptions();
        const timeZone = opts?.timezone || resolvedOptions.timeZone;
        const locale = opts?.locale || resolvedOptions.locale;

        const format = 'YYYY-MM-DD';

        const now = new Date();

        const month = now.toLocaleString(locale, { month: "2-digit", timeZone });
        const day = now.toLocaleString(locale, { day: "2-digit", timeZone });
        const year = now.toLocaleString(locale, { year: "numeric", timeZone });

        const ts = `${year}-${month}-${day}`;

        return {
            type: 'date',
            data: ts,
            format
        }

    }

    export function parse(name: string): IDate | undefined {

        const match = name.match(/^([0-9]{4})-([0-9]{2})-([0-9]{2})$/);

        if (match !== null) {
            const year = parseInt(match[1]);
            const month = parseInt(match[2]);
            const day = parseInt(match[3]);

            return {year, month, day}
        }

        return undefined;

    }

}
