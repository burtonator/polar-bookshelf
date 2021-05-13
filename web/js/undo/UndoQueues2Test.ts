import {assert} from 'chai';
import {UndoQueues} from "./UndoQueues";
import { assertJSON } from '../test/Assertions';
import { UndoQueues2 } from './UndoQueues2';
import IUndoQueueEntry = UndoQueues2.IUndoQueueAction;

describe('UndoQueues2', function() {

    type StoreData = {[id: string]: string};

    interface IStore {
        readonly value: () => StoreData;
        readonly createAction: (key: string, value: string) => IUndoQueueEntry<void, void>;
    }

    function createStore(): IStore {

        const index: StoreData = {};

        function createAction(key: string, value: string): IUndoQueueEntry<void, void> {

            const redo = () => {
                index[key] = value;
            }

            const undo = () => {
                delete index[key];
            }

            return {redo, undo};

        }


        function value() {
            return index;
        }

        return {
            value, createAction
        };

    }



    it("try to undo when the queue is empty", async function() {
        const undoQueue = UndoQueues2.create();
        const result = undoQueue.undo();
        assert.equal(result, 'at-head');
    });


    it("try to redo when the queue is empty", async function() {
        const undoQueue = UndoQueues2.create();
        assert.equal(undoQueue.redo(), 'at-tail');
    });


    it("try to undo when at the head of the queue. No action should be taken", async function() {

        const undoQueue = UndoQueues2.create({limit: 3});
        assert.equal(undoQueue.limit, 3);

        const store = createStore();

        undoQueue.push(store.createAction('101', '101'))
        undoQueue.push(store.createAction('102', '102'))
        undoQueue.push(store.createAction('103', '103'))

        assertJSON(store.value(), {
            "101": "101",
            "102": "102",
            "103": "103"
        });

        assert.equal(undoQueue.undo(), 'executed');

        assertJSON(store.value(), {
            "101": "101",
            "102": "102",
        });

        assert.equal(undoQueue.undo(), 'executed');

        assertJSON(store.value(), {
            "101": "101",
        });

        assert.equal(undoQueue.undo(), 'executed');

        assertJSON(store.value(), {
        });

        assert.equal(undoQueue.undo(), 'at-head');

        assertJSON(store.value(), {
        });

    });



    it("basic redo", async function() {

        const undoQueue = UndoQueues2.create({limit: 3});
        assert.equal(undoQueue.limit, 3);

        const store = createStore();

        undoQueue.push(store.createAction('101', '101'))
        undoQueue.push(store.createAction('102', '102'))
        undoQueue.push(store.createAction('103', '103'))

        assertJSON(store.value(), {
            "101": "101",
            "102": "102",
            "103": "103"
        });

        assert.equal(undoQueue.undo(), 'executed');

        assertJSON(store.value(), {
            "101": "101",
            "102": "102",
        });

        assert.equal(undoQueue.redo(), 'executed');

        assertJSON(store.value(), {
            "101": "101",
            "102": "102",
            "103": "103"
        });


    });

    it("basic redo with all edge cases", async function() {

        const undoQueue = UndoQueues2.create({limit: 3});
        assert.equal(undoQueue.limit, 3);

        const store = createStore();

        assert.equal(undoQueue.undo(), 'at-head');
        assert.equal(undoQueue.redo(), 'at-tail');

        undoQueue.push(store.createAction('101', '101'))
        undoQueue.push(store.createAction('102', '102'))
        undoQueue.push(store.createAction('103', '103'))

        assertJSON(store.value(), {
            "101": "101",
            "102": "102",
            "103": "103"
        });

        assert.equal(undoQueue.undo(), 'executed');

        assertJSON(store.value(), {
            "101": "101",
            "102": "102",
        });

        assert.equal(undoQueue.redo(), 'executed');

        assertJSON(store.value(), {
            "101": "101",
            "102": "102",
            "103": "103"
        });


    });



    it("full undo and redo", async function() {

        const undoQueue = UndoQueues2.create({limit: 3});
        assert.equal(undoQueue.limit, 3);

        const store = createStore();

        undoQueue.push(store.createAction('101', '101'))
        undoQueue.push(store.createAction('102', '102'))
        undoQueue.push(store.createAction('103', '103'))

        assertJSON(store.value(), {
            "101": "101",
            "102": "102",
            "103": "103"
        });

        assert.equal(undoQueue.undo(), 'executed');

        assertJSON(store.value(), {
            "101": "101",
            "102": "102",
        });

        assert.equal(undoQueue.undo(), 'executed');

        assertJSON(store.value(), {
            "101": "101",
        });

        assert.equal(undoQueue.undo(), 'executed');

        assertJSON(store.value(), {
        });

        assert.equal(undoQueue.undo(), 'at-head');

        assertJSON(store.value(), {
        });

        assert.equal(undoQueue.redo(), 'executed');

        assertJSON(store.value(), {
            "101": "101",
        });

        assert.equal(undoQueue.redo(), 'executed');

        assertJSON(store.value(), {
            "101": "101",
            "102": "102",

        });

        assert.equal(undoQueue.redo(), 'executed');

        assertJSON(store.value(), {
            "101": "101",
            "102": "102",
            "103": "103"
        });

        assert.equal(undoQueue.redo(), 'at-tail');

    });

});

