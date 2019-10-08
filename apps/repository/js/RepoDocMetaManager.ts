import {Logger} from 'polar-shared/src/logger/Logger';
import {DocInfo} from '../../../web/js/metadata/DocInfo';
import {IDocInfo} from 'polar-shared/src/metadata/IDocInfo';
import {RepoDocInfo} from './RepoDocInfo';
import {Tags} from '../../../web/js/tags/Tags';
import {Preconditions} from 'polar-shared/src/Preconditions';
import {TagsDB} from './TagsDB';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {DocMetaFileRefs} from '../../../web/js/datastore/DocMetaRef';
import {PersistenceLayer} from '../../../web/js/datastore/PersistenceLayer';
import {IProvider} from 'polar-shared/src/util/Providers';
import {RepoAnnotation} from './RepoAnnotation';
import {RepoDocMeta} from './RepoDocMeta';
import {RelatedTags} from '../../../web/js/tags/related/RelatedTags';
import {SetArrays} from 'polar-shared/src/util/SetArrays';
import {Tag} from '../../../web/js/tags/Tags';
import {DataObjectIndex} from './DataObjectIndex';
import {RepoAnnotations} from "./RepoAnnotations";
import {RepoDocInfos} from "./RepoDocInfos";

const log = Logger.create();

export class RepoAnnotationDataObjectIndex extends DataObjectIndex<RepoAnnotation> {

    constructor() {
        super((repoAnnotation?: RepoAnnotation) => RepoAnnotations.toTags(repoAnnotation) );
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

    public readonly repoAnnotationIndex: RepoAnnotationDataObjectIndex = new RepoAnnotationDataObjectIndex();

    public readonly tagsDB = new TagsDB();

    public readonly relatedTags = new RelatedTags();

    private readonly persistenceLayerProvider: IProvider<PersistenceLayer>;

    constructor(persistenceLayerProvider: IProvider<PersistenceLayer>) {
        Preconditions.assertPresent(persistenceLayerProvider, 'persistenceLayerProvider');
        this.persistenceLayerProvider = persistenceLayerProvider;
        this.init();
    }

    public updateFromRepoDocMeta(fingerprint: string, repoDocMeta?: RepoDocMeta) {

        if (repoDocMeta) {

            this.repoDocInfoIndex.add(repoDocMeta.repoDocInfo.fingerprint, repoDocMeta.repoDocInfo);

            this.updateTagsDB(repoDocMeta.repoDocInfo);

            this.relatedTags.update(fingerprint, 'set', ...Object.values(repoDocMeta.repoDocInfo.tags || {})
                                                                 .map(current => current.label));

            const updateAnnotations = () => {

                const deleteOrphaned = () => {

                    const currentAnnotationsIDs = Object.values(this.repoAnnotationIndex)
                        .filter(current => current.fingerprint === repoDocMeta.repoDocInfo.fingerprint)
                        .map(current => current.id);

                    const newAnnotationIDs = repoDocMeta.repoAnnotations
                        .map(current => current.id);

                    const deleteIDs = SetArrays.difference(currentAnnotationsIDs, newAnnotationIDs);

                    for (const deleteID of deleteIDs) {
                        this.repoAnnotationIndex.remove(deleteID);
                    }

                };

                const updateExisting = () => {

                    for (const repoAnnotation of repoDocMeta.repoAnnotations) {
                        this.repoAnnotationIndex.add(repoAnnotation.id, repoAnnotation);
                    }

                };

                deleteOrphaned();
                updateExisting();

            };

            updateAnnotations();

        } else {

            const deleteOrphanedAnnotations = () => {

                // now delete stale repo annotations.
                for (const repoAnnotation of Object.values(this.repoAnnotationIndex)) {

                    if (repoAnnotation.fingerprint === fingerprint) {
                        this.repoAnnotationIndex.remove(repoAnnotation.id);
                    }
                }

            };

            const deleteDoc = () => {
                this.repoDocInfoIndex.remove(fingerprint);
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

        if (repoDocInfo) {
            this.repoDocInfoIndex.add(fingerprint, repoDocInfo);
            this.updateTagsDB(repoDocInfo);
        } else {
            this.repoDocInfoIndex.remove(fingerprint);
        }

    }

    private updateTagsDB(...repoDocInfos: RepoDocInfo[]) {

        for (const repoDocInfo of repoDocInfos) {

            // update the tags data.
            Optional.of(repoDocInfo.docInfo.tags)
                .map(tags => {
                    this.tagsDB.register(...Object.values(tags));
                });

        }

    }

    /**
     * Sync the docInfo to disk.
     *
     */
    public async writeDocInfo(docInfo: IDocInfo) {

        Preconditions.assertPresent(this.persistenceLayerProvider, 'persistenceLayerProvider');

        const persistenceLayer = this.persistenceLayerProvider.get();

        if (await persistenceLayer.contains(docInfo.fingerprint)) {

            const docMeta = await persistenceLayer.getDocMeta(docInfo.fingerprint);

            if (docMeta === undefined) {
                log.warn("Unable to find DocMeta for: ", docInfo.fingerprint);
                return;
            }

            docMeta.docInfo = new DocInfo(docInfo);

            log.info("Writing out updated DocMeta");

            await persistenceLayer.writeDocMeta(docMeta);

        }

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

        return this.writeDocInfo(repoDocInfo.docInfo);

    }

    /**
     * Update the RepoDocInfo object with the given tags.
     */
    public async writeDocInfoTags(repoDocInfo: RepoDocInfo, tags: ReadonlyArray<Tag>) {

        Preconditions.assertPresent(repoDocInfo);
        Preconditions.assertPresent(repoDocInfo.docInfo);
        Preconditions.assertPresent(tags);

        repoDocInfo = {...repoDocInfo, tags: Tags.toMap(tags)};
        repoDocInfo.docInfo.tags = Tags.toMap(tags);

        this.updateFromRepoDocInfo(repoDocInfo.fingerprint, repoDocInfo);

        return this.writeDocInfo(repoDocInfo.docInfo);

    }

    public async deleteDocInfo(repoDocInfo: RepoDocInfo) {

        this.updateFromRepoDocInfo(repoDocInfo.fingerprint);

        const persistenceLayer = this.persistenceLayerProvider.get();

        // delete it from the repo now.
        const docMetaFileRef = DocMetaFileRefs.createFromDocInfo(repoDocInfo.docInfo);

        await persistenceLayer.delete(docMetaFileRef);

    }

    private init() {
        // TODO: is this even needed anymore?

        for (const repoDocInfo of this.repoDocInfoIndex.values()) {
            this.updateTagsDB(repoDocInfo);
        }

    }


}
