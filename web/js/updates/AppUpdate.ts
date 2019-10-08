export interface AppUpdate {
    readonly fromVersion: string;
    readonly toVersion: string;
    readonly automatic: boolean;
}
