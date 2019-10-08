import {AnkiConnectFetch} from '../AnkiConnectFetch';
import * as TypeMoq from "typemoq";

/**
 *
 * Modify the fields of an exist note.
 *
 * Sample request:
 *
 * {
 *    "action": "updateNoteFields",
 *    "version": 6,
 *    "params": {
 *        "note": {
 *            "id": 1514547547030,
 *            "fields": {
 *                "Front": "new front content",
 *                "Back": "new back content"
 *            }
 *        }
 *    }
 *}
 * Sample result:
 *
 * {
 *    "result": null,
 *    "error": null
 *}
 */
export class UpdateNoteFieldsClient implements IUpdateNoteFieldsClient {

    public async execute(updateNote: UpdateNote): Promise<void> {

        const body = {
            action: "updateNoteFields",
            version: 6,
            params: {
                note: updateNote
            }
        };

        const init = { method: 'POST', body: JSON.stringify(body) };

        await AnkiConnectFetch.fetch(init);

    }

    /**
     * Create a mock that returns the given result.
     */
    public static createMock() {
        const client = TypeMoq.Mock.ofType<IUpdateNoteFieldsClient>();
        client.setup(x => x.execute(TypeMoq.It.isAny())).returns(() => Promise.resolve());
        return client.object;
    }

}

export interface IUpdateNoteFieldsClient {

    execute(updateNote: UpdateNote): Promise<void>;

}

export interface UpdateNote {

    readonly id: number;
    readonly fields: {[name: string]: string};

}
