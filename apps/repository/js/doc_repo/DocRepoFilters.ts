import {RepoDocInfo} from '../RepoDocInfo';
import {RepoDocInfos} from '../RepoDocInfos';
import {RendererAnalytics} from '../../../../web/js/ga/RendererAnalytics';
import {FilteredTags} from '../FilteredTags';
import {Provider} from 'polar-shared/src/util/Providers';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {Tag} from '../../../../web/js/tags/Tags';
import {TagMatcherFactory} from '../../../../web/js/tags/TagMatcher';
import {Strings} from "polar-shared/src/util/Strings";

/**
 * Keeps track of the doc index so that we can filter it in the UI and have
 * the filter events send to the index and then update component state directly.
 */
export class DocRepoFilters {

    public readonly filters: Filters;

    constructor(private onRefreshed: RefreshedCallback,
                private repoDocInfosProvider: Provider<ReadonlyArray<RepoDocInfo>>) {

        this.filters = {
            flagged: false,
            archived: false,
            title: "",
            filteredTags: new FilteredTags()
        };

    }

    public onToggleFlaggedOnly(value: boolean) {
        this.filters.flagged = value;
        this.refresh();
    }

    public onToggleFilterArchived(value: boolean) {
        this.filters.archived = value;
        this.refresh();
    }

    public onFilterByTitle(title: string) {
        this.filters.title = title;
        this.refresh();
    }

    public onTagged(tags: Tag[]) {

        const isRootTag = () => {
            return tags.length === 1 && tags[0].id === '/';
        };

        if (isRootTag()) {
            this.filters.filteredTags.set([]);
        } else {
            this.filters.filteredTags.set(tags);
        }

        this.refresh();
    }

    public refresh() {
        this.onRefreshed(this.filter(this.repoDocInfosProvider()));
    }

    private filter(repoDocInfos: ReadonlyArray<RepoDocInfo>): ReadonlyArray<RepoDocInfo> {

        // always filter valid to make sure nothing corrupts the state.  Some
        // other bug might inject a problem otherwise.
        repoDocInfos = this.doFilterValid(repoDocInfos);
        repoDocInfos = this.doFilterByTitle(repoDocInfos);
        repoDocInfos = this.doFilterFlagged(repoDocInfos);
        repoDocInfos = this.doFilterArchived(repoDocInfos);
        repoDocInfos = this.doFilterByTags(repoDocInfos);

        return repoDocInfos;

    }

    private doFilterValid(repoDocs: ReadonlyArray<RepoDocInfo>): ReadonlyArray<RepoDocInfo> {
        return repoDocs.filter(current => RepoDocInfos.isValid(current));
    }

    private doFilterByTitle(repoDocs: ReadonlyArray<RepoDocInfo>): ReadonlyArray<RepoDocInfo> {

        if (! Strings.empty(this.filters.title)) {

            // the string we are searching for
            const toSTR = (value: string | undefined): string => {

                return Optional.of(value)
                    .getOrElse("")
                    .toLowerCase();

            };

            const searchString = toSTR(this.filters.title);

            return repoDocs.filter(current => {

                const title = toSTR(current.title);
                const filename = toSTR(current.filename);

                return title.includes(searchString) || filename.includes(searchString);

            });

        }

        return repoDocs;

    }

    private doFilterFlagged(repoDocs: ReadonlyArray<RepoDocInfo>): ReadonlyArray<RepoDocInfo> {

        if (this.filters.flagged) {
            return repoDocs.filter(current => current.flagged);
        }

        return repoDocs;

    }

    private doFilterArchived(repoDocs: ReadonlyArray<RepoDocInfo>): ReadonlyArray<RepoDocInfo> {

        if (! this.filters.archived) {
            return repoDocs.filter(current => !current.archived);
        }

        return repoDocs;

    }

    private doFilterByTags(repoDocs: ReadonlyArray<RepoDocInfo>): ReadonlyArray<RepoDocInfo>  {

        RendererAnalytics.event({category: 'user', action: 'filter-by-tags'});

        const tags = this.filters.filteredTags.get()
            .filter(current => current.id !== '/');

        const tagMatcherFactory = new TagMatcherFactory(tags);

        if (tags.length === 0) {
            // we're done as there are no tags.
            return repoDocs;
        }

        return tagMatcherFactory.filter(repoDocs,
                                        current => Object.values(current.docInfo.tags || {}));

    }

}

interface Filters {

    /**
     * When true, only show flagged documents.
     */
    flagged: boolean;

    /**
     *  When true, show both archived and non-archived documents.
     */
    archived: boolean;

    title: string;

    filteredTags: FilteredTags;

}

export type RefreshedCallback = (repoDocInfos: ReadonlyArray<RepoDocInfo>) => void;

