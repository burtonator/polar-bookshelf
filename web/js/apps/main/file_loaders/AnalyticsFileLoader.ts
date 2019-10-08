import {FileLoader} from './FileLoader';
import {LoadedFile} from './LoadedFile';

export class AnalyticsFileLoader extends FileLoader {

    private readonly delegate: FileLoader;

    constructor(delegate: FileLoader) {
        super();
        this.delegate = delegate;
    }

    public registerForLoad(path: string): Promise<LoadedFile> {

        // TODO: remove this in the future as we're not longer using the
        // main proce analytics.

        return this.delegate.registerForLoad(path);

    }

}
