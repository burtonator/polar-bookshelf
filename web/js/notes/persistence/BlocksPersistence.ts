import React from 'react';
import {useFirestore} from "../../../../apps/repository/js/FirestoreProvider";
import {BlocksStoreMutations} from "../store/BlocksStoreMutations";
import IBlocksStoreMutation = BlocksStoreMutations.IBlocksStoreMutation;
import {BlockIDStr, IBlockContent} from "../store/BlocksStore";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import firebase from 'firebase';
import {IBlock} from "../store/IBlock";

export type BlocksPersistenceWriter = (mutations: ReadonlyArray<IBlocksStoreMutation>) => void;

// export interface IFirestoreBlock<C extends IBlockContent = IBlockContent> extends Exclude<IBlock<C>, 'parent'> {
//
//     readonly parent: BlockIDStr | null;
//
// }

export namespace FirestoreBlocks {

    export function toFirestoreBlock(block: IBlock) {

        const result: any = {...block};

        if (result.parent === undefined) {
            result.parent = null;
        }

        return result

    }

    export function fromFirestoreBlock(block: any): IBlock {

        const result: any = {...block};

        if (result.parent === null) {
            result.parent = undefined;
        }

        return result;

    }

}

export function useFirestoreBlocksPersistenceWriter(): BlocksPersistenceWriter {

    const {firestore} = useFirestore();

    return React.useCallback((mutations: ReadonlyArray<IBlocksStoreMutation>) => {

        // console.log("Writing mutations to firestore: ", mutations);

        const firestoreMutations = BlocksPersistence.convertToFirestoreMutations(mutations);

        // console.log("Writing firestoreMutations to firestore: ", firestoreMutations);

        const collection = firestore.collection('block');
        const batch = firestore.batch();

        // convert the firestore mutations to a batch...
        for(const firestoreMutation of firestoreMutations) {

            const doc = collection.doc(firestoreMutation.id);

            switch (firestoreMutation.type) {

                case "set-doc":
                    batch.set(doc, FirestoreBlocks.toFirestoreBlock(firestoreMutation.value));
                    break;

                    case "delete-doc":
                    batch.delete(doc)
                    break;

                case "update-path":
                    batch.update(doc, firestoreMutation.path, firestoreMutation.value !== undefined ? firestoreMutation.value : null);
                    break;

                case "update-delete-field-value":
                    batch.update(doc, firestoreMutation.path, firebase.firestore.FieldValue.delete())
                    break;

            }

        }

        // TODO use a dialog handler for this...
        batch.commit()
            .catch(err => console.log("Unable to commit mutations: ", err, mutations));

    }, [firestore]);

}

export namespace BlocksPersistence {

    import MutationTarget = BlocksStoreMutations.MutationTarget;
    import IItemsPositionPatch = BlocksStoreMutations.IItemsPositionPatch;

    export interface IFirestoreMutationSetDoc {
        readonly id: BlockIDStr;
        readonly type: 'set-doc';
        readonly value: IBlock;
    }

    export interface IFirestoreMutationDeleteDoc {
        readonly id: BlockIDStr;
        readonly type: 'delete-doc';
    }
    export interface IFirestoreMutationUpdatePath {
        readonly id: BlockIDStr;
        readonly type: 'update-path';
        readonly path: string;
        readonly value: any;
    }

    // https://stackoverflow.com/questions/48145962/firestore-delete-a-field-inside-an-object
    export interface IFirestoreMutationUpdateFieldValueDelete {
        readonly id: BlockIDStr;
        readonly type: 'update-delete-field-value';
        readonly path: string;
    }

    export type IFirestoreMutation =
        IFirestoreMutationSetDoc |
        IFirestoreMutationDeleteDoc |
        IFirestoreMutationUpdatePath |
        IFirestoreMutationUpdateFieldValueDelete;

    /**
     * Convert the mutation for Firestore mutations which can then me mapped
     * directly to a Firestore Batch.
     */
    export function convertToFirestoreMutations(mutations: ReadonlyArray<IBlocksStoreMutation>): ReadonlyArray<IFirestoreMutation> {

        const toFirestoreMutation = (mutation: IBlocksStoreMutation): ReadonlyArray<IFirestoreMutation> => {

            switch (mutation.type) {

                case "added":

                    return [
                        {
                            id: mutation.id,
                            type: 'set-doc',
                            value: mutation.added
                        }
                    ];

                case "removed":

                    return [
                        {
                            id: mutation.id,
                            type: 'delete-doc',
                        }
                    ];

                case "modified":

                    const createBaseMutations = (): ReadonlyArray<IFirestoreMutation> => {
                        return [
                            {
                                id: mutation.id,
                                type: 'update-path',
                                path: 'update',
                                value: mutation.after.updated
                            },
                            {
                                id: mutation.id,
                                type: 'update-path',
                                path: 'mutation',
                                value: mutation.after.mutation
                            }

                        ]
                    }

                    const convertToFirebaseMutation = (mutationTarget: MutationTarget): ReadonlyArray<IFirestoreMutation> => {

                        switch (mutationTarget) {

                            case "items":

                                const patchToFirestoreMutation = (patch: IItemsPositionPatch): IFirestoreMutation => {

                                    switch (patch.type) {

                                        case "remove":
                                            return {
                                                id: mutation.id,
                                                type: 'update-delete-field-value',
                                                path: `items.${patch.key}`
                                            }
                                        case "insert":
                                            return {
                                                id: mutation.id,
                                                type: 'update-path',
                                                path: `items.${patch.key}`,
                                                value: patch.id
                                            }

                                    }

                                }

                                const patches = BlocksStoreMutations.computeItemPositionPatches(mutation.before.items,
                                                                                                mutation.after.items);

                                return patches.map(current => patchToFirestoreMutation(current));

                            case "content":
                                return [
                                    {
                                        id: mutation.id,
                                        type: 'update-path',
                                        path: 'content',
                                        value: mutation.after.content
                                    }
                                ];
                            case "parent":
                                return [
                                    {
                                        id: mutation.id,
                                        type: 'update-path',
                                        path: 'parent',
                                        value: mutation.after.parent
                                    }
                                ];

                            case "parents":
                                return [
                                    {
                                        id: mutation.id,
                                        type: 'update-path',
                                        path: 'parents',
                                        value: mutation.after.parents
                                    }
                                ];

                        }

                    }

                    const mutationTargets = BlocksStoreMutations.computeMutationTargets(mutation.before, mutation.after);

                    const firestoreMutations = arrayStream(mutationTargets.map(current => convertToFirebaseMutation(current)))
                            .flatMap(current => current)
                            .collect();

                    const baseMutations = createBaseMutations();

                    const result = [...baseMutations, ...firestoreMutations];

                    return result;

            }

        }

        // console.log("convertToFirestoreMutations: mutations: ", mutations);

        return arrayStream(mutations.map(current => toFirestoreMutation(current)))
            .flatMap(current => current)
            .collect();

    }

}
