import {Platforms} from "../../util/Platforms";
import {FilePaths} from 'polar-shared/src/util/FilePaths';
import os from "os";
import {Aborter, Aborters, Files} from "polar-shared/src/util/Files";

/**
 *
 */
export class RepositoryDocLoaders {

    /**
     * Based on the platform, compute a list of directories where we should
     * attempt to load files (Desktop, Documents, and Zotero and other apps).
     */
    public static async computeLoadPaths(): Promise<string[]> {

        const platform = Platforms.get();

        const pathMetas = [
            await this.pathMeta(FilePaths.resolve(os.homedir(), 'Downloads')),
            await this.pathMeta(FilePaths.resolve(os.homedir(), 'Documents')),
            await this.pathMeta(FilePaths.resolve(os.homedir(), 'Zotero'))
        ];

        return pathMetas.filter(current => current.exists)
                        .map(current => current.path);

    }

    public static async computeDocumentsForLoad(paths: string[],
                                                listener: RecursiveProgress,
                                                aborter: Aborter = Aborters.maxTime()) {

        const docPaths: string[] = [];

        for (const path of paths) {

            await Files.recursively(path, async docPath => {

                if (FilePaths.hasExtension(docPath, "pdf")) {
                    docPaths.push(docPath);
                }

            }, aborter);

        }

        return docPaths;

    }

    private static async pathMeta(path: string): Promise<PathMeta> {

        return {
            path,
            exists: await Files.existsAsync(path)
        };

    }

}

export interface RecursiveProgress {

    /**
     * The document paths that we've already found.
     */
    readonly docPaths: string[];

    /**
     * The current path we're evaluating.
     */
    readonly path: string;

}

export type RecursiveProgressListener = (progress: RecursiveProgress) => void;

interface PathMeta {
    readonly path: string;
    readonly exists: boolean;
}
