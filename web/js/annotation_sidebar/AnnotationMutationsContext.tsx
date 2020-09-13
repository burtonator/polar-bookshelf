import React, {useContext} from "react";
import {
    ASYNC_NULL_FUNCTION,
    Callback,
    Callback1,
    NULL_FUNCTION
} from "polar-shared/src/util/Functions";
import {IDocAnnotationRef} from "./DocAnnotation";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {FlashcardInputFieldsType} from "./child_annotations/flashcards/flashcard_input/FlashcardInputs";
import {FlashcardType} from "polar-shared/src/metadata/FlashcardType";
import {FlashcardActions} from "./child_annotations/flashcards/FlashcardActions";
import {CommentActions} from "./child_annotations/comments/CommentActions";
import {IComment} from "polar-shared/src/metadata/IComment";
import {HTMLStr} from "polar-shared/src/util/Strings";
import {TextHighlights} from "../metadata/TextHighlights";
import {AnnotationMutations} from "polar-shared/src/metadata/mutations/AnnotationMutations";
import {IRef} from "polar-shared/src/metadata/Refs";
import {IPageMeta} from "polar-shared/src/metadata/IPageMeta";
import {
    usePersistenceLayerContext,
    useRepoDocMetaManager,
    useTagsContext
} from "../../../apps/repository/js/persistence_layer/PersistenceLayerApp";
import {TaggedCallbacks} from "../../../apps/repository/js/annotation_repo/TaggedCallbacks";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {Tag, Tags} from "polar-shared/src/tags/Tags";
import {useDialogManager} from "../mui/dialogs/MUIDialogControllers";
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";
import {IAreaHighlight} from "polar-shared/src/metadata/IAreaHighlight";
import {
    AreaHighlights,
    AreaHighlightWriteOpts
} from "../metadata/AreaHighlights";
import {ICapturedScreenshot} from "../screenshots/Screenshot";
import {Position} from "polar-shared/src/metadata/IBaseHighlight";
import {AreaHighlightRects} from "../metadata/AreaHighlightRects";
import {Arrays} from "polar-shared/src/util/Arrays";
import {useDocMetaLookupContext} from "./DocMetaLookupContextProvider";
import {
    IAnnotationRef,
    IAnnotationRefWithDocMeta
} from "polar-shared/src/metadata/AnnotationRefs";
import {TextType} from "polar-shared/src/metadata/TextType";
import {Texts} from "polar-shared/src/metadata/Texts";
import {useLogger} from "../mui/MUILogger";
import {Preconditions} from "polar-shared/src/Preconditions";
import {DocMetas} from "../metadata/DocMetas";
import ComputeNewTagsStrategy = Tags.ComputeNewTagsStrategy;

export interface IAnnotationMutationHolder<M> {
    readonly annotation: IAnnotationRef;
    readonly mutation: M;
}

export interface IAnnotationMutationHolderWithDocMeta<M> {
    readonly annotation: IAnnotationRefWithDocMeta;
    readonly mutation: M;
}

/**
 * This allows us to specify what's is being mutated.
 */
export interface IAnnotationMutationSelected {
    readonly selected: ReadonlyArray<IAnnotationRef>;
}

export interface IAnnotationMutationSelectedWithDocMeta {
    readonly selected: ReadonlyArray<IAnnotationRefWithDocMeta>;
}

export interface ICommentCreate {
    readonly type: 'create';
    readonly parent: IRef;
    readonly body: HTMLStr;
}

export interface ICommentUpdate {
    readonly type: 'update';
    readonly parent: IRef;
    readonly body: HTMLStr;
    readonly existing: IDocAnnotationRef;
}

export interface ICommentDelete {
    readonly type: 'delete';
    readonly parent: IRef;
    readonly existing: IDocAnnotationRef;
}

export type ICommentMutation = ICommentCreate | ICommentUpdate | ICommentDelete;

export interface IFlashcardCreate {
    readonly type: 'create';
    readonly parent: IRef;
    readonly flashcardType: FlashcardType,
    readonly fields: Readonly<FlashcardInputFieldsType>
}

export interface IFlashcardUpdate {
    readonly type: 'update';
    readonly parent: IRef;
    readonly flashcardType: FlashcardType,
    readonly fields: Readonly<FlashcardInputFieldsType>;
    readonly existing: IDocAnnotationRef;

}


export interface IFlashcardDelete {
    readonly type: 'delete';
    readonly parent: IRef;
    readonly existing: IDocAnnotationRef;
}

export type IFlashcardMutation = IFlashcardCreate | IFlashcardUpdate | IFlashcardDelete;

