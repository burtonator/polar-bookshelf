import {AnkiConnectFetch} from '../AnkiConnectFetch';
import * as TypeMoq from "typemoq";

export class DeckNamesAndIdsClient implements IDeckNamesAndIdsClient {

    public async execute(): Promise<DeckNamesAndIds> {

        const body = {
            action: "deckNamesAndIds",
            version: 6
        };

        const init = { method: 'POST', body: JSON.stringify(body) };

        return <DeckNamesAndIds> await AnkiConnectFetch.fetch(init);

    }

    /**
     * Create a mock that returns the given result.
     */
    public static createMock(result: DeckNamesAndIds) {
        const client = TypeMoq.Mock.ofType<IDeckNamesAndIdsClient>();
        client.setup(x => x.execute()).returns(() => Promise.resolve(result));
        return client.object;
    }

}

export interface DeckNamesAndIds {[deck: string]: number}

export interface IDeckNamesAndIdsClient {

    execute(): Promise<DeckNamesAndIds>;

}
