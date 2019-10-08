import {AnkiConnectFetch} from '../AnkiConnectFetch';
import * as TypeMoq from "typemoq";
import {NoteDescriptor} from '../NoteDescriptor';

/**
 *
 * storeMediaFile
 *
 * Stores a file with the specified base64-encoded contents inside the media folder. To prevent Anki from removing files not used by any cards (e.g. for configuration files), prefix the filename with an underscore. These files are still synchronized to AnkiWeb.
 *
 * Sample request:
 *
 * {
 *    "action": "storeMediaFile",
 *    "version": 6,
 *    "params": {
 *        "filename": "_hello.txt",
 *        "data": "SGVsbG8sIHdvcmxkIQ=="
 *    }
 * }
 * Sample result:
 *
 * {
 *    "result": null,
 *    "error": null
 *}
 * Content of _hello.txt:
 *
 * Hello world!
 *
 * *
 */
export class StoreMediaFileClient implements IStoreMediaFileClient {

    public async execute(filename: string, data: string): Promise<void> {

        const body = {
            action: "storeMediaFile",
            version: 6,
            params: {
                filename, data
            }
        };

        const init = { method: 'POST', body: JSON.stringify(body) };

        await AnkiConnectFetch.fetch(init);

    }

    /**
     * Create a mock that returns the given result.
     */
    public static createMock() {
        const client = TypeMoq.Mock.ofType<IStoreMediaFileClient>();
        client.setup(x => x.execute(TypeMoq.It.isAny(), TypeMoq.It.isAny())).returns(() => Promise.resolve());
        return client.object;
    }

}

export interface IStoreMediaFileClient {

    execute(filename: string, data: string): Promise<void>;

}

export interface MediaFile {

    readonly filename: string;

    /**
     * Base64 binary data for the media.
     */
    readonly data: string;

}
