import {RendererAnalytics} from '../../../../web/js/ga/RendererAnalytics';
import {Tags} from '../../../../web/js/tags/Tags';
import {isPresent} from 'polar-shared/src/Preconditions';
import {SetArrays} from 'polar-shared/src/util/SetArrays';
import {Provider} from 'polar-shared/src/util/Providers';
import {RepoAnnotation} from '../RepoAnnotation';
import {RepoAnnotations} from '../RepoAnnotations';
import {AnnotationRepoFilters} from './AnnotationRepoFiltersHandler';
import {DefaultAnnotationRepoFilters} from './AnnotationRepoFiltersHandler';
import {TagMatcherFactory} from '../../../../web/js/tags/TagMatcher';
import {Strings} from "polar-shared/src/util/Strings";

/**
 * The actual engine that applies the filters once they are updated.
 */
export class AnnotationRepoFilterEngine {

    private filters: AnnotationRepoFilters = new DefaultAnnotationRepoFilters();

    constructor(private repoAnnotationsProvider: Provider<ReadonlyArray<RepoAnnotation>>,
                private onUpdated: UpdatedCallback) {

    }

    public onFiltered(filters: AnnotationRepoFilters) {
        this.filters = filters;
        this.doUpdate();
    }

    /**
     * Called when the data in the provider has been updated and we should
     * re-apply the filters and call onRefershed again.
     */
    public onProviderUpdated() {
        this.doUpdate();
    }

    private doUpdate() {
        const repoAnnotations = this.repoAnnotationsProvider();
        this.onUpdated(this.filter(repoAnnotations));
    }

    private filter(repoAnnotations: ReadonlyArray<RepoAnnotation>): ReadonlyArray<RepoAnnotation> {

        // always filter valid to make sure nothing corrupts the state.  Some
        // other bug might inject a problem otherwise.
        repoAnnotations = this.doFilterValid(repoAnnotations);
        repoAnnotations = this.doFilterByText(repoAnnotations);
        // repoAnnotations = this.doFilterFlagged(repoAnnotations);
        // repoAnnotations = this.doFilterArchived(repoAnnotations);
        repoAnnotations = this.doFilterByTags(repoAnnotations);

        return repoAnnotations;

    }

    private doFilterValid(repoAnnotations: ReadonlyArray<RepoAnnotation>): ReadonlyArray<RepoAnnotation> {
        return repoAnnotations.filter(current => RepoAnnotations.isValid(current));
    }

    private doFilterByText(repoAnnotations: ReadonlyArray<RepoAnnotation>): ReadonlyArray<RepoAnnotation> {

        if (! Strings.empty(this.filters.text)) {

            RendererAnalytics.event({category: 'annotation-view', action: 'filter-by-text'});

            return repoAnnotations
                .filter(current => isPresent(current.text))
                .filter(current => current.text!.toLowerCase().indexOf(this.filters.text.toLowerCase()) >= 0);

        }

        return repoAnnotations;

    }

    private doFilterFlagged(repoAnnotations: ReadonlyArray<RepoAnnotation>): ReadonlyArray<RepoAnnotation> {

        if (this.filters.flagged) {
            return repoAnnotations.filter(current => current.docInfo.flagged);
        }

        return repoAnnotations;

    }

    private doFilterArchived(repoAnnotations: ReadonlyArray<RepoAnnotation>): ReadonlyArray<RepoAnnotation> {

        if (! this.filters.archived) {
            return repoAnnotations.filter(current => !current.docInfo.archived);
        }

        return repoAnnotations;

    }

    private doFilterByTags(repoAnnotations: ReadonlyArray<RepoAnnotation>): ReadonlyArray<RepoAnnotation> {

        const tags = this.filters.filteredTags.get()
            .filter(current => current.id !== '/');

        const tagMatcherFactory = new TagMatcherFactory(tags);

        if (tags.length === 0) {
            // we're done as there are no tags.
            return repoAnnotations;
        }

        return tagMatcherFactory.filter(repoAnnotations,
                                        current => Object.values(current.docInfo.tags || {}));

    }

}

export type UpdatedCallback = (repoAnnotations: ReadonlyArray<RepoAnnotation>) => void;

