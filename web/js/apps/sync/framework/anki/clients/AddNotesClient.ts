import {AnkiConnectFetch} from '../AnkiConnectFetch';
import * as TypeMoq from "typemoq";

export class AddNotesClient implements IAddNotesClient {

    public async execute(notes: Note[]): Promise<number[]> {

        const body = {
            action: "addNotes",
            version: 6,
            params: {
                notes
            }
        };

        const init = { method: 'POST', body: JSON.stringify(body) };

        return <number[]> await AnkiConnectFetch.fetch(init);

    }

    /**
     * Create a mock that returns the given result.
     */
    public static createMock(result: number[]) {
        const client = TypeMoq.Mock.ofType<IAddNotesClient>();
        client.setup(x => x.execute(TypeMoq.It.isAny())).returns(() => Promise.resolve(result));
        return client.object;
    }

}

export interface Note {

    readonly deckName: string;
    readonly modelName: string;
    readonly fields: {[name: string]: string};
    readonly tags: string[];

}

export interface IAddNotesClient {

    execute(notes: Note[]): Promise<number[]>;

}
