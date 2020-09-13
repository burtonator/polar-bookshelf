import {Dictionaries} from "polar-shared/src/util/Dictionaries";
import {Arrays} from "polar-shared/src/util/Arrays";
import {
    RelatedOptionsCalculator,
    ValueAutocompleteOption
} from "../../mui/autocomplete/MUICreatableAutocomplete";
import {Tag, Tags} from "polar-shared/src/tags/Tags";
import {LocalRelatedTagsStore} from "./LocalRelatedTagsStore";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {Debouncers} from "polar-shared/src/util/Debouncers";
import {TagFilters} from "polar-shared/src/tags/TagFilters";

export type TagDocsIndex = {[tag: string]: TagDocs};

export type DocTagsIndex = {[docID: string]: DocTags};

export type TagsIndex = {[tag: string]: Tag};

export interface IRelatedTagsData {

    readonly tagDocsIndex: TagDocsIndex;

    readonly docTagsIndex: DocTagsIndex;

    readonly tagsIndex: TagsIndex;

}

/**
 * Related tag index for in memory related tags computation.  This does not
 * actually implement any form of compressed data structure but instead stores
 * the values directly.  A users personal document tag index won't require
 * much in-memory storage.  Maybe 100k MAX even for massive document
 * collections.
 */
export class RelatedTagsManager {

    /**
     * Maps from the tag to the DocIDs for this tag.
     */
    private tagDocsIndex: TagDocsIndex = {};

    /**
     * Maps from the doc ID to the tags for this document.
     */
    private docTagsIndex: DocTagsIndex = {};

    private tagsIndex: TagsIndex = {};

    private persister: () => void = NULL_FUNCTION;

    constructor(data?: IRelatedTagsData) {

        if (data) {

            // manually created to represent an externalized related tags index
            this.tagDocsIndex = data.tagDocsIndex;
            this.docTagsIndex = data.docTagsIndex;
            this.tagsIndex = data.tagsIndex;

        } else {
            this.persister = Debouncers.create(() => this.persist(), {interval: 5000});
        }

    }

    public tags(): ReadonlyArray<Tag> {
        return Object.values(this.tagsIndex);
    }

    public update(docID: DocID, mutationType: MutationType, tags: ReadonlyArray<Tag>) {

        const updateTagsIndex = () => {
            // FIXME: we're not doing any type of pruning here... so if a
            // tag is deleted it's not removed ...
            for (const tag of tags) {
                this.tagsIndex[tag.id] = tag;
            }
        }

        updateTagsIndex();

        // TODO: the following mutates each of the indexes together and should
        // probably be broken out

        const tagLabels = tags.map(current => current.label)

        for (const tagLabel of tagLabels) {

            const tagDocs = Dictionaries.computeIfAbsent(this.tagDocsIndex, tagLabel, (): TagDocs => {
                return {tag: tagLabel, docs: {}};
            });

            switch (mutationType) {

                case 'set':
                    tagDocs.docs[docID] = true;
                    break;

                case 'delete':
                    delete tagDocs.docs[docID];
                    break;

            }

            const docMeta = Dictionaries.computeIfAbsent(this.docTagsIndex, docID, (): DocTags => {
                return {tags: []};
            });

            docMeta.tags.push(tagLabel);

        }

        this.persister();

    }

    /**
     * Compute related tags for the given tags...
     */
    public compute(tags: TagLiteral[], limit: number = 5): TagHit[] {

        // keep a running index of the hits when computing the related tags.
        const tagHits: {[tag: string]: TagHit} = {};

        const updateHits = (tag: TagLiteral) => {

            // get all the documents that mention this tag

            const indexedTagMeta = this.tagDocsIndex[tag];

            if (! indexedTagMeta) {
                // this tag isn't indexed yet.
                return;
            }

            const relatedDocIDs = indexedTagMeta.docs;

            for (const relatedDocID of Object.keys(relatedDocIDs)) {

                const indexedDocMeta = this.docTagsIndex[relatedDocID];

                const relatedTags = indexedDocMeta.tags;

                for (const relatedTag of relatedTags) {

                    const tagHitMeta = Dictionaries.computeIfAbsent(tagHits, relatedTag, () => {
                        return {tag: relatedTag, hits: 0};
                    });

                    ++tagHitMeta.hits;

                }

            }

        };

        tags = tags.filter(tag => ! tag.startsWith('/'));

        for (const tag of tags) {
            updateHits(tag);
        }

        // we now have all the tags with hits.. so score them and then compute
        // the top N for now.

        const tagHitsDesc = Object.values(tagHits)
            // remove the input tags from the results...
            .filter(current => ! tags.includes(current.tag))
            .filter(current => current.hits > 1)
            // sort the results descending.
            .sort((hit0, hit1) => hit1.hits - hit0.hits);


        return Arrays.head(tagHitsDesc, limit);

    }

    public toRelatedOptionsCalculator(): RelatedOptionsCalculator<Tag> {

        return (options: ReadonlyArray<ValueAutocompleteOption<Tag>>) => {

            function toAutocompleteOption(tag: Tag): ValueAutocompleteOption<Tag> {
                return {
                    id: tag.id,
                    label: tag.label,
                    value: tag
                }
            }

            const tags = options.map(current => current.label);

            return this.compute(tags)
                       .map(current => current.tag)
                       .map(Tags.create)
                       .filter(TagFilters.onlyRegular)
                       .map(toAutocompleteOption)
        };

    }

    public toExternal(): IRelatedTagsData {

        return {
            tagDocsIndex: this.tagDocsIndex,
            docTagsIndex: this.docTagsIndex,
            tagsIndex: this.tagsIndex
        };

    }

    public persist() {
        LocalRelatedTagsStore.write(this.toExternal());
    }

}

export interface DocIDSetMap {
    [id: string]: boolean;
}

export interface TagDocs {
    readonly tag: TagLiteral;
    readonly docs: DocIDSetMap;
}

export interface DocTags {
    tags: string[];
}

export interface TagHit {

    readonly tag: TagLiteral;
    hits: number;

}

export type DocID = string;

/**
 * A literal tag value as a string.
 */
export type TagLiteral = string;

export type MutationType = 'set' | 'delete';
