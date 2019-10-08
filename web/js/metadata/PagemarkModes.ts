import {PagemarkMode} from "polar-shared/src/metadata/PagemarkMode";

export class PagemarkModes {

    public static toDescriptors(): ReadonlyArray<PagemarkModeDescriptor> {

        return Object.keys(PagemarkMode)
            .map(name => {
                return {
                    name,
                    title: name.replace(/[-_]+/g, ' ').toLowerCase(),
                    key: name.replace(/[-_]+/g, '-').toLowerCase(),
                };
            });

    }

}

export interface PagemarkModeDescriptor {

    /**
     * Title for this mode (table of contents, read, pre read, etc)
     */
    readonly title: string;

    /**
     * The original name for this mode.  TABLE_OF_CONTENTS
     */
    readonly name: string;

    /**
     * A key for this descriptor like 'table-of-contents'.
     */
    readonly key: string;

}
