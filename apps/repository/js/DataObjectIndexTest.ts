import {Tag} from '../../../web/js/tags/Tags';
import {DataObjectIndex} from './DataObjectIndex';
import {Tags} from '../../../web/js/tags/Tags';
import {assertJSON} from '../../../web/js/test/Assertions';

describe('DataObjectIndex', function() {

    it("basic", function() {

        const index = new DataObjectIndex<Person>((p?: Person) => p!.tags);

        index.add('alice', {name: 'alice', tags: [Tags.create('nice'), Tags.create('happy')]});
        index.add('bob', {name: 'bob', tags: [Tags.create('mean'), Tags.create('bad')]});

        assertJSON(index.values(), [
            {
                "name": "alice",
                "tags": [
                    {
                        "id": "nice",
                        "label": "nice"
                    },
                    {
                        "id": "happy",
                        "label": "happy"
                    }
                ]
            },
            {
                "name": "bob",
                "tags": [
                    {
                        "id": "mean",
                        "label": "mean"
                    },
                    {
                        "id": "bad",
                        "label": "bad"
                    }
                ]
            }
        ]);

        assertJSON(index.toTagDescriptors(), [
               {
                   "id": "nice",
                   "label": "nice",
                   "count": 1
               },
               {
                   "id": "happy",
                   "label": "happy",
                   "count": 1
               },
               {
                   "id": "mean",
                   "label": "mean",
                   "count": 1
               },
               {
                   "id": "bad",
                   "label": "bad",
                   "count": 1
               }
           ]);

        index.remove('bob');

        assertJSON(index.toTagDescriptors(), [
                       {
                           "id": "nice",
                           "label": "nice",
                           "count": 1
                       },
                       {
                           "id": "happy",
                           "label": "happy",
                           "count": 1
                       }
                   ]
        );

    });

});


interface Person {
    readonly name: string;
    readonly tags: readonly Tag[];
}