interface IAreaHighlightBaseMutation {
    readonly areaHighlight: IAreaHighlight;
    readonly capturedScreenshot: ICapturedScreenshot;
    readonly position: Position;
    readonly docMeta: IDocMeta;
    readonly pageMeta: IPageMeta;
}

export interface IAreaHighlightCreate extends IAreaHighlightBaseMutation {
    readonly type: 'create';
}

export interface IAreaHighlightUpdate extends IAreaHighlightBaseMutation {
    readonly type: 'update';
}

export type IAreaHighlightMutation = IAreaHighlightCreate | IAreaHighlightUpdate;

export interface ITextHighlightCreate {
    readonly type: 'create';

    // we have to specify the textHighlight, the docMeta, and the PageMeta as
    // nothing has been created just yet.
    readonly textHighlight: ITextHighlight;
    readonly docMeta: IDocMeta;
    readonly pageMeta: IPageMeta;
}

export interface ITextHighlightRevert extends IAnnotationMutationSelected {
    readonly type: 'revert';
}

export interface ITextHighlightUpdate extends IAnnotationMutationSelected {
    readonly type: 'update';
    readonly body: string;
}

export type ITextHighlightMutation = ITextHighlightCreate | ITextHighlightUpdate | ITextHighlightRevert;

export interface IDeleteMutation extends IAnnotationMutationSelected {
}

export interface IDeleteMutationWithDocMeta extends IAnnotationMutationSelectedWithDocMeta {

}

export interface IColorMutation {
    readonly color: string;
}

export interface ITaggedMutation extends IAnnotationMutationSelected {
}

export interface IAnnotationMutationCallbacks {

    writeUpdatedDocMetas(updatedDocMetas: ReadonlyArray<IDocMeta>): Promise<void>;

    /**
     * Create a specific callback as a react callback that can be used with a
     * fixed set of selected items.
     */
    readonly createDeletedCallback: (mutation: IDeleteMutation) => Callback;
    /**
     * Delete the given items or whatever is selected.
     */
    readonly onDeleted: (mutation: IDeleteMutation) => void;

    readonly createTaggedCallback: (mutation: ITaggedMutation) => Callback;

    readonly doTagged: (annotations: ReadonlyArray<IAnnotationRef>,
                        tags: ReadonlyArray<Tag>,
                        strategy: ComputeNewTagsStrategy) => void;

    readonly onTagged: (mutation: ITaggedMutation) => void;

    readonly onAreaHighlight: (mutation: IAreaHighlightMutation) => void;
    readonly onTextHighlight: (mutation: ITextHighlightMutation) => void;

    readonly createCommentCallback: (annotation: IAnnotationRef) => (mutation: ICommentMutation) => void;

    readonly onComment: (holders: ReadonlyArray<IAnnotationMutationHolder<ICommentMutation>>) => void;

    readonly createFlashcardCallback: (annotation: IAnnotationRef) => (mutation: IFlashcardMutation) => void;
    readonly onFlashcard: (holders: ReadonlyArray<IAnnotationMutationHolder<IFlashcardMutation>>) => void;

    readonly createColorCallback: (selected: IAnnotationMutationSelected) => (mutation: IColorMutation) => void;

    // TODO: in the future it would be nice to pick the color for multiple items
    // but we can't right now.
    readonly onColor: (mutation: IColorMutation & IAnnotationMutationSelected) => void;

}

const AnnotationMutationsContext = React.createContext<IAnnotationMutationCallbacks>({

    writeUpdatedDocMetas: ASYNC_NULL_FUNCTION,

    createDeletedCallback: () => NULL_FUNCTION,
    onDeleted: NULL_FUNCTION,
    onAreaHighlight: NULL_FUNCTION,
    onTextHighlight: NULL_FUNCTION,

    createCommentCallback: () => NULL_FUNCTION,
    onComment: NULL_FUNCTION,

    createFlashcardCallback: () => NULL_FUNCTION,
    onFlashcard: NULL_FUNCTION,

    createColorCallback: () => NULL_FUNCTION,
    onColor: NULL_FUNCTION,

    createTaggedCallback: () => NULL_FUNCTION,
    doTagged: NULL_FUNCTION,
    onTagged: NULL_FUNCTION,

});

export function useAnnotationMutationsContext() {
    return useContext(AnnotationMutationsContext);
}

interface IProps {
    readonly value: IAnnotationMutationCallbacks;
    readonly children: React.ReactElement;
}

