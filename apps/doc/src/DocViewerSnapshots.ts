import {UUIDs} from "../../../web/js/metadata/UUIDs";

export namespace DocViewerSnapshots {

    export type UpdateType = 'fresh' | 'stale';

    export function isStaleUpdate(current: string | undefined, updated: string | undefined) {

        if (! current) {
            return false;
        }

        return UUIDs.compare(current, updated) >= 0;
    }

    export function computeUpdateType(current: string | undefined, updated: string | undefined): UpdateType {
        return DocViewerSnapshots.isStaleUpdate(current, updated) ? 'stale' : 'fresh';
    }

}
