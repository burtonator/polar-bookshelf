import {IBlock} from "./IBlock";
import {SetArrays} from "polar-shared/src/util/SetArrays";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {BlockIDStr, BlocksStore} from "./BlocksStore";
import {UndoQueues2} from "../../undo/UndoQueues2";
import {PositionalArrays} from "./PositionalArrays";
import {IWithMutationOpts} from "./Block";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {BlocksStoreMutations} from "./BlocksStoreMutations";
import { BlocksPersistenceWriter } from "../persistence/BlocksPersistence";

export namespace BlocksStoreUndoQueues {

    import IBlocksStoreMutation = BlocksStoreMutations.IBlocksStoreMutation;
    import IBlocksStoreMutationUpdated = BlocksStoreMutations.IBlocksStoreMutationModified;
    import IBlocksStoreMutationAdded = BlocksStoreMutations.IBlocksStoreMutationAdded;
    import IBlocksStoreMutationRemoved = BlocksStoreMutations.IBlocksStoreMutationRemoved;
    import computeMutationTargets = BlocksStoreMutations.computeMutationTargets;
    import IItemsPositionPatch = BlocksStoreMutations.IItemsPositionPatch;
    import computeItemPositionPatches = BlocksStoreMutations.computeItemPositionPatches;

    export interface IUndoMutation {
        readonly parent: IBlock | undefined;
        readonly child: IBlock;
    }

    export interface IUndoCapture {

        readonly capture: () => void;

        /**
         * Undo the operations using patches.
         */
        readonly undo: () => void;

        /**
         * Redo the operations using patches.
         */
        readonly redo: () => void;

        readonly persist: () => void;

    }

    export interface IUndoCaptureOpts {
        readonly noExpand?: boolean;
    }

    /**
     * Do an undo operation and push it into the undo queue.
     */
    export function doUndoPush<T>(blocksStore: BlocksStore,
                                  undoQueue: UndoQueues2.UndoQueue,
                                  identifiers: ReadonlyArray<BlockIDStr>,
                                  blocksPersistenceWriter: BlocksPersistenceWriter,
                                  redoDelegate: () => T): T {

        // TODO: dont' allow undo on pages that aren't currently the root because when the user
        // is navigating through different pages they could undo stuff in a previous context
        // but maybe the trick here is to create a new undo context when the route changes.

        // this captures the state before the initial transaction
        const undoCapture = createUndoCapture(blocksStore, identifiers, blocksPersistenceWriter);

        let captured: boolean = false;

        let result: T | undefined;

        /**
         * The redo operation has to execute, capture the graph for a delta
         * operation later,
         */
        const redo = (): T => {

            if (captured) {
                undoCapture.redo();
            } else {
                result = redoDelegate();
                undoCapture.capture();
                captured = true;
            }

            return result!;

        }

        const undo = () => {
            undoCapture.undo();
        }

       try {

           return undoQueue.push({redo, undo}).value;

       } finally {
            undoCapture.persist();
       }

    }
    /**
     * Perform an undo capture for the following identifiers based on their
     * parent
     */
    export function createUndoCapture(blocksStore: BlocksStore,
                                      identifiers: ReadonlyArray<BlockIDStr>,
                                      blocksPersistenceWriter: BlocksPersistenceWriter): BlocksStoreUndoQueues.IUndoCapture {

        if (identifiers.length === 0) {
            throw new Error("Not given any identifiers");
        }

        identifiers = expandToParentAndChildren(blocksStore, identifiers);

        if (identifiers.length === 0) {
            throw new Error("Expansion failed to identify additional identifiers");
        }

        /**
         * Computes only the blocks that are applicable to this operation.  We
         * have to know all the block IDs that would be involved with this
         * transaction.
         */
        const computeApplicableBlocks = (blocks: ReadonlyArray<IBlock>) => {
            return blocks.filter(block => identifiers.includes(block.id));
        }

        const beforeBlocks: ReadonlyArray<IBlock> = computeApplicableBlocks(blocksStore.createSnapshot(identifiers));

        let afterBlocks: ReadonlyArray<IBlock> = [];

        const capture = () => {

            const snapshot = blocksStore.createSnapshot(identifiers);

            afterBlocks = computeApplicableBlocks(snapshot);

        }

        const undo = () => {
            const mutations = computeMutatedBlocks(beforeBlocks, afterBlocks);
            blocksPersistenceWriter(doMutations(blocksStore, 'undo', mutations));
        }

        const redo = () => {
            const mutations = computeMutatedBlocks(beforeBlocks, afterBlocks);
            blocksPersistenceWriter(doMutations(blocksStore, 'redo', mutations));
        }

        const persist = () => {
            const mutations = computeMutatedBlocks(beforeBlocks, afterBlocks);
            blocksPersistenceWriter(mutations);
        }

        return {capture, undo, redo, persist};

    }