export const AnnotationMutationsContextProvider = (props: IProps) => {

    return (
        <AnnotationMutationsContext.Provider value={props.value}>
            {props.children}
        </AnnotationMutationsContext.Provider>
    );

}

export namespace DocAnnotationsMutator {

    export function onComment(holder: IAnnotationMutationHolderWithDocMeta<ICommentMutation>) {

        const {mutation, annotation} = holder;
        const {docMeta, pageNum} = annotation;
        const pageMeta = DocMetas.getPageMeta(docMeta, pageNum);

        switch (mutation.type) {

            case "create":
                CommentActions.create(docMeta,
                                      pageMeta,
                                      mutation.parent,
                                      mutation.body);
                break;

            case "update":

                const existing = mutation.existing.original as IComment;
                const content = Texts.create(mutation.body, TextType.HTML);

                const updatedComment: IComment = {
                    ...existing,
                    content
                };

                AnnotationMutations.update(annotation, updatedComment);

                break;

            case "delete":
                CommentActions.delete(pageMeta,
                                      mutation.existing);
                break;

        }

    }

    export function onFlashcard(holder: IAnnotationMutationHolderWithDocMeta<IFlashcardMutation>) {

        const {mutation, annotation} = holder;
        const {docMeta, pageNum} = annotation;
        const pageMeta = DocMetas.getPageMeta(docMeta, pageNum);

        switch (mutation.type) {

            case "create":
                FlashcardActions.create(mutation.parent,
                                        pageMeta,
                                        mutation.flashcardType,
                                        mutation.fields);
                break;

            case "update":

                FlashcardActions.update(docMeta,
                                        pageMeta,
                                        mutation.parent,
                                        mutation.flashcardType,
                                        mutation.fields,
                                        mutation.existing.id);

                break;

            case "delete":
                FlashcardActions.delete(docMeta,
                                        pageMeta,
                                        mutation.parent,
                                        mutation.existing.id);
                break;

        }

    }

    export function onAreaHighlight(docMeta: IDocMeta,
                                    pageMeta: IPageMeta,
                                    mutation: IAreaHighlightMutation) {

        const {areaHighlight} = mutation;

        switch (mutation.type) {

            case "update":

                AreaHighlights.update(areaHighlight.id,docMeta, pageMeta, areaHighlight);

                break;

            case "create":

                pageMeta.areaHighlights[areaHighlight.id] = areaHighlight;

                break;

        }

    }

    export function onTextHighlight(docMeta: IDocMeta, pageMeta: IPageMeta, mutation: ITextHighlightMutation) {

        switch (mutation.type) {
            case "revert":

                for (const textHighlight of (mutation.selected || [])) {
                    TextHighlights.resetRevisedText(docMeta,
                                                    pageMeta,
                                                    textHighlight.id);
                }

                break;

            case "update":

                for (const textHighlight of (mutation.selected || [])) {

                    TextHighlights.setRevisedText(docMeta,
                                                  pageMeta,
                                                  textHighlight.id,
                                                  mutation.body);
                }
                break;

            case "create":
                break;

        }

    }

    export function onDeleted(docMeta: IDocMeta, pageMeta: IPageMeta, mutation: IDeleteMutationWithDocMeta) {

        for (const current of mutation.selected || []) {
            console.log("Deleting annotation: ", current);
            AnnotationMutations.delete(current);
        }

    }

}
export namespace AnnotationMutationCallbacks {

    import ComputeNewTagsStrategy = Tags.ComputeNewTagsStrategy;
    import TaggedCallbacksOpts = TaggedCallbacks.TaggedCallbacksOpts;
    import ITagsHolder = TaggedCallbacks.ITagsHolder;

