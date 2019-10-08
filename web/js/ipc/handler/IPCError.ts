/**
 * Represents the fact that an IPC error failed.
 */
import {Preconditions} from 'polar-shared/src/Preconditions';

export class IPCError {

    public readonly msg: string;

    public constructor(msg: string) {
        Preconditions.assertString(msg, 'msg');
        this.msg = msg;
    }

    public static create(err: Error | string): IPCError {

        if (err instanceof Error) {
            return new IPCError(err.message);
        }

        return new IPCError(err);

    }

}