    export type UndoMutationType = 'undo' | 'redo';

    /**
     *
     */
    export function doMutations(blocksStore: BlocksStore,
                                mutationType: UndoMutationType,
                                mutations: ReadonlyArray<IBlocksStoreMutation>): ReadonlyArray<IBlocksStoreMutation> {

        const createWithMutationOpts =  (mutation: IBlocksStoreMutation): IWithMutationOpts => {

            switch (mutationType) {

                case "undo":

                    switch (mutation.type) {

                        case "added":
                            return {
                                updated: mutation.added.updated,
                                mutation: mutation.added?.mutation
                            };
                        case "removed":
                            return {
                                updated: mutation.removed.updated,
                                mutation: mutation.removed?.mutation
                            };
                        case "modified":
                            return {
                                updated: mutation.before.updated,
                                mutation: mutation.before?.mutation
                            };

                    }

                case "redo":

                    const updated = ISODateTimeStrings.create();

                    switch (mutation.type) {

                        case "added":
                            return {
                                updated,
                                mutation: 0,
                            }
                        case "removed":
                            return {
                                updated,
                                mutation: mutation.removed.mutation,
                            }
                        case "modified":
                            return {
                                updated,
                                mutation: mutation.before.mutation + 1,
                            }

                    }

            }

        }

        const handleModified = (mutation: IBlocksStoreMutationUpdated) => {

            // updated means we need to restore it to the older version.

            const block = blocksStore.getBlock(mutation.id);

            if (! block) {
                throw new Error("Could not find updated block: " + mutation.id);
            }

            console.log(`Handling 'updated' mutation for block ${block.id}: `, mutation);

            const mutationTargets = computeMutationTargets(mutation.before, mutation.after);

            const computeComparisonBlock = (): IBlock => {

                switch (mutationType) {
                    case "undo":
                        return mutation.before;
                    case "redo":
                        return mutation.after;

                }

            }

            const computeTransformedItemPositionPatches = () => {

                const transformItemPositionPatch = (itemsPositionPatch: IItemsPositionPatch): IItemsPositionPatch => {

                    const computeUndoType = () => {
                        return itemsPositionPatch.type === 'remove' ? 'insert' : 'remove';
                    }

                    const computeRedoType = () => {
                        return itemsPositionPatch.type;
                    }

                    const newType = mutationType === 'undo' ? computeUndoType() : computeRedoType();

                    console.log(`Transform item patch from ${itemsPositionPatch.type} to ${newType}`);

                    return {
                        type: newType,
                        key: itemsPositionPatch.key,
                        id: itemsPositionPatch.id
                    }

                }

                return computeItemPositionPatches(mutation.before.items, mutation.after.items)
                           .map(current => transformItemPositionPatch(current));


            }

            //
            // Bob: block0 : v0 => San Francisco
            //
            // # Bob creates block0 at v0 (version 0) and sets the value to "San Francisco"
            //
            // Alice: block0 : v1 => Germany
            //
            // # Alice edits block0, changes the version number to v1, and sets the value to "Germany"
            // #
            // # Alice has an undo queue entry here that can properly restore the block0 edit
            // # from v1 to v0 but ONLY if block0 is at v1.
            // #
            // # right now she can undo if she wants.
            //
            // Bob: block0 : v2 => San Francisco
            //
            // # Bob sets the content of block0 back to San Francisco, and the version is
            // # automatically set to v2.
            // #
            // # Now Alice is prevented from doing an undo because when she reads the current
            // # version, she sees that it's not compatible with her undo so it's silently
            // # aborted.

            const withMutationComparison = (action: (comparisonBlock: IBlock) => void) => {

                const comparisonBlock = computeComparisonBlock();

                console.log("Handling undo patch for comparison block: ", comparisonBlock);

                const comparisonDelta = mutationType === 'undo' ? 1 : -1;

                const comparisonMutation = comparisonBlock.mutation + comparisonDelta;

                if (comparisonMutation === block.mutation) {

                    action(comparisonBlock);

                    return true;

                } else {
                    console.log(`WARN: Skipping update as the mutation number is invalid expected comparisonMutation=${comparisonMutation} but was ${block.mutation} with comparisonDelta=${comparisonDelta}`, mutation);
                    return false;
                }

            }

            const doHandleUpdated = (): boolean => {

                const comparisonBlock = computeComparisonBlock();

                const opts = createWithMutationOpts(mutation);

                return block.withMutation(() => {

                    if (mutationTargets.includes('content')) {

                        withMutationComparison(() => {
                            block.setContent(comparisonBlock.content);
                            block.setLinks(PositionalArrays.toArray(comparisonBlock.links));
                        });

                    }

                    if (mutationTargets.includes('items')) {
                        block.setItemsUsingPatches(computeTransformedItemPositionPatches());
                    }

                    if (mutationTargets.includes('parent')) {
                        block.setParent(comparisonBlock.parent);
                    }

                    if (mutationTargets.includes('parents')) {
                        block.setParents(comparisonBlock.parents);
                    }

                }, opts);

            }

            doHandleUpdated();

        }


        const handleDelete = (mutation: IBlocksStoreMutationAdded | IBlocksStoreMutationRemoved) => {

            if (blocksStore.containsBlock(mutation.id)) {
                blocksStore.doDelete([mutation.id], {noDeleteItems: true});
            } else {
                throw new Error("Block missing: " + mutation.id)
            }

        }

        const handlePut = (mutation: IBlocksStoreMutationAdded | IBlocksStoreMutationRemoved) => {

            const block = mutation.type === 'added' ? mutation.added : mutation.removed;

            if (! blocksStore.containsBlock(mutation.id)) {
                blocksStore.doPut([block]);
            } else {
                throw new Error("Block missing: " + mutation.id)
            }

        }

        const handleAdded = (mutation: IBlocksStoreMutationAdded) => {

            console.log("Handling 'added' mutation: ", mutation);

            switch (mutationType) {

                case "undo":
                    handleDelete(mutation);
                    break;

                case "redo":
                    handlePut(mutation);
                    break;

            }

        }

        const handleRemoved = (mutation: IBlocksStoreMutationRemoved) => {

            console.log("Handling 'removed' mutation: ", mutation);

            // added means we have to remove it now...

            switch (mutationType) {

                case "undo":
                    handlePut(mutation);
                    break;

                case "redo":
                    handleDelete(mutation);
                    break;

            }

        }

        console.log(`Executing undo with ${mutations.length} mutations`, JSON.stringify(mutations, null, '  '));

        const handleMutation = (mutation: IBlocksStoreMutation) => {

            const toNewMutation = (beforeBlock: IBlock | undefined, afterBlock: IBlock | undefined): IBlocksStoreMutation | undefined => {

                if (beforeBlock && ! afterBlock) {
                    return {
                        id: mutation.id,
                        type: 'removed',
                        removed: beforeBlock
                    }
                }

                if (! beforeBlock && afterBlock) {
                    return {
                        id: mutation.id,
                        type: 'added',
                        added: afterBlock
                    }
                }

                if (beforeBlock && afterBlock) {

                    if (beforeBlock.mutation !== afterBlock.mutation) {

                        return {
                            id: mutation.id,
                            type: 'modified',
                            before: beforeBlock,
                            after: afterBlock
                        }

                    }

                }

                return undefined;

            }

            const beforeBlock = blocksStore.getBlock(mutation.id)?.toJSON();

            switch (mutation.type) {

                case "modified":
                    handleModified(mutation);
                    break;

                case "added":
                    handleAdded(mutation);
                    break;

                case "removed":
                    handleRemoved(mutation);
                    break;

            }

            const afterBlock = blocksStore.getBlock(mutation.id)?.toJSON();

            return toNewMutation(beforeBlock, afterBlock);

        }

        return arrayStream([
            ...mutations.filter(current => current.type === 'modified')
                        .map(handleMutation),
            ...mutations.filter(current => current.type !== 'modified')
                        .map(handleMutation)])
            .filterPresent()
            .collect();

    }


