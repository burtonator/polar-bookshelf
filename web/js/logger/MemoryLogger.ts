import {ILogger} from 'polar-shared/src/logger/ILogger';
import {FixedBuffer} from '../util/FixedBuffer';
import {LogLevelName, LogMessage} from './Logging';
import {EventListener, Releaseable} from '../reactor/EventListener';
import {ISODateTimeStrings} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {Strings} from "polar-shared/src/util/Strings";

const capacity = Strings.toNumber(process.env.POLAR_LOG_CAPACITY, 250);

let IDX_GENERATOR = 0;

const buffer = new FixedBuffer<LogMessage>(capacity);

/**
 * Write log messages to an internal buffer for testing log output of
 * components.
 */
export class MemoryLogger implements ILogger {

    public readonly name: string = 'memory-logger';

    public notice(msg: string, ...args: any[]) {
        buffer.write(createLogMessage('notice', msg, args));
    }

    public info(msg: string, ...args: any[]) {
        buffer.write(createLogMessage( 'info', msg, args));
    }

    public warn(msg: string, ...args: any[]) {
        buffer.write(createLogMessage( 'warn', msg, args));
    }

    public error(msg: string, ...args: any[]) {
        buffer.write(createLogMessage( 'error', msg, args));
    }

    public verbose(msg: string, ...args: any[]) {
        buffer.write(createLogMessage( 'verbose', msg, args));
    }

    public debug(msg: string, ...args: any[]) {
        buffer.write(createLogMessage( 'debug', msg, args));
    }

    public getOutput(): string {
        return buffer.toView().join("\n");
    }

    public toJSON() {
        return JSON.stringify(buffer.toView(), null, "  ");
    }

    public async sync(): Promise<void> {
        // noop
    }

    public static addEventListener(eventListener: EventListener<LogMessage>): Releaseable {
        return buffer.addEventListener(eventListener);
    }

    public static toView(): ReadonlyArray<LogMessage> {
        return buffer.toView();
    }

    public static clear(): void {
        buffer.clear();
        buffer.write(createLogMessage( 'info', "Log messages cleared", []));
    }

}

function createLogMessage(level: LogLevelName,
                          msg: string,
                          args: ReadonlyArray<any>): LogMessage {

    return {
        timestamp: ISODateTimeStrings.create(),
        idx: IDX_GENERATOR++,
        level,
        msg,
        args
    };

}


