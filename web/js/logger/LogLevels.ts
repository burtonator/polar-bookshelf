import {LogLevel} from './LogLevel';

export class LogLevels {

    public static fromName(name: string): LogLevel {

        const result = (<any> LogLevel)[name];

        if (! result) {
            throw new Error("Invalid name: " + name);
        }

        return result;

    }

}
