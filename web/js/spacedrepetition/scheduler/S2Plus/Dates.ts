const milliPerDay = 1000 * 60 * 60 * 24;

export class Dates {

    public static addDays(dateA: DateLike, numDays: number): Date {
        const date = new Date(dateA);
        date.setTime(date.getTime() + daysToMS(numDays));
        return date;
    }

    public static subtractDays(dateA: DateLike, numDays: number): Date {
        const date = new Date(dateA);
        date.setTime(date.getTime() - daysToMS(numDays));
        return date;
    }

    public static diffDays = (dateA: Date, dateB: Date): Days => {
        const utc1 = Date.UTC(dateA.getFullYear(), dateA.getMonth(), dateA.getDate());
        const utc2 = Date.UTC(dateB.getFullYear(), dateB.getMonth(), dateB.getDate());

        return Math.floor((utc1 - utc2) / milliPerDay);
    }

}

function daysToMS(numDays: number) {
    return numDays * milliPerDay;
}

export type DateLike = number | string | Date;

export type Days = number;

