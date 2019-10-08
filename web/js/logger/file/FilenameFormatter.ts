import {Strings} from "polar-shared/src/util/Strings";

export class FilenameFormatter {

    public static formatDate(date: Date) {

        // note that getUTCDate() returns the UTC day of the month.  Very
        // confusing API naming.
        return this.formatYMD(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());

    }

    public static formatYMD(year: number, month: number, day: number) {

        let sYear = `${year}`;
        let sMonth = Strings.lpad('' + month, '0', 2);
        let sDay = Strings.lpad('' + day, '0', 2);

        return `${sYear}-${sMonth}-${sDay}`;
    }

}
