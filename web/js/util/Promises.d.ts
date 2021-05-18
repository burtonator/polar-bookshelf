export declare class Promises {
    static any<T>(p0: Promise<T>, ...morePromises: ReadonlyArray<Promise<T>>): Promise<T>;
    static executeInBackground(promises: ReadonlyArray<Promise<any>>, errorHandler: (err: Error) => void): void;
    static waitFor(timeout: number): Promise<boolean>;
    static of(val: any): Promise<unknown>;
    static withTimeout<T>(timeout: number, callback: () => Promise<T>): Promise<unknown>;
    static toVoidPromise(delegate: () => Promise<any>): Promise<void>;
    static executeLogged(func: () => Promise<any>): void;
    static requestAnimationFrame(callback?: () => void): Promise<boolean>;
    static toDelayed<T>(delegate: () => Promise<T>): () => Promise<unknown>;
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
