import {Logger} from 'polar-shared/src/logger/Logger';
import {DocInfo} from '../../../web/js/metadata/DocInfo';
import {IDocInfo} from 'polar-shared/src/metadata/IDocInfo';
import {RepoDocInfo} from './RepoDocInfo';
import {Tag, Tags} from 'polar-shared/src/tags/Tags';
import {Preconditions} from 'polar-shared/src/Preconditions';
import {DocMetaFileRefs} from '../../../web/js/datastore/DocMetaRef';
import {PersistenceLayer} from '../../../web/js/datastore/PersistenceLayer';
import {IProvider} from 'polar-shared/src/util/Providers';
import {RepoDocMeta} from './RepoDocMeta';
import {RelatedTagsManager} from '../../../web/js/tags/related/RelatedTagsManager';
import {SetArrays} from 'polar-shared/src/util/SetArrays';
import {DataObjectIndex} from './index/DataObjectIndex';
import {RepoDocAnnotations} from "./RepoDocAnnotations";
import {RepoDocInfos} from "./RepoDocInfos";
import {IDocAnnotation} from "../../../web/js/annotation_sidebar/DocAnnotation";
import {IAsyncTransaction} from "polar-shared/src/util/IAsyncTransaction";
import { IDocMeta } from 'polar-shared/src/metadata/IDocMeta';
import {DocViewerSnapshots} from "../../doc/src/DocViewerSnapshots";

const log = Logger.create();

export class RepoDocAnnotationDataObjectIndex extends DataObjectIndex<IDocAnnotation> {

    constructor() {
        super((repoAnnotation?: IDocAnnotation) => RepoDocAnnotations.toTags(repoAnnotation) );
    }

}

export class RepoDocInfoDataObjectIndex extends DataObjectIndex<RepoDocInfo> {

    constructor() {
        super((repoDocInfo?: RepoDocInfo) => RepoDocInfos.toTags(repoDocInfo) );
    }

}

/**
 * The main interface to the DocRepository including updates, the existing
 * loaded document metadata, and tags database.
 */
export class RepoDocMetaManager {

    public readonly repoDocInfoIndex: RepoDocInfoDataObjectIndex = new RepoDocInfoDataObjectIndex();

    public readonly repoDocAnnotationIndex: RepoDocAnnotationDataObjectIndex = new RepoDocAnnotationDataObjectIndex();

    public readonly relatedTagsManager = new RelatedTagsManager();

    private readonly persistenceLayerProvider: IProvider<PersistenceLayer>;

    constructor(persistenceLayerProvider: IProvider<PersistenceLayer>) {
        Preconditions.assertPresent(persistenceLayerProvider, 'persistenceLayerProvider');
        this.persistenceLayerProvider = persistenceLayerProvider;
    }

    public updateFromRepoDocMeta(fingerprint: string,
                                 repoDocMeta: RepoDocMeta | undefined) {

        if (repoDocMeta) {

            const isStaleUpdate = (): boolean => {

                const existing = this.repoDocInfoIndex.get(fingerprint);

                if (DocViewerSnapshots.computeUpdateType(existing?.docInfo.uuid,
                                                         repoDocMeta.repoDocInfo.docInfo.uuid) === 'stale') {
                    return true;
                }

                if (DocViewerSnapshots.computeUpdateType(existing?.docMeta.docInfo.uuid,
                                                         repoDocMeta.repoDocInfo.docMeta.docInfo.uuid) === 'stale') {
                    return true;
                }

                return false;

            }

            if (isStaleUpdate()) {
                // console.log("Skipping stale update.");
                return;
            }

            this.repoDocInfoIndex.put(repoDocMeta.repoDocInfo.fingerprint, repoDocMeta.repoDocInfo);

            // TODO: right now there is only ONE RelatedTagsManager and it only
            // works with documents not annotations (since tags for annotations
            // was added later).
            this.relatedTagsManager.update(fingerprint, 'set', Object.values(repoDocMeta.repoDocInfo.tags || {}));

            const updateAnnotations = () => {

                const deleteOrphaned = () => {

                    const currentAnnotationsIDs = this.repoDocAnnotationIndex.values()
                        .filter(current => current.fingerprint === repoDocMeta.repoDocInfo.fingerprint)
                        .map(current => current.id);

                    const newAnnotationIDs = repoDocMeta.repoDocAnnotations
                        .map(current => current.id);

                    const deleteIDs = SetArrays.difference(currentAnnotationsIDs, newAnnotationIDs);

                    for (const deleteID of deleteIDs) {
                        this.repoDocAnnotationIndex.delete(deleteID);
                    }

                };

                const updateExisting = () => {

                    for (const repoDocAnnotation of repoDocMeta.repoDocAnnotations) {
                        this.repoDocAnnotationIndex.put(repoDocAnnotation.id, repoDocAnnotation);
                    }

                };

                deleteOrphaned();
                updateExisting();

            };

            updateAnnotations();

        } else {

            const deleteOrphanedAnnotations = () => {

                // now delete stale repo annotations.
                for (const repoAnnotation of this.repoDocAnnotationIndex.values()) {

                    if (repoAnnotation.fingerprint === fingerprint) {
                        this.repoDocAnnotationIndex.delete(repoAnnotation.id);
                    }
                }

            };

            const deleteDoc = () => {
                this.repoDocInfoIndex.delete(fingerprint);
            };

            deleteOrphanedAnnotations();
            deleteDoc();

        }

    }

