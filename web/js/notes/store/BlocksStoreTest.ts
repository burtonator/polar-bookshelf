import {MockBlocks} from "../../../../apps/stories/impl/MockBlocks";
import {BlockContent, BlockIDStr, BlocksStore} from "./BlocksStore";
import {assertJSON} from "../../test/Assertions";
import {Arrays} from "polar-shared/src/util/Arrays";
import {TestingTime} from "polar-shared/src/test/TestingTime";
import {assert} from 'chai';
import {isObservable, isObservableProp} from 'mobx';
import {ReverseIndex} from "./ReverseIndex";
import {Block} from "./Block";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {ConstructorOptions, JSDOM} from "jsdom";
import { NameContent } from "../content/NameContent";
import { MarkdownContent } from "../content/MarkdownContent";
import {Asserts} from "polar-shared/src/Asserts";
import assertPresent = Asserts.assertPresent;
import {UndoQueues2} from "../../undo/UndoQueues2";
import {BlocksStoreUndoQueues} from "./BlocksStoreUndoQueues";

// TODO:

//
// - migrate all operations to merge/join not delete / create
//
// - when we create a new note the active isn't set right


// - the actions no longer work... need to fix them.

// - make sure when we update nodes that the graph is updated when we add links
//
// - how do we make react hooks that work with observability
//
// - doCreateNode should always 'split' even if we're at the beginning or end of
//   a node because it would yield an empty prefix or suffix and this way the same
//   code path is used.
//

function assertTextBlock(content: BlockContent): asserts content is MarkdownContent | NameContent {

    if (content.type !== 'markdown' && content.type !== 'name') {
        throw new Error("wrong type: " + content.type);
    }

}


/**
 * Run the action but also undo and redo it and verify the result.  This way
 * every basic test can have an undo/redo operation test assertion too.
 */
export function createUndoRunner(blocksStore: BlocksStore,
                                 identifiers: ReadonlyArray<BlockIDStr>,
                                 action: () => void) {

    identifiers = BlocksStoreUndoQueues.expandToParentAndChildren(blocksStore, identifiers)

    const before = blocksStore.createSnapshot(identifiers);

    console.log("Executing main action... ");
    action();
    console.log("Executing main action... done");

    const after = blocksStore.createSnapshot(identifiers);

    console.log("Execute undo() and verify ... ");
    blocksStore.undo();

    console.log("Verifying undo snapshot with before snapshot... ");
    assertJSON(blocksStore.createSnapshot(identifiers), before);
    console.log("Verifying undo snapshot with before snapshot... done");

    console.log("Execute undo() and verify ... done");

    console.log("Execute redo() and verify ... ");

    blocksStore.redo();

    assertJSON(blocksStore.createSnapshot(identifiers), after);
    console.log("Execute redo() and verify ... done");

}

