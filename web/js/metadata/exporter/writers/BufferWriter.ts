import {WriteStream} from "fs";
import {Files} from 'polar-shared/src/util/Files';
import {Preconditions} from 'polar-shared/src/Preconditions';
import {Writer} from '../Exporters';

/**
 * Simple writer that just writes to memory
 */
export class BufferWriter implements Writer {

    private buffer: string[] = [];

    public async init(): Promise<void> {
        // noop
    }

    public async write(data: string): Promise<void> {
        this.buffer.push(data);
    }

    public async close(err?: Error): Promise<void> {
        // noop
    }

    public toString(): string {
        return this.buffer.join("");
    }

}
