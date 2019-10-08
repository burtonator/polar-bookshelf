import {WriteStream} from "fs";
import {Files} from 'polar-shared/src/util/Files';
import {Preconditions} from 'polar-shared/src/Preconditions';
import {Writer} from '../Exporters';

export class FileWriter implements Writer {

    private readonly path: string;

    private stream?: WriteStream;

    constructor(path: string) {
        this.path = path;
    }

    public async init(): Promise<void> {
        this.stream = Files.createWriteStream(this.path);
    }

    public async write(data: string): Promise<void> {

        Preconditions.assertPresent(this.stream, "no stream");
        this.stream!.write(data);

    }

    public async close(err?: Error): Promise<void> {

        if (this.stream) {
            this.stream.close();
        }

    }

}