describe('BlocksStore', function() {

    beforeEach(() => {
        console.log("Freezing time...");
        TestingTime.freeze()
        JSDOMParser.makeGlobal();
    });

    afterEach(() => {
        console.log("Unfreezing time...");
        TestingTime.unfreeze();
    });

    function createStore() {
        const blocks = MockBlocks.create();
        const store = new BlocksStore('1234', UndoQueues2.create({limit: 50}));
        store.doPut(blocks);
        return store;
    }

    describe("Observability", () => {

        it("BlocksStore", () => {

            const store = new BlocksStore('1234', UndoQueues2.create());

            assert.isTrue(isObservable(store));
            assert.isTrue(isObservableProp(store, 'root'));
            assert.isTrue(isObservableProp(store, 'active'));
            assert.isTrue(isObservableProp(store, 'index'));
            assert.isTrue(isObservableProp(store, 'indexByName'));
            assert.isTrue(isObservableProp(store, 'reverse'));
            assert.isTrue(isObservableProp(store, 'expanded'));
        });

        it("Block", () => {

            const block = new Block(MockBlocks.create()[0]);

            assert.isTrue(isObservable(block));
            assert.isTrue(isObservableProp(block, 'content'));
            assert.isTrue(isObservableProp(block, 'items'));
            assert.isTrue(isObservableProp(block, 'updated'));
            assert.isTrue(isObservableProp(block, 'created'));
            assert.isTrue(isObservableProp(block, 'links'));
            assert.isTrue(isObservableProp(block, 'parent'));
            assert.isTrue(isObservableProp(block, 'items'));

            // assert.isTrue(isObservableProp(note.content.type, 'type'));

        });

    });

    it("initial store sanity", () => {

        const store = createStore();

        assertJSON(store, {
            "_expanded": {},
            "_hasSnapshot": false,
            "_index": {
                "102": {
                    "_content": {
                        "_data": "World War II",
                        "_type": "name"
                    },
                    "_created": "2012-03-02T11:38:49.321Z",
                    "_id": "102",
                    "_items": {
                        "1": "103",
                        "2": "104",
                        "3": "105"
                    },
                    "_links": {},
                    "_mutation": 0,
                    "_nspace": "ns101",
                    "_parents": [],
                    "_root": "102",
                    "_uid": "123",
                    "_updated": "2012-03-02T11:38:49.321Z"
                },
                "103": {
                    "_content": {
                        "_data": "[Lasted](https://www.example.com) from 1939 to 1945",
                        "_type": "markdown"
                    },
                    "_created": "2012-03-02T11:38:49.321Z",
                    "_id": "103",
                    "_items": {},
                    "_links": {},
                    "_mutation": 0,
                    "_nspace": "ns101",
                    "_parent": "102",
                    "_parents": [
                        "102"
                    ],
                    "_root": "102",
                    "_uid": "123",
                    "_updated": "2012-03-02T11:38:49.321Z"
                },
                "104": {
                    "_content": {
                        "_data": "Axis Powers: Germany, Italy, Japan",
                        "_type": "markdown"
                    },
                    "_created": "2012-03-02T11:38:49.321Z",
                    "_id": "104",
                    "_items": {},
                    "_links": {},
                    "_mutation": 0,
                    "_nspace": "ns101",
                    "_parent": "102",
                    "_parents": [
                        "102"
                    ],
                    "_root": "102",
                    "_uid": "123",
                    "_updated": "2012-03-02T11:38:49.321Z"
                },
                "105": {
                    "_content": {
                        "_data": "Allied Powers: United States, United Kingdom, [[Canada]], [[Russia]].",
                        "_type": "markdown"
                    },
                    "_created": "2012-03-02T11:38:49.321Z",
                    "_id": "105",
                    "_items": {
                        "1": "106"
                    },
                    "_links": {
                        "1": {
                            "id": "109",
                            "text": "Canada"
                        },
                        "2": {
                            "id": "108",
                            "text": "Russia"
                        }
                    },
                    "_mutation": 0,
                    "_nspace": "ns101",
                    "_parent": "102",
                    "_parents": [
                        "102"
                    ],
                    "_root": "102",
                    "_uid": "123",
                    "_updated": "2012-03-02T11:38:49.321Z"
                },
                "106": {
                    "_content": {
                        "_data": "Lead by Franklin D. Roosevelt, [[Winston Churchill]], and Joseph Stalin ",
                        "_type": "markdown"
                    },
                    "_created": "2012-03-02T11:38:49.321Z",
                    "_id": "106",
                    "_items": {},
                    "_links": {
                        "1": {
                            "id": "112",
                            "text": "Winston Churchill"
                        }
                    },
                    "_mutation": 0,
                    "_nspace": "ns101",
                    "_parent": "105",
                    "_parents": [
                        "102",
                        "105"
                    ],
                    "_root": "102",
                    "_uid": "123",
                    "_updated": "2012-03-02T11:38:49.321Z"
                },
                "107": {
                    "_content": {
                        "_data": "Germany",
                        "_type": "name"
                    },
                    "_created": "2012-03-02T11:38:49.321Z",
                    "_id": "107",
                    "_items": {
                        "1": "110"
                    },
                    "_links": {},
                    "_mutation": 0,
                    "_nspace": "ns101",
                    "_parents": [],
                    "_root": "107",
                    "_uid": "123",
                    "_updated": "2012-03-02T11:38:49.321Z"
                },
                "108": {
                    "_content": {
                        "_data": "Russia",
                        "_type": "name"
                    },
                    "_created": "2012-03-02T11:38:49.321Z",
                    "_id": "108",
                    "_items": {},
                    "_links": {},
                    "_mutation": 0,
                    "_nspace": "ns101",
                    "_parents": [],
                    "_root": "108",
                    "_uid": "123",
                    "_updated": "2012-03-02T11:38:49.321Z"
                },
                "109": {
                    "_content": {
                        "_data": "Canada",
                        "_type": "name"
                    },
                    "_created": "2012-03-02T11:38:49.321Z",
                    "_id": "109",
                    "_items": {
                        "1": "111"
                    },
                    "_links": {},
                    "_mutation": 0,
                    "_nspace": "ns101",
                    "_parents": [],
                    "_root": "109",
                    "_uid": "123",
                    "_updated": "2012-03-02T11:38:49.321Z"
                },
                "110": {
                    "_content": {
                        "_data": "Germany Germany (German: Deutschland, German pronunciation: [ˈdɔʏtʃlant]), officially the Federal Republic of Germany (German: Bundesrepublik Deutschland, About this soundlisten),[e] is a country in Central and Western Europe and one of the major participants of [[World War II]]",
                        "_type": "markdown"
                    },
                    "_created": "2012-03-02T11:38:49.321Z",
                    "_id": "110",
                    "_items": {},
                    "_links": {
                        "1": {
                            "id": "102",
                            "text": "World War II"
                        }
                    },
                    "_mutation": 0,
                    "_nspace": "ns101",
                    "_parent": "107",
                    "_parents": [
                        "107"
                    ],
                    "_root": "101",
                    "_uid": "123",
                    "_updated": "2012-03-02T11:38:49.321Z"
                },
                "111": {
                    "_content": {
                        "_data": "Canada is north of the United States",
                        "_type": "markdown"
                    },
                    "_created": "2012-03-02T11:38:49.321Z",
                    "_id": "111",
                    "_items": {},
                    "_links": {},
                    "_mutation": 0,
                    "_nspace": "ns101",
                    "_parent": "109",
                    "_parents": [
                        "109"
                    ],
                    "_root": "109",
                    "_uid": "123",
                    "_updated": "2012-03-02T11:38:49.321Z"
                },
                "112": {
                    "_content": {
                        "_data": "Winston Churchill",
                        "_type": "name"
                    },
                    "_created": "2012-03-02T11:38:49.321Z",
                    "_id": "112",
                    "_items": {},
                    "_links": {},
                    "_mutation": 0,
                    "_nspace": "ns101",
                    "_parents": [],
                    "_root": "112",
                    "_uid": "123",
                    "_updated": "2012-03-02T11:38:49.321Z"
                }
            },
            "_indexByName": {
                "Canada": "109",
                "Germany": "107",
                "Russia": "108",
                "Winston Churchill": "112",
                "World War II": "102"
            },
            "_reverse": {
                "index": {
                    "102": [
                        "110"
                    ],
                    "108": [
                        "105"
                    ],
                    "109": [
                        "105"
                    ],
                    "112": [
                        "106"
                    ]
                }
            },
            "_selected": {},
            "uid": "1234",
            "undoQueue": {
                "limit": 50
            }
        });

    });

    it("initial reverse index", async function() {

        const store = createStore();

        assertJSON(store.lookupReverse('109'), ['105']);

    });

    describe("lookupReverse", () => {

        it("102", () => {

            const store = createStore();

            const references = store.lookupReverse('102');
            assertJSON(references, ['110']);

        });

    });

    describe("doIndent", () => {

        it("second child block", async function() {

            const store = createStore();

            assertJSON(store.getBlock('102')?.toJSON(),{
                "content": {
                    "data": "World War II",
                    "type": "name"
                },
                "created": "2012-03-02T11:38:49.321Z",
                "id": "102",
                "items": {
                    "1": "103",
                    "2": "104",
                    "3": "105"
                },
                "links": {},
                "mutation": 0,
                "nspace": "ns101",
                "parents": [],
                "root": "102",
                "uid": "123",
                "updated": "2012-03-02T11:38:49.321Z"
            });

            assertJSON(store.expanded, {});

            TestingTime.forward(1000);

            const indentResult = store.indentBlock('104')

            assertJSON(store.getBlock('102')?.toJSON(), {
                "content": {
                    "data": "World War II",
                    "type": "name"
                },
                "created": "2012-03-02T11:38:49.321Z",
                "id": "102",
                "items": {
                    "1": "103",
                    "3": "105"
                },
                "links": {},
                "mutation": 1,
                "nspace": "ns101",
                "parents": [],
                "root": "102",
                "uid": "123",
                "updated": "2012-03-02T11:38:50.321Z"
            });

            assertJSON(store.getBlock(indentResult[0].value!)?.toJSON(), {
                "content": {
                    "data": "[Lasted](https://www.example.com) from 1939 to 1945",
                    "type": "markdown"
                },
                "created": "2012-03-02T11:38:49.321Z",
                "id": "103",
                "items": {
                    "1": "104"
                },
                "links": {},
                "mutation": 1,
                "nspace": "ns101",
                "parent": "102",
                "parents": [
                    "102"
                ],
                "root": "102",
                "uid": "123",
                "updated": "2012-03-02T11:38:50.321Z"
            });

            assertJSON(store.expanded, {
                "103": true
            });

        });

        it("indent node and try to indent it again to make sure it fails properly", async function() {

            const store = createStore();

            const indent0 = store.indentBlock('104');
            const indent1 = store.indentBlock('104');

            assert.equal(indent1.length, 1);

            assert.equal(indent1[0].error, 'no-sibling');

        });

        it("indent then unindent and make sure we do a full restore to the original", () => {

            const store = createStore();

            assertJSON(store.getBlock('102')?.toJSON(),{
                "content": {
                    "data": "World War II",
                    "type": "name"
                },
                "created": "2012-03-02T11:38:49.321Z",
                "id": "102",
                "items": {
                    "1": "103",
                    "2": "104",
                    "3": "105"
                },
                "links": {},
                "mutation": 0,
                "nspace": "ns101",
                "parents": [],
                "root": "102",
                "uid": "123",
                "updated": "2012-03-02T11:38:49.321Z"
            });

            assertJSON(store.expanded, {});

            assertJSON(store.getBlock('104')?.toJSON(), {
                "content": {
                    "data": "Axis Powers: Germany, Italy, Japan",
                    "type": "markdown"
                },
                "created": "2012-03-02T11:38:49.321Z",
                "id": "104",
                "items": {},
                "links": {},
                "mutation": 0,
                "nspace": "ns101",
                "parent": "102",
                "parents": [
                    "102"
                ],
                "root": "102",
                "uid": "123",
                "updated": "2012-03-02T11:38:49.321Z"
            });

            store.indentBlock('104')

            assertJSON(store.getBlock('104')?.toJSON(), {
                "content": {
                    "data": "Axis Powers: Germany, Italy, Japan",
                    "type": "markdown"
                },
                "created": "2012-03-02T11:38:49.321Z",
                "id": "104",
                "items": {},
                "links": {},
                "mutation": 1,
                "nspace": "ns101",
                "parent": "103",
                "parents": [
                    "102", "103"
                ],
                "root": "102",
                "uid": "123",
                "updated": "2012-03-02T11:38:49.321Z"
            });

            assert.equal(store.getBlock('104')!.parent, '103');

            store.unIndentBlock('104');

            assertJSON(store.getBlock('104')?.toJSON(),{
                "content": {
                    "data": "Axis Powers: Germany, Italy, Japan",
                    "type": "markdown"
                },
                "created": "2012-03-02T11:38:49.321Z",
                "id": "104",
                "items": {},
                "links": {},
                "mutation": 2,
                "nspace": "ns101",
                "parent": "102",
                "parents": [
                    "102"
                ],
                "root": "102",
                "uid": "123",
                "updated": "2012-03-02T11:38:49.321Z"
            });

            assertJSON(store.getBlock('102')?.toJSON(), {
                "content": {
                    "data": "World War II",
                    "type": "name"
                },
                "created": "2012-03-02T11:38:49.321Z",
                "id": "102",
                "items": {
                    "1": "103",
                    "2": "104",
                    "3": "105"
                },
                "links": {},
                "mutation": 2,
                "nspace": "ns101",
                "parents": [],
                "root": "102",
                "uid": "123",
                "updated": "2012-03-02T11:38:49.321Z"
            });

        });

        it("indent or a root node", () => {

            const store = createStore();

            const indentResult = store.indentBlock('108')

            assert.equal(indentResult[0].error!, 'no-parent');

        });

        it("indent the first node and fail properly", () => {
            // this should not work because there should be no previous sibling
            // to make as the new parent.

            const store = createStore();

            const indentResult = store.indentBlock('103')

            assert.equal(indentResult[0].error!, 'no-sibling');

        });

    });

    it("basic", async function() {

        const store = createStore();

        assertJSON(Object.keys(store.index), [
            "102",
            "103",
            "104",
            "105",
            "106",
            "107",
            "108",
            "109",
            "110",
            "111",
            "112"
        ]);

        assertJSON(Object.keys(store.indexByName), [
            "World War II",
            "Russia",
            "Canada",
            "Germany",
            "Winston Churchill"
        ]);

        assertJSON(Arrays.first(Object.values(store.index))?.toJSON(), {
            "content": {
                "data": "World War II",
                "type": "name"
            },
            "created": "2012-03-02T11:38:49.321Z",
            "id": "102",
            "items": {
                "1": "103",
                "2": "104",
                "3": "105"
            },
            "links": {},
            "mutation": 0,
            "nspace": "ns101",
            "parents": [],
            "root": "102",
            "uid": "123",
            "updated": "2012-03-02T11:38:49.321Z"
        });

    });

    describe("prevSibling", () => {

        it("no prev sibling", () => {
            const store = createStore()

            assert.equal(store.prevSibling('104'), '103')
        });

        it("has prev sibling", () => {
            const store = createStore()

            assert.isUndefined(store.prevSibling('103'))

        });


    });

    describe("canMerge", () => {

        it("mergeable", () => {

            const store = createStore()

            assertJSON(store.canMerge('104'), {
                "source": "104",
                "target": "103"
            });

        });

        it("unmergeable", () => {

            const store = createStore()

            assert.isUndefined(store.canMerge('103'));

        });
    });

    describe("mergeBlocks", () => {

        it("Merge empty first child with named block root", () => {

            const store = createStore()

            const createdBlock = store.createNewBlock('102');

            assertPresent(createdBlock);

            const block = store.getBlock('102')!;

            assertJSON(block.items, {
                "0": createdBlock?.id,
                "1": "103",
                "2": "104",
                "3": "105"
            });

            const newBlock = store.getBlock(createdBlock.id)!;

            assertTextBlock(newBlock!.content);

            assert.equal(newBlock.content.data, '');

            assert.ok(store.canMerge(newBlock.id));
            assert.ok(store.canMergeWithDelete(newBlock, block));

            assert.equal(store.mergeBlocks(block.id, newBlock.id), 'block-merged-with-delete');

            assertJSON(store.getBlock('102')!.items, {
                "1": "103",
                "2": "104",
                "3": "105"
            });

            assert.isUndefined(store.getBlock(createdBlock.id));

        });

        it("basic merge", () => {

            const store = createStore()

            // merge 103 and 104

            TestingTime.forward(1000);

            assert.equal(store.getBlock('103')?.mutation, 0);
            assert.equal(store.getBlock('104')?.mutation, 0);

            store.mergeBlocks('103', '104');

            assert.isUndefined(store.getBlock('104'));

            assertJSON(store.getBlock('103')?.toJSON(), {
                "content": {
                    "data": "[Lasted](https://www.example.com) from 1939 to 1945Axis Powers: Germany, Italy, Japan",
                    "type": "markdown"
                },
                "created": "2012-03-02T11:38:49.321Z",
                "id": "103",
                "items": {},
                "links": {},
                "mutation": 1,
                "nspace": "ns101",
                "parent": "102",
                "parents": [
                    "102"
                ],
                "root": "102",
                "uid": "123",
                "updated": "2012-03-02T11:38:50.321Z"
            });

        });

    });

    describe("Blocks", () => {

        describe("setContent", () => {

            it("reactivity", () => {
                //
                // const store = createStore();
                //
                // const block = store.getBlock('102')
                //
                // console.log("FIXME: ", block!.content);
                //
                //
                // (block!.content as any).subscribe((next: any) => console.log("FIXME next"));

            });

            it("basic", () => {

                const store = createStore();

                const block = store.getBlock('102')

                assertPresent(block);

                assertJSON(block.toJSON(), {
                    "content": {
                        "data": "World War II",
                        "type": "name"
                    },
                    "created": "2012-03-02T11:38:49.321Z",
                    "id": "102",
                    "items": {
                        "1": "103",
                        "2": "104",
                        "3": "105"
                    },
                    "links": {},
                    "mutation": 0,
                    "nspace": "ns101",
                    "parents": [],
                    "root": "102",
                    "uid": "123",
                    "updated": "2012-03-02T11:38:49.321Z"
                });

                TestingTime.forward(1000);

                block.withMutation(() => {
                    block.setContent({type: 'name', data: "World War Two"})
                })

                assertJSON(block?.toJSON(),{
                    "content": {
                        "data": "World War Two",
                        "type": "name"
                    },
                    "created": "2012-03-02T11:38:49.321Z",
                    "id": "102",
                    "items": {
                        "1": "103",
                        "2": "104",
                        "3": "105"
                    },
                    "links": {},
                    "mutation": 1,
                    "nspace": "ns101",
                    "parents": [],
                    "root": "102",
                    "uid": "123",
                    "updated": "2012-03-02T11:38:50.321Z"
                });

            });
        });


    });

    it("deleteBlocks", () => {

        it("basic", () => {

            const blocksStore = createStore();

            createUndoRunner(blocksStore, ['102'], () => {
                blocksStore.deleteBlocks(['102']);
            });

        });

    });

    describe("doDelete", () => {

        it("basic", () => {

            const blocksStore = createStore();

            assertJSON(blocksStore.lookupReverse('102'), [
                "110"
            ]);

            blocksStore.deleteBlocks(['102']);

            assertJSON(blocksStore.lookupReverse('102'), []);

        });

        it("delete middle block and verify active", () => {

            const store = createStore();

            store.deleteBlocks(['104']);

            const block = store.getBlock('102');

            assertJSON(block?.toJSON(), {
                "content": {
                    "data": "World War II",
                    "type": "name"
                },
                "created": "2012-03-02T11:38:49.321Z",
                "id": "102",
                "items": {
                    "1": "103",
                    "3": "105"
                },
                "links": {},
                "mutation": 1,
                "nspace": "ns101",
                "parents": [],
                "root": "102",
                "uid": "123",
                "updated": "2012-03-02T11:38:49.321Z"
            })

            assert.equal(store.active?.id, '105');
            assert.equal(store.active?.pos, 'start');

        });

        it("delete all children", () => {

            const store = createStore();

            store.deleteBlocks(['103', '104', '105']);

            const block = store.getBlock('102');

            assertJSON(block?.toJSON(),{
                "content": {
                    "data": "World War II",
                    "type": "name"
                },
                "created": "2012-03-02T11:38:49.321Z",
                "id": "102",
                "items": {},
                "links": {},
                "mutation": 3,
                "nspace": "ns101",
                "parents": [],
                "root": "102",
                "uid": "123",
                "updated": "2012-03-02T11:38:49.321Z"
            })

            assert.equal(store.active?.id, '102');
            assert.equal(store.active?.pos, 'start');

        });


    });

    describe("getBlockByTarget", () => {

        it("By ID", () => {
            const store = createStore();
            const block = store.getBlockByTarget('102');
            assert.equal(block?.id, '102');
        });

        it("By Name", () => {

            const store = createStore();
            const block = store.getBlockByTarget('World War II');
            assert.equal(block?.id, '102');

        });

    });

    describe("pathToBlock", () => {

        it("Verify that a root block has an empty path", () => {

            const store = createStore();
            const path = store.pathToBlock('102');
            assert.equal(path.length, 0);

        });

        it("Path to level 1", () => {

            const store = createStore();
            const path = store.pathToBlock('105');
            assert.equal(path.length, 1);

            assert.equal(path[0].id, "102");

        });

        it("Path to level 2", () => {

            const store = createStore();
            const path = store.pathToBlock('106');
            assert.equal(path.length, 2);

            assert.equal(path[0].id, "102");
            assert.equal(path[1].id, "105");

        });


    });

    describe("ReverseIndex", () => {

        it("basic", () => {

            const index = new ReverseIndex();

            assertJSON(index, {
                "index": {}
            });

            index.add('102', '101');

            assertJSON(index.get('102'), ['101']);

            index.remove('102', '101');

            assertJSON(index.get('102'), []);

        });

    });

    describe("createNewBlock", () => {

        // TODO : test redo and the functions should do patches after the first redo...
        //

        it("basic undo and redo", () => {

            const blocksStore = createStore();

            const identifiers = ['102'];

            // FIXME: there's a bug here... if we restore, and EVERYTHING looks
            // the same, except the mutation, and updated, then we have to restore that
            // too... .

            createUndoRunner(blocksStore, identifiers, () => {

                const createdBlock = blocksStore.createNewBlock('102');

                assertJSON(blocksStore.getBlock('102')?.toJSON(), {
                    "content": {
                        "data": "World War II",
                        "type": "name"
                    },
                    "created": "2012-03-02T11:38:49.321Z",
                    "id": "102",
                    "items": {
                        "0": createdBlock?.id,
                        "1": "103",
                        "2": "104",
                        "3": "105"
                    },
                    "links": {},
                    "mutation": 1,
                    "nspace": "ns101",
                    "parents": [],
                    "root": "102",
                    "uid": "123",
                    "updated": "2012-03-02T11:38:49.321Z"
                });

            })

        });

        it("undo with split", () => {

            const blocksStore = createStore();

            const identifiers = ['104'];

            createUndoRunner(blocksStore, identifiers, () => {

                const createdBlock = blocksStore.createNewBlock('104', {split: {prefix: 'Axis ', suffix: 'Powers: Germany, Italy, Japan'}});

                assertJSON(blocksStore.getBlock('104')?.toJSON(), {
                    "content": {
                        "data": "Axis ",
                        "type": "markdown"
                    },
                    "created": "2012-03-02T11:38:49.321Z",
                    "id": "104",
                    "items": {},
                    "links": {},
                    "mutation": 1,
                    "nspace": "ns101",
                    "parent": "102",
                    "parents": [
                        "102"
                    ],
                    "root": "102",
                    "uid": "123",
                    "updated": "2012-03-02T11:38:49.321Z"
                });

                assertJSON(blocksStore.getBlock(createdBlock!.id)?.toJSON(), {
                    "content": {
                        "data": "Powers: Germany, Italy, Japan",
                        "type": "markdown"
                    },
                    "created": "2012-03-02T11:38:49.321Z",
                    "id": createdBlock!.id,
                    "items": {},
                    "links": {},
                    "mutation": 0,
                    "nspace": "ns101",
                    "parent": "102",
                    "parents": [
                        "102"
                    ],
                    "root": "102",
                    "uid": "1234",
                    "updated": "2012-03-02T11:38:49.321Z"
                });

            });

        });

        it("Make sure first child when having existing children.", () => {

            const store = createStore();

            const block = store.getBlock('102');

            TestingTime.forward(60 * 1000);

            const now = ISODateTimeStrings.create();

            assertJSON(block!.items, {
                "1": "103",
                "2": "104",
                "3": "105"
            });

            const createdBlock = store.createNewBlock('102');

            assertPresent(createdBlock);

            assertJSON(block!.items, {
                "0": createdBlock.id,
                "1": "103",
                "2": "104",
                "3": "105"
            });

            const newBlock = store.getBlock(createdBlock.id)!;

            assert.equal(newBlock.created, now);
            assert.equal(newBlock.updated, now);
            assert.equal(newBlock.parent, block!.id);

            assert.equal(block!.updated, now);

            // assertJSON(store, {});

        });

        it("Add child to root node with no children", () => {

            const store = createStore();

            const block = store.getBlock('102');

            store.deleteBlocks(['103', '104', '105']);

            assertJSON(block!.items, {});

            const createdBlock = store.createNewBlock('102');
            assertPresent(createdBlock);

            assertJSON(block!.items, {
                "-1": createdBlock.id
            });

        });

        it("Make sure it's the child of an expanded block", () => {

            const store = createStore();

            function createBlockWithoutExpansion() {

                const createdBlock = store.createNewBlock('105');
                assertPresent(createdBlock);

                assert.equal(createdBlock.parent, '102');

                const block = store.getBlock('102');

                assertJSON(block!.items, {
                    "1": "103",
                    "2": "104",
                    "3": "105",
                    "4": createdBlock?.id
                });

            }

            function createBlockWithExpansion() {
                store.expand('105');

                const createdBlock = store.createNewBlock('105');
                assertPresent(createdBlock);

                assert.equal(createdBlock.parent, '105');

                const block = store.getBlock('105');

                assertJSON(block!.items, {
                    "0": createdBlock?.id,
                    "1": "106"
                });

            }

            createBlockWithoutExpansion();
            createBlockWithExpansion();



        });

        it("Split a block with children", () => {

            const store = createStore();

            function doFirstSplit() {

                const id = '105'

                const originalBlock = store.getBlock(id);

                assert.isDefined(originalBlock);

                assertTextBlock(originalBlock!.content);

                const createdBlock = store.createNewBlock(id, {split: {prefix: '', suffix: originalBlock!.content.data}});
                assertPresent(createdBlock);

                assertJSON(store.getBlock(originalBlock!.parent!)!.items, {
                    "1": "103",
                    "2": "104",
                    "3": "105",
                    "4": createdBlock.id
                });

                return createdBlock.id;

            }

            function doSecondSplit(id: BlockIDStr) {

                const originalBlock = store.getBlock(id);

                assert.isDefined(originalBlock);

                assertTextBlock(originalBlock!.content);

                const createdBlock = store.createNewBlock(id, {split: {prefix: '', suffix: originalBlock!.content.data}});
                assertPresent(createdBlock);

                assertJSON(store.getBlock(originalBlock!.parent!)!.items, {
                    "1": "103",
                    "2": "104",
                    "3": "105",
                    "4": id,
                    "5": createdBlock.id
                });

            }

            const firstSplitBlockID = doFirstSplit();

            doSecondSplit(firstSplitBlockID);

        });

    });

});


export namespace JSDOMParser {
    declare var global: any;

    export function makeGlobal(html: string = '') {

        const url = 'https://www.example.com';
        const opts: ConstructorOptions = {url, contentType: 'text/html', resources: 'usable'};
        const dom = new JSDOM(`<html><body>${html}</body></html>`, opts);

        global.window = dom.window;
        global.NodeFilter = dom.window.NodeFilter;
        global.document = dom.window.document;

        return dom.window.document.body as HTMLElement;

    }

}
