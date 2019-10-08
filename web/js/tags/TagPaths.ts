export class TagPaths {

    public static createPathEntries(path: string): ReadonlyArray<PathEntry> {

        const paths = path.split("/");

        let buff: string = '';

        const result: PathEntry[] = [];

        let parent: PathEntry | undefined;

        for (const current of paths) {

            // const parent: string | undefined  = buff === '' ? undefined : buff;

            if (buff === '/') {
                buff = buff + current;
            } else {
                buff = buff + '/' + current;
            }

            const toParent = (): RawPathEntry | undefined => {

                if (parent) {

                    return {
                        path: parent.path,
                        basename: parent.basename
                    };

                }

                return undefined;

            };

            const pathEntry: PathEntry = {
                path: buff,
                basename: current,
                parent: toParent()
            };

            result.push(pathEntry);

            parent = pathEntry;

        }

        return result;

    }

}

export interface RawPathEntry {
    readonly path: string;
    readonly basename: string;
}

export interface PathEntry extends RawPathEntry {
    readonly parent: RawPathEntry | undefined;
}
