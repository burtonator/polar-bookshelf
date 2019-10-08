import {Logger} from 'polar-shared/src/logger/Logger';
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';
import {Latch} from "polar-shared/src/util/Latch";

const log = Logger.create();

export class Promises {

    /**
     * Return the result of ANY of these promises and prefer a successful value
     * but reject if ALL of them fail with the first error.
     *
     * We require at least 1 promise but you can specify up to N
     */
    public static async any<T>(p0: Promise<T>, ...morePromises: Array<Promise<T>>): Promise<T> {

        const promises = [p0, ...morePromises];

        const latch = new Latch<T>();

        const errors: Error[] = [];

        const onError = (err: Error) => {

            errors.push(err);

            if (errors.length === promises.length) {
                latch.reject(errors[0]);
            }

        };

        for (const promise of promises) {

            promise.then(value => latch.resolve(value))
                   .catch(err => onError(err));

        }

        return latch.get();

    }

    /**
     * Execute all the promises in this array in the background and use all the
     * error handler on all of them.
     */
    public static executeInBackground(promises: ReadonlyArray<Promise<any>>,
                                      errorHandler: (err: Error) => void) {

        for (const promise of promises) {
            promise.then(NULL_FUNCTION)
                   .catch(err => errorHandler(err));
        }

    }

    /**
     * A promise based timeout.  This just returns a promise which returns
     * once the timeout has expired. You can then call .then() or just await
     * the timeout.
     *
     * @param timeout
     */
    public static async waitFor(timeout: number) {

        return new Promise(resolve => {

            setTimeout(() => {
                resolve();
            }, timeout);

        });

    }


    /**
     * Return a promise that returns a literal value.
     *
     * @param val
     * @return {Promise<any>}
     */
    public static of(val: any) {
        return new Promise(resolve => {
            resolve(val);
        });
    }


    /**
     * Calls the given callback as a promise which we can await but runs it with
     * the background event loop via timeout to avoid locking up the UI with longer
     * running tasks.
     */
    public static async withTimeout<T>(timeout: number, callback: () => Promise<T> ) {

        return new Promise((resolve, reject) => {

            setTimeout(() => {
                callback().then(result => resolve(result))
                          .catch(err => reject(err));
            }, timeout);

        });

    }

    public static async toVoidPromise(delegate: () => Promise<any>): Promise<void> {
        await delegate();
    }

    /**
     * Execute a function which is async and log any errors it generates.
     *
     * This is helpful if we don't care about the result but do want to know
     * if it has failed.
     *
     * @param func
     */
    public static executeLogged(func: () => Promise<any>) {
        func().catch(err => log.error("Caught error: ", err));
    }

    public static requestAnimationFrame(callback: () => void = NULL_FUNCTION) {
        return new Promise(resolve => {
            callback();
            window.requestAnimationFrame(() => resolve());
        });
    }


    public static toDelayed<T>(delegate: () => Promise<T>) {

        return () => {
            return new Promise((resolve, reject) => {
                try {
                    resolve(delegate());
                } catch(err) {
                    reject(err);
                }
            });

        };

    }

}

export interface Completion<T> {

    readonly resolve: ResolveFunction<T>;
    readonly reject: RejectFunction;

}

export interface ResolveFunction<T> {
    (value: T): void;
}

export interface RejectFunction {
    (error: Error): void;
}