    /**
     *
     * For a given ID, compute all the blocks that could be involved in a
     * mutation including the immediate parents and all the children, the
     * identifiers, themselves, and all the descendants.
     */
    export function expandToParentAndChildren(blocksStore: BlocksStore,
                                              identifiers: ReadonlyArray<BlockIDStr>): ReadonlyArray<BlockIDStr> {

        const computeChildren = (identifiers: ReadonlyArray<BlockIDStr>) => {

            const computeChildrenForBlock = (id: BlockIDStr): ReadonlyArray<BlockIDStr> => {

                const items = blocksStore.getBlock(id)?.itemsAsArray || [];

                const descendants = arrayStream(items)
                    .map(current => computeChildrenForBlock(current))
                    .flatMap(current => current)
                    .collect();

                return [
                    ...items,
                    ...descendants
                ];

            }

            return arrayStream(identifiers)
                .map(current => computeChildrenForBlock(current))
                .flatMap(current => current)
                .unique()
                .collect();
        }

        const children = computeChildren(identifiers);

        const computeParents = (identifiers: ReadonlyArray<BlockIDStr>): ReadonlyArray<BlockIDStr> => {

            const getParent = (id: BlockIDStr): BlockIDStr | undefined => {
                return blocksStore.getBlock(id)?.parent;
            }

            return arrayStream(identifiers)
                .map(current => getParent(current))
                .filterPresent()
                .collect();

        }

        const primaryBlockIdentifiers
            = arrayStream([...identifiers, ...children])
            .unique()
            .collect();

        const parents = computeParents(primaryBlockIdentifiers);

        return arrayStream([...identifiers, ...children, ...parents])
            .unique()
            .collect();

    }

