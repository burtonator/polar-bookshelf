import {RepoDocInfo} from './RepoDocInfo';
import {DocRepoTableColumns} from './doc_repo/DocRepoTableColumns';

export interface AppState {

    // docs: DocDetail[];

    data: RepoDocInfo[];
    columns: DocRepoTableColumns;
    selected?: number;
}

