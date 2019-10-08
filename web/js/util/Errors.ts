export class Errors {

    /**
     * Create a new Error with an updated message so it can be rethrown.
     * @param err
     * @param message
     */
    public static rethrow(err: Error, message: string) {

        const msg = `${message}: ${err.message}`;
        throw Object.assign({msg}, err);

    }

}