    /**
     * Compute just the mutated blocks so that we can figure out which ones need
     * to be patched.
     */
    export function computeMutatedBlocks(beforeBlocks: ReadonlyArray<IBlock>,
                                         afterBlocks: ReadonlyArray<IBlock>): ReadonlyArray<IBlocksStoreMutation> {

        const afterBlockIndex = arrayStream(afterBlocks).toMap(current => current.id);
        const beforeBlockIndex = arrayStream(beforeBlocks).toMap(current => current.id);

        const beforeBlockIDs = beforeBlocks.map(current => current.id);
        const afterBlockIDs = afterBlocks.map(current => current.id);

        const added = SetArrays.difference(afterBlockIDs, beforeBlockIDs)
                               .map(id => afterBlockIndex[id]);

        const removed = SetArrays.difference(beforeBlockIDs, afterBlockIDs)
                                 .map(id => beforeBlockIndex[id]);

        const computeUpdated = (): ReadonlyArray<IBlocksStoreMutationUpdated> => {

            const toUpdated = (beforeBlock: IBlock): IBlocksStoreMutationUpdated | undefined => {

                const afterBlock = afterBlockIndex[beforeBlock.id];
                if ( afterBlock) {
                    if (afterBlock.mutation !== beforeBlock.mutation || afterBlock.updated !== beforeBlock.updated) {
                        return {
                            id: beforeBlock.id,
                            type: 'modified',
                            before: beforeBlock,
                            after: afterBlock
                        };
                    }

                }

                return undefined;

            }

            return arrayStream(beforeBlocks)
                        .map(toUpdated)
                        .filterPresent()
                        .collect();

        }

        const updated = computeUpdated();

        const toMutation = (block: IBlock, type: 'added' | 'removed'): IBlocksStoreMutationAdded | IBlocksStoreMutationRemoved=> {

            switch (type) {

                case "added":
                    return {
                        id: block.id,
                        type,
                        added: block
                    }
                case "removed":
                    return {
                        id: block.id,
                        type,
                        removed: block,
                    }

            }

        }

        return [
            ...added.map(current => toMutation(current, 'added')),
            ...removed.map(current => toMutation(current, 'removed')),
            ...updated,
        ];

    }


}
