/**
 * Simple logger that just writes to the console.
 */
import {ILogger} from 'polar-shared/src/logger/ILogger';
import {PackageManifest} from '../../util/PackageManifest';

/**
 * Annotates logs by including the version
 */
export class VersionAnnotatingLogger implements ILogger {

    public readonly name: string;
    private readonly delegate: ILogger;

    private readonly versionAnnotation: string;

    constructor(delegate: ILogger) {
        this.delegate = delegate;
        this.name = `version-annotating-logger -> ${delegate.name}`;
        const packageManifest = new PackageManifest();
        // this.versionAnnotation = `[${packageManifest.name()}-${packageManifest.version()}]`;
        this.versionAnnotation = `[${packageManifest.version()}]`;

    }

    public notice(msg: string, ...args: any[]) {
        this.delegate.notice(this.versionAnnotation + ` ${msg}`, ...args);
    }

    public info(msg: string, ...args: any[]) {
        this.delegate.info(this.versionAnnotation + ` ${msg}`, ...args);
    }

    public warn(msg: string, ...args: any[]) {
        this.delegate.warn(this.versionAnnotation + ` ${msg}`, ...args);
    }

    public error(msg: string, ...args: any[]) {
        this.delegate.error(this.versionAnnotation + ` ${msg}`, ...args);
    }

    public verbose(msg: string, ...args: any[]) {
        this.delegate.verbose(this.versionAnnotation + ` ${msg}`, ...args);
    }

    public debug(msg: string, ...args: any[]) {
        this.delegate.debug(this.versionAnnotation + ` ${msg}`, ...args);
    }

    public async sync(): Promise<void> {
        await this.delegate.sync();
    }

}
