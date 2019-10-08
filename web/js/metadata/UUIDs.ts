import {UUID} from 'polar-shared/src/metadata/UUID';
import {Sequences} from '../util/Sequences';

export class UUIDs {

    public static create(): UUID {
        return Sequences.create();
    }

    public static compare(u0?: UUID, u1?: UUID) {

        if (u0 === undefined && u1 !== undefined) {
            return -1;
        }

        if (u0 === undefined && u1 === undefined) {
            return 0;
        }

        if (u0 !== undefined && u1 === undefined) {
            return 1;
        }

        // TODO: It's better to NOT use localeCompare but couldn't find an
        // easy workaround and since the chars are just ASCII we should be fine.
        return u0!.localeCompare(u1!, "en-us");
    }

    /**
     * Return true if the 'comparison' UUID is updated later than the existing
     * UUID.
     */
    public static isUpdated(existing?: UUID, comparison?: UUID): boolean {
        return this.compare(existing, comparison) < 0;
   }

}
