import {Reducers} from 'polar-shared/src/util/Reducers';

export class GALoggers {

    public static getError(args: any[]): Error | undefined {

        const error: Error | undefined =
            args.filter(arg => arg instanceof Error)
                .reduce(Reducers.FIRST, undefined);

        return error;

    }

    public static toEvent(error: Error | undefined) {

        if (! error) {
            return undefined;
        }

        const action =
            error.message.replace(/[^a-zA-Z]+/g, "-")
                .substring(0, 80)
                .toLowerCase();

        return {category: 'error', action};

    }

}
