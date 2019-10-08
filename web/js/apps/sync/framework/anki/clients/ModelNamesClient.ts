import {AnkiConnectFetch} from '../AnkiConnectFetch';
import * as TypeMoq from "typemoq";

/*
  modelNames

 Gets the complete list of model names for the current user.

 Sample request:

 {
    "action": "modelNames",
    "version": 6
}
 Sample result:

 {
    "result": ["Basic", "Basic (and reversed card)"],
    "error": null
}
 */
export class ModelNamesClient implements IModelNamesClient {

    public async execute(): Promise<string[]> {

        const body = {
            action: "modelNames",
            version: 6,
        };

        const init = { method: 'POST', body: JSON.stringify(body) };

        return <string[]> await AnkiConnectFetch.fetch(init);

    }

    /**
     * Create a mock that returns the given result.
     */
    public static createMock(result: string[]) {
        const client = TypeMoq.Mock.ofType<IModelNamesClient>();
        client.setup(x => x.execute()).returns(() => Promise.resolve(result));
        return client.object;
    }

}

export interface IModelNamesClient {

    execute(): Promise<string[]>;

}
