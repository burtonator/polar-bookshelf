import {Result} from './Result';

export class Results {

    /**
     * Create a result from an object.
     */
    public static create<T>(result: any): Result<T> {

        if (result.err !== undefined) {

            const err = new Error();

            err.message = result.err.message;
            err.name = result.err.name;
            err.stack = result.err.stack;

            return new Result<T>({
                value: undefined,
                err
            });

        } else {
            return new Result<T>({value: result.value});
        }

    }

    public static createValue<T>(value: T): Result<T> {

        return new Result<T>( {
            value,
            err: undefined
        });

    }

    public static createError<T>(err: Error): Result<T> {

        return new Result<T>( {
            value: undefined,
            err
        });

    }


    public static of<T>(value: T): Result<T> {
        return new Result({value});
    }

    public static ofError<T>(err: Error): Result<T> {
        return new Result({err});
    }

    public static execute<T>(func: () => T ): Result<T> {

        try {

            let value = func();
            return this.createValue(value)

        } catch (e) {
            return this.createError(e);
        }

    }

}
