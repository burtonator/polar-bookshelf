import {Logger} from 'polar-shared/src/logger/Logger';

const log = Logger.create();

export class ExecutionTimer {

    public static execute<T>(func: () => T) {

        let before = Date.now();

        let result = func();

        let after = Date.now();

        let duration = after - before;

        log.info(`Execution time: ${duration}`);

        return result;

    }

    public static async executeAsync<T>(func: () => Promise<T>): Promise<T> {

        let before = Date.now();

        let result = await func();

        let after = Date.now();

        let duration = after - before;

        log.info(`Execution time: ${duration}`);

        return result;

    }


}
