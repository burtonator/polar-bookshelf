import {IMarkdownContent} from "../content/IMarkdownContent";
import {PositionalArrays} from "./PositionalArrays";
import {assertJSON} from "../../test/Assertions";
import {BlocksStoreTests} from "./BlocksStoreTests";
import createBasicBlock = BlocksStoreTests.createBasicBlock;
import {BlocksStoreMutations} from "./BlocksStoreMutations";

describe('BlocksStoreMutations', () => {

    describe("computeMutationTargets", () => {

        it("items", () => {

            const before = createBasicBlock<IMarkdownContent>({
                root: "100",
                parent: "100",
                parents: ["100"],
                content: {
                    type: 'markdown',
                    data: 'hello world',
                },
                items: PositionalArrays.create(['1', '2'])
            });

            const after = createBasicBlock<IMarkdownContent>({
                root: "100",
                parent: "100",
                parents: ["100"],
                content: {
                    type: 'markdown',
                    data: 'hello world'
                },
                items: PositionalArrays.create(['1', '2', '3'])
            });

            assertJSON(BlocksStoreMutations.computeMutationTargets(before, after), ['items']);

        });

        it("content", () => {

            const before = createBasicBlock<IMarkdownContent>({
                root: "100",
                parent: "100",
                parents: ["100"],
                content: {
                    type: 'markdown',
                    data: 'hello world'
                }
            });

            const after = createBasicBlock<IMarkdownContent>({
                root: "100",
                parent: "100",
                parents: ["100"],
                content: {
                    type: 'markdown',
                    data: 'hello world 2'
                }
            });

            assertJSON(BlocksStoreMutations.computeMutationTargets(before, after), ['content']);

        });

        it("items-and-content", () => {

            const before = createBasicBlock<IMarkdownContent>({
                root: "100",
                parent: "100",
                parents: ["100"],
                content: {
                    type: 'markdown',
                    data: 'hello world'
                },
                items: PositionalArrays.create(['1', '2'])
            });

            const after = createBasicBlock<IMarkdownContent>({
                root: "100",
                parent: "100",
                parents: ["100"],
                content: {
                    type: 'markdown',
                    data: 'hello world 2'
                },
                items: PositionalArrays.create(['1', '2', '3'])

            });

            assertJSON(BlocksStoreMutations.computeMutationTargets(before, after), ['items', 'content']);

        });

        it("no mutation", () => {

            const before = createBasicBlock<IMarkdownContent>({
                root: "100",
                parent: "100",
                parents: ["100"],
                content: {
                    type: 'markdown',
                    data: 'hello world'
                },
                items: PositionalArrays.create(['1', '2'])
            });

            const after = createBasicBlock<IMarkdownContent>({
                root: "100",
                parent: "100",
                parents: ["100"],
                content: {
                    type: 'markdown',
                    data: 'hello world'
                },
                items: PositionalArrays.create(['1', '2'])

            });

            assertJSON(BlocksStoreMutations.computeMutationTargets(before, after), []);

        });

    });
    describe("computeItemPositionPatches", () => {

        it("remove", () => {

            assertJSON(BlocksStoreMutations.computeItemPositionPatches(PositionalArrays.create(['1']), PositionalArrays.create([])), [
                {
                    "type": "remove",
                    "key": "1",
                    "id": "1"
                }
            ]);

        });

        it("unshift", () => {

            assertJSON(BlocksStoreMutations.computeItemPositionPatches(PositionalArrays.create([]), PositionalArrays.create(['1'])), [
                {
                    "type": "insert",
                    "key": "1",
                    "id": "1"
                }
            ]);

        });

        it("insert after", () => {

            assertJSON(BlocksStoreMutations.computeItemPositionPatches(PositionalArrays.create(['1']), PositionalArrays.create(['1', '2'])), [
                {
                    "type": "insert",
                    "key": "2",
                    "id": "2"
                }
            ]);

        });


        it("insert before", () => {

            assertJSON(BlocksStoreMutations.computeItemPositionPatches(PositionalArrays.create(['1']), PositionalArrays.create(['2', '1'])), [
                {
                    "type": "insert",
                    "key": "1",
                    "id": "2"
                }
            ]);

        });


    });


});
