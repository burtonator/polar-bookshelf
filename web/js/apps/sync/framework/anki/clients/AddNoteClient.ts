import {AnkiConnectFetch} from '../AnkiConnectFetch';
import * as TypeMoq from "typemoq";
import {NoteDescriptor} from '../NoteDescriptor';

/**
 * addNote
 *
 * Creates a note using the given deck and model, with the provided field values
 * and tags. Returns the identifier of the created note created on success, and
 * null on failure.
 *
 * AnkiConnect can download audio files and embed them in newly created notes.
 * The corresponding audio note member is optional and can be omitted. If you
 * choose to include it, the url and filename fields must be also defined. The
 * skipHash field can be optionally provided to skip the inclusion of downloaded
 * files with an MD5 hash that matches the provided value. This is useful for
 * avoiding the saving of error pages and stub files. The fields member is a
 * list of fields that should play audio when the card is displayed in Anki.
 *
 * Sample request:
 *
 * {
 *    "action": "addNote",
 *    "version": 6,
 *    "params": {
 *        "note": {
 *            "deckName": "Default",
 *            "modelName": "Basic",
 *            "fields": {
 *                "Front": "front content",
 *                "Back": "back content"
 *            },
 *            "tags": [
 *                "yomichan"
 *            ],
 *            "audio": {
 *                "url": "https://assets.languagepod101.com/dictionary/japanese/audiomp3.php?kanji=猫&kana=ねこ",
 *                "filename": "yomichan_ねこ_猫.mp3",
 *                "skipHash": "7e2c2f954ef6051373ba916f000168dc",
 *                "fields": [
 *                    "Front"
 *                ]
 *            }
 *        }
 *    }
 *}
 *
 *
 * {
 *    "result": 1496198395707,
 *    "error": null
 * }
 *
 */
export class AddNoteClient implements IAddNoteClient {

    public async execute(note: NoteDescriptor): Promise<number> {

        const body = {
            action: "addNote",
            version: 6,
            params: {
                note
            }
        };

        const init = { method: 'POST', body: JSON.stringify(body) };

        return <number> await AnkiConnectFetch.fetch(init);

    }

    /**
     * Create a mock that returns the given result.
     */
    public static createMock(result: number) {
        const client = TypeMoq.Mock.ofType<IAddNoteClient>();
        client.setup(x => x.execute(TypeMoq.It.isAny())).returns(() => Promise.resolve(result));
        return client.object;
    }

}

export interface IAddNoteClient {

    execute(notes: NoteDescriptor): Promise<number>;

}
