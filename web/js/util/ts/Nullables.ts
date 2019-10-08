export class Nullables {

    /**
     * Convert a value that can take null to a value that can take undefined
     * which is more at home in Typescript.
     */
    public static toUndefined<T>(value: T | null): T | undefined {

        if (value === null || value === undefined) {
            return undefined;
        }

        return value;

    }

}
