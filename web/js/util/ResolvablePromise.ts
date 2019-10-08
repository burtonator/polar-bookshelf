/**
 * @Deprecated Try to move to using Latch instead of ResolvablePromise.
 * This has a bug where reject fails and I think it's because it's a promise
 * around a promise and node gets confused.
 */
export class ResolvablePromise<T> implements Promise<T> {

    public readonly [Symbol.toStringTag]: "Promise";

    public promise: Promise<T>;

    // noinspection TsLint
    public resolve: (value?: T) => void = () => { };

    // noinspection TsLint
    // public reject: (reason?: any) => void = () => { };

    constructor() {

        this.promise = new Promise<T>((resolve, reject) => {
            this.resolve = resolve;
            // this.reject = reject;
        });


    }

    public async get(): Promise<T> {
        return this.promise;
    }

    public set(value: T) {
        this.resolve(value);
    }

    public catch<TResult = never>(onrejected?: OnRejectedCallback<TResult>): Promise<T | TResult> {
        return this.promise.catch(onrejected);
    }

    public then<TResult1 = T, TResult2 = never>(onresolved?: ((value: T) => (PromiseLike<TResult1> | TResult1)) | null | undefined,
                                                onrejected?: OnRejectedCallback<TResult2>): Promise<TResult1 | TResult2> {

        return this.promise.then(onresolved, onrejected);

    }

}

type OnResolvedCallback<T> = ((reason: any) => (PromiseLike<T> | T)) | null | undefined;

type OnRejectedCallback<T> = ((reason: any) => (PromiseLike<T> | T)) | null | undefined;

