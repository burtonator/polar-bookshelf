
export type DateContentFormat = 'YYYY-MM-DD';
export type TimezoneStr = string;
export type LocaleStr = string;

export interface IDateContent {
    readonly type: 'date';
    readonly data: string;
    readonly format: DateContentFormat;
}
