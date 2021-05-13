/**
 * Functionality for working with undo/redo
 *
 * Design inspired by:
 *
 * https://stackoverflow.com/questions/3541383/undo-redo-implementation
 *
 */
export namespace UndoQueues2 {

    export type UndoFunction<U> = () => U;

    export type RedoFunction<R> = () => R;

    export interface IUndoQueueAction<R, U> {
        readonly redo: RedoFunction<R>;
        readonly undo: UndoFunction<U>;
    }

    interface IUndoQueueEntry<R, U> extends IUndoQueueAction<R, U> {
        readonly id: number;
        readonly redo: RedoFunction<R>;
        readonly undo: UndoFunction<U>;
    }

    export interface UndoQueue {

        /**
         * Adds an item to the queue and potentially resets the pointer so that
         * there are no more undo actions if we're not at the head of the queue.
         */
        readonly push: <R,U> (action: IUndoQueueAction<R, U>) => IPushResult<R>;
        readonly undo: () => UndoStatus;
        readonly redo: () => RedoStatus;
        readonly size: () => number;

        /**
         * The pointer into the internal queue where we're going to be
         * undoing/redoing.
         */
        readonly pointer: () => number;

        readonly limit: number;

    }

    export interface ICreateOpts {
        readonly limit?: number;
    }

    export interface IPushResult<R> {
        readonly id: number;
        readonly removedFromHead: number;
        readonly removedFromTail: number;
        readonly value: R;
    }

    export type UndoStatus = 'at-head' | 'executed';

    export type RedoStatus = 'at-tail' | 'executed';

    /**
     * Create an UndoQueue. You should also immediately push a state to restore
     * the first value.
     */
    export function create(opts: ICreateOpts = {}): UndoQueue {

        const actions: IUndoQueueEntry<any, any>[] = [];

        let ptr: number = -1;
        const limit = opts.limit || 25;

        let seq = 0;

        function push<R, U>(action: IUndoQueueAction<R, U>): IPushResult<R> {

            const pushResult = {
                removedFromHead: 0,
                removedFromTail: 0
            }

            const value = action.redo();

            if (actions.length >= limit) {
                // we have too many items so we have to prune one and move it down.
                actions.shift();
                ptr = ptr - 1;
                pushResult.removedFromHead = 1;
            }

            if (ptr !== (actions.length - 1)) {
                const end = ptr + 1;
                const count = actions.length - end;
                actions.splice(end, count);
                pushResult.removedFromTail = count;
            }

            const id = seq++;

            actions.push({
                id,
                ...action
            });

            ptr = ptr + 1;

            return {id, ...pushResult, value};

        }

        function undo(): UndoStatus {

            if (ptr < 0) {
                // we are at the head of the queue so nothing left to complete.
                return 'at-head';
            }

            const action = actions[ptr];
            console.log("Applying action ID: " + action.id);
            action.undo();
            ptr = ptr - 1;

            return 'executed';

        }

        function redo(): RedoStatus {

            const end = actions.length - 1;

            if (ptr === end) {
                return 'at-tail';
            }

            const action = actions[ptr + 1];
            action.redo();
            ptr = ptr + 1;

            return 'executed';

        }

        function size() {
            return actions.length;
        }

        function pointer() {
            return ptr;
        }

        return {push, undo, redo, size, pointer, limit};

    }

}
