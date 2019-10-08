/**
 * A generic IPC request message with a type parameter.
 */
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {IPCError} from './IPCError';
import {ElectronContext} from './ElectronContext';
import {ElectronContexts} from './ElectronContexts';
import {Logger} from 'polar-shared/src/logger/Logger';
import {isPresent} from 'polar-shared/src/Preconditions';

const log = Logger.create();

export class IPCMessage<T> {

    private readonly _type: string;

    private readonly _value?: T ;

    private readonly _context: ElectronContext;

    /**
     * A nonce representing this unique IPC channel via a request/response pair.
     *
     * The message is unique by combining the type + nonce.
     */
    private readonly _nonce: number;

    private readonly _error?: IPCError;

    constructor(type: string,
                value?: T,
                nonce = IPCMessage.createNonce(),
                error?: IPCError,
                context = ElectronContexts.create()) {

        if (value && value instanceof IPCMessage) {
            throw new Error("Value is already an IPCMessage");
        }

        this._type = type;
        this._value = value;
        this._nonce = nonce;
        this._context = context;
        this._error = error;
    }

    get type(): string {
        return this._type;
    }

    get value(): T {

        if(this._error) {
            throw new Error(this._error.msg);
        }

        if(! this._value) {
            // technically this should never happen.
            throw new Error("Value was undefined and no error defined.");
        }

        return this._value;
    }

    get nonce(): number {
        return this._nonce;
    }

    get error(): IPCError | undefined {
        return this._error;
    }

    get context(): ElectronContext {
        return this._context;
    }

    computeResponseChannel() {
        return '/ipc/response:' + this.nonce;
    }

    private static createNonce() {
        return Date.now();
    }

    static createError<T>(type: string, error: IPCError): IPCMessage<T> {
        return new IPCMessage<T>(type, undefined, IPCMessage.createNonce(), error);
    }

    public static create<T>(obj: any, valueFactory?: ValueFactory<T> ): IPCMessage<T> {

        if (obj._value === undefined) {
            log.warn("IPC message missing value: ", obj);
        }

        obj._value = Optional.of(obj._value, "value")
            .getOrUndefined();

        if (isPresent(obj._value) && valueFactory) {
            obj._value = valueFactory(obj._value);
        }

        const result: IPCMessage<T> = Object.create(IPCMessage.prototype);
        Object.assign(result, obj);

        return result;

    }


}

interface ValueFactory<T> {

    (obj: any): T;

}
