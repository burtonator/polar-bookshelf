/**
 * A facade on top of DocMeta for view in the UI
 */
import {RepoDocInfo} from './RepoDocInfo';
import {RepoAnnotation} from './RepoAnnotation';

export interface RepoDocMeta {

    readonly repoDocInfo: RepoDocInfo;

    readonly repoAnnotations: ReadonlyArray<RepoAnnotation>;

}