    /**
     * @param updateStore: Update the store directly.
     * @param refresher called for each mutation to update the store.
     */
    export function create(updateStore: (docMetas: ReadonlyArray<IDocMeta>) => ReadonlyArray<IDocMeta>,
                           refresher: () => void): IAnnotationMutationCallbacks {

        const dialogs = useDialogManager();
        const persistenceLayerContext = usePersistenceLayerContext();
        const docMetaLookupContext = useDocMetaLookupContext();
        const tagsContext = useTagsContext();
        const repoDocMetaManager = useRepoDocMetaManager();
        const log = useLogger();

        async function writeUpdatedDocMetas(updatedDocMetas: ReadonlyArray<IDocMeta>) {

            updatedDocMetas = updatedDocMetas.map(DocMetas.updated)

            updatedDocMetas = updateStore(updatedDocMetas);

            refresher();

            const {persistenceLayerProvider} = persistenceLayerContext;

            // TODO: I think this is wrong as we have to update the stores
            // in the doc viewer and repoDocInfo... so I think we would need
            // to update those...

            for (const docMeta of updatedDocMetas) {
                const persistenceLayer = persistenceLayerProvider();
                await persistenceLayer.writeDocMeta(docMeta);
            }

        }

        type AnnotationMutator<T extends IAnnotationMutationSelectedWithDocMeta> = (docMeta: IDocMeta,
                                                                                    pageMeta: IPageMeta,
                                                                                    mutation: T) => void;

        /**
         *
         * @Deprecated migrate to handleUpdate2 and using IAnnotationMutationHolder
         * @param mutation The mutation to execute along with the annotations.
         * @param annotationMutator The mutator to mutate the annotations.
         */
        async function handleUpdate<T extends IAnnotationMutationSelected>(mutation: T,
                                                                           annotationMutator: AnnotationMutator<T & IAnnotationMutationSelectedWithDocMeta>) {

            const selected = docMetaLookupContext.lookupAnnotations(mutation.selected);

            const partitions = arrayStream(selected)
                .partition(annotation => [annotation.docMetaRef.id, docMetaLookupContext.lookup(annotation.docMetaRef.id)!]);

            // *** first we have to apply all the mutations to every annotation in
            // this doc...
            for (const partition of Object.values(partitions)) {
                const docMeta = partition.key;

                for (const annotation of selected) {
                    const pageMeta = DocMetas.getPageMeta(docMeta, annotation.pageNum);
                    annotationMutator(docMeta, pageMeta, {
                        ...mutation,
                        selected: [annotation]
                    });
                }

            }

            // *** now we have to update the store

            const updatedDocMetas = Object.values(partitions)
                                          .map(current => current.key);

            await writeUpdatedDocMetas(updatedDocMetas);

        }

        type AnnotationMutator2<M> = (mutation: IAnnotationMutationHolderWithDocMeta<M>) => void;

        /**
         *
         */
        async function handleUpdate2<M>(holders: ReadonlyArray<IAnnotationMutationHolder<M>>,
                                        annotationMutator: AnnotationMutator2<M>) {

            const resolvedHolders = docMetaLookupContext.lookupAnnotationHolders(holders);

            for (const resolvedHolder of resolvedHolders) {
                annotationMutator(resolvedHolder);
            }

            // *** now we have to update the store

            const updatedDocMetas = Object.values(resolvedHolders)
                                          .map(current => current.annotation.docMeta);

            await writeUpdatedDocMetas(updatedDocMetas);

        }



        function doTagged(annotations: ReadonlyArray<IAnnotationRef>,
                          tags: ReadonlyArray<Tag>,
                          strategy: ComputeNewTagsStrategy = 'set') {

            handleUpdate({selected: annotations}, (docMeta, pageMeta, mutation) => {

                for (const current of mutation.selected) {

                    const newTags = Tags.computeNewTags(current.original.tags, tags, strategy);

                    const updates = {
                        tags: Tags.toMap(newTags)
                    };

                    AnnotationMutations.update({...current, docMeta},
                                               {...current.original, ...updates});

                }

            }).catch(err => log.error(err));

        }

        function createTaggedCallback(mutation: ITaggedMutation) {

            function toTarget(annotation: IAnnotationRef): IAnnotationRef & ITagsHolder {

                return {
                    ...annotation,
                    tags: annotation.original.tags
                }

            }

            function buildRelatedOptionsCalculator() {

                if (repoDocMetaManager) {
                    const {relatedTagsManager} = repoDocMetaManager;
                    return relatedTagsManager.toRelatedOptionsCalculator();
                }

                return undefined;

            }

            const relatedOptionsCalculator = buildRelatedOptionsCalculator();

            const opts: TaggedCallbacksOpts<IAnnotationRef & ITagsHolder> = {
                targets: () => mutation.selected.map(toTarget),
                tagsProvider: tagsContext.tagsProvider,
                dialogs,
                doTagged,
                relatedOptionsCalculator
            }

            return TaggedCallbacks.create(opts);

        }

        function onTagged(mutation: ITaggedMutation) {
            createTaggedCallback(mutation)();
        }

        function createDeletedCallback(mutation: IDeleteMutation): Callback {

            return React.useCallback(() => {
                onDeleted(mutation);
            }, []);

        }

        function onDeleted(mutation: IDeleteMutation) {

            const annotations = docMetaLookupContext.lookupAnnotations(mutation.selected);

            if (annotations.length === 0) {
                log.warn("no repoAnnotation");
                return;
            }

            dialogs.confirm({
                title: "Are you sure you want to delete this item?",
                subtitle: "This is a permanent operation and can't be undone.",
                onAccept: () => doDeleted(annotations)
            })

        }

        function doDeleted(annotations: ReadonlyArray<IAnnotationRefWithDocMeta>) {

            const mutation: IDeleteMutationWithDocMeta = {
                selected: docMetaLookupContext.lookupAnnotations(annotations)
            }

            handleUpdate(mutation, DocAnnotationsMutator.onDeleted)
                .catch(err => log.error(err));

        }

        function onAreaHighlight(mutation: IAreaHighlightMutation) {

            async function doAsync() {

                const {docMeta, pageMeta, areaHighlight, capturedScreenshot, position} = mutation;

                Preconditions.assertPresent(capturedScreenshot, 'capturedScreenshot')

                function toAreaHighlightRect() {
                    const rect = Arrays.first(Object.values(areaHighlight.rects));
                    return AreaHighlightRects.createFromRect(rect!);
                }

                const areaHighlightRect = toAreaHighlightRect();

                // this will do the actual mutation of the docMeta
                // DocAnnotationsMutator.onAreaHighlight(mutation.docMeta, mutation.pageMeta, mutation);

                const {persistenceLayerProvider} = persistenceLayerContext;

                const writeOpts: AreaHighlightWriteOpts = {
                    datastore: persistenceLayerProvider(),
                    docMeta,
                    pageMeta,
                    areaHighlight,
                    areaHighlightRect,
                    position,
                    capturedScreenshot
                };

                const writer = AreaHighlights.createWriter(writeOpts);

                const [writtenAreaHighlight, committer] = writer.prepare();

                updateStore([docMeta]);

                await committer.commit();

                updateStore([docMeta]);

                refresher();

            }

            doAsync().catch(err => log.error(err));

        }

        function onTextHighlight(mutation: ITextHighlightMutation) {

            switch (mutation.type) {

                case "revert":
                case "update":
                    handleUpdate(mutation, DocAnnotationsMutator.onTextHighlight)
                        .catch(err => log.error(err));
                    break;

                case "create":

                    const {docMeta, pageMeta, textHighlight} = mutation;
                    pageMeta.textHighlights[textHighlight.id] = textHighlight;

                    writeUpdatedDocMetas([docMeta])
                        .catch(err => log.error(err));

                    break;


            }

        }

        function createCommentCallback(annotation: IAnnotationRef): Callback1<ICommentMutation> {

            return React.useCallback((mutation: ICommentMutation) => {

                const holder: IAnnotationMutationHolder<ICommentMutation> = {
                    annotation,
                    mutation
                }

                onComment([holder]);

            }, []);

        }

        function onComment(holders: ReadonlyArray<IAnnotationMutationHolder<ICommentMutation>>) {

            handleUpdate2(holders, DocAnnotationsMutator.onComment)
                .catch(err => log.error(err));

        }

        function createFlashcardCallback(annotation: IAnnotationRef): Callback1<IFlashcardMutation> {

            return React.useCallback((mutation: IFlashcardMutation) => {

                const holder: IAnnotationMutationHolder<IFlashcardMutation> = {
                    annotation,
                    mutation
                }

                onFlashcard([holder]);

            }, []);

        }

        function onFlashcard(holders: ReadonlyArray<IAnnotationMutationHolder<IFlashcardMutation>>) {

            handleUpdate2(holders, DocAnnotationsMutator.onFlashcard)
              .catch(err => log.error(err));

        }

        function createColorCallback(selected: IAnnotationMutationSelected): Callback1<IColorMutation> {

            return React.useCallback((mutation: IColorMutation) => {
                onColor({...selected, ...mutation});
            }, []);

        }

        function onColor(colorMutation: IColorMutation & IAnnotationMutationSelected) {

            handleUpdate({selected: colorMutation.selected}, (docMeta, pageMeta, mutation) => {

                for (const current of mutation.selected) {

                    const updates = {
                        color: colorMutation.color
                    };

                    AnnotationMutations.update({...current, docMeta},
                                               {...current.original, ...updates});

                }

            }).catch(err => log.error(err));

        }

        return {
            writeUpdatedDocMetas,
            createDeletedCallback,
            onDeleted,
            onAreaHighlight,
            onTextHighlight,
            createCommentCallback,
            onComment,
            createFlashcardCallback,
            onFlashcard,
            createColorCallback,
            onColor,
            createTaggedCallback,
            doTagged,
            onTagged,
        };

    }

}

