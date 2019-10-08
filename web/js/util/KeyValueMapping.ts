/**
 * A key value mapping allows us to take a class or interface and declare that
 * all the properties map to one type.
 *
 * This way we can ONLY index them by the declared properties and not any
 * arbitrary property and if you violate you will get compile time errors.
 */
export type KeyValueMapping<T, V> = {
    [P in keyof T]: V;
};