    /**
     * Update the in-memory representation of this doc.
     *
     */
    public updateFromRepoDocInfo(fingerprint: string, repoDocInfo?: RepoDocInfo) {

        // TODO this is wrong and we're not updating related tags, etc

        if (repoDocInfo) {
            this.repoDocInfoIndex.put(fingerprint, repoDocInfo);
        } else {
            this.repoDocInfoIndex.delete(fingerprint);
        }

    }

    public async writeDocInfo(docInfo: IDocInfo, docMeta: IDocMeta) {

        Preconditions.assertPresent(this.persistenceLayerProvider, 'persistenceLayerProvider');

        const persistenceLayer = this.persistenceLayerProvider.get();

        docMeta.docInfo = new DocInfo(docInfo);

        log.info("Writing out updated DocMeta");

        await persistenceLayer.writeDocMeta(docMeta);

    }

    /**
     * Update the RepoDocInfo object with the given tags.
     */
    public async writeDocInfoTitle(repoDocInfo: RepoDocInfo, title: string) {

        Preconditions.assertPresent(repoDocInfo);
        Preconditions.assertPresent(repoDocInfo.docInfo);
        Preconditions.assertPresent(title);

        repoDocInfo = {...repoDocInfo, title};
        repoDocInfo.docInfo.title = title;

        this.updateFromRepoDocInfo(repoDocInfo.fingerprint, repoDocInfo);

        return this.writeDocInfo(repoDocInfo.docInfo, repoDocInfo.docMeta);

    }

    /**
     * Update the RepoDocInfo object with the given tags.
     */
    public writeDocInfoTags(repoDocInfo: RepoDocInfo, tags: ReadonlyArray<Tag>): IAsyncTransaction<void> {

        const prepare = () => {

            Preconditions.assertPresent(repoDocInfo);
            Preconditions.assertPresent(repoDocInfo.docInfo);
            Preconditions.assertPresent(tags);

            repoDocInfo = {...repoDocInfo, tags: Tags.toMap(tags)};
            repoDocInfo.docInfo.tags = Tags.toMap(tags);

            this.updateFromRepoDocInfo(repoDocInfo.fingerprint, repoDocInfo);

        }

        const commit = () => {
            return this.writeDocInfo(repoDocInfo.docInfo, repoDocInfo.docMeta);
        }

        return {prepare, commit};

    }

    public async deleteDocInfo(repoDocInfo: RepoDocInfo) {

        this.updateFromRepoDocInfo(repoDocInfo.fingerprint);

        const persistenceLayer = this.persistenceLayerProvider.get();

        // delete it from the repo now.
        const docMetaFileRef = DocMetaFileRefs.createFromDocInfo(repoDocInfo.docInfo);

        await persistenceLayer.delete(docMetaFileRef);

    }

}
