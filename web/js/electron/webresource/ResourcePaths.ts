
import {app, remote} from 'electron';
import path from 'path';
import fs from 'fs';
import {isPresent} from '../../Preconditions';

const USE_FILE_URL = true;

/**
 * Given a relative path, return a full path to a local app resource.
 *
 * Each module has a unique __dirname so with this mechanism we can reliably
 * find an path to a file as if we were in the root of the webapp.
 *
 */
export class ResourcePaths {

    /**
     * Create a full absolute path from a relative path.
     */
    public static absoluteFromRelativePath(relativePath: string) {

        // TODO: sometimes appPath is an ASAR file and that really confuses
        // us and we're going to need a strategy to handle that situation.

        const baseDirs = ResourcePaths.getBaseDirs();

        for (const baseDir of baseDirs) {

            const absolutePath = path.resolve(baseDir, relativePath);

            try {

                // We use readFileSync here because we need to we need to peek into
                // .asar files which do not support exists but DO support reading
                // the file.  If this fails we will get an exception about not
                // finding the file.

                fs.readFileSync(absolutePath);
                return absolutePath;

            } catch (e) {
                // we know this happens because I can't tests for file exists
                // since .asar files have to be read to check for existence.
            }

        }

        throw new Error(`No file found for ${relativePath} in baseDirs: ` + JSON.stringify(baseDirs));

    }

    /**
     * Build a full resource URL from a given relative URL path.
     *
     * @param relativeURL
     */
    public static resourceURLFromRelativeURL(relativeURL: string,
                                             useFileURL: boolean = USE_FILE_URL): string {

        let relativePath = relativeURL;
        let queryData = "";

        if (relativeURL.indexOf("?") !== -1) {
            relativePath = relativeURL.substring(0, relativeURL.indexOf("?"));
            queryData = relativeURL.substring(relativeURL.indexOf("?"));
        }

        if (useFileURL) {

            const absolutePath = ResourcePaths.absoluteFromRelativePath(relativePath);
            return 'file://' + absolutePath + queryData;

        } else {
            return "http://localhost:8500" + relativeURL;
        }

    }

    /**
     * Get the basedir of the current webapp.
     */
    protected static getBaseDirs(): string[] {

        const baseDirs: string[] = [];

        if (! isPresent(app)) {
            baseDirs.push(remote.app.getAppPath());
        } else {
            baseDirs.push(app.getAppPath());
        }

        baseDirs.push(process.cwd());

        return baseDirs;

    }

}

export class AppPathException extends Error {

}
