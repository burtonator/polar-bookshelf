import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {IBlock} from "../../../web/js/notes/store/IBlock";
import {PositionalArrays} from "../../../web/js/notes/store/PositionalArrays";

export namespace MockBlocks {
    import PositionalArray = PositionalArrays.PositionalArray;

    export function create() {

        const now = ISODateTimeStrings.create();

        const nspace = 'ns101';
        const uid = '123';
        const blocks: ReadonlyArray<IBlock> = [
            {
                id: '102',
                nspace, uid,
                parent: undefined,
                parents: [],
                root: '102',
                created: now,
                updated: now,
                content: {
                    type: 'name',
                    data: "World War II"
                },
                items: PositionalArrays.create([
                    '103',
                    '104',
                    '105'
                ]),
                links: {},
                mutation: 0
            },
            {
                id: '103',
                nspace, uid,
                parent: '102',
                parents: ['102'],
                root: '102',
                created: now,
                updated: now,
                content: {
                    type: 'markdown',
                    data: '[Lasted](https://www.example.com) from 1939 to 1945'
                },
                items: {},
                links: {},
                mutation: 0
            },
            {
                id: '104',
                nspace, uid,
                parent: '102',
                parents: ['102'],
                root: '102',
                created: now,
                updated: now,
                content: {
                    type: 'markdown',
                    data: 'Axis Powers: Germany, Italy, Japan'
                },
                items: {},
                links: {},
                mutation: 0
            },
            {
                id: '105',
                nspace, uid,
                parent: '102',
                parents: ['102'],
                root: '102',
                created: now,
                updated: now,
                content: {
                    type: 'markdown',
                    data: 'Allied Powers: United States, United Kingdom, [[Canada]], [[Russia]].'
                },
                links: PositionalArrays.create([
                    {
                        id: '109',
                        text: 'Canada'
                    },
                    {
                        id: '108',
                        text: 'Russia'
                    }
                ]),
                items: PositionalArrays.create([
                    '106'
                ]),
                mutation: 0,
            },
            // {
            //     id: '100',
            //     nspace, uid,
            //     parent: undefined,
            //     created: now,
            //     updated: now,
            //     content: {
            //         type: 'markdown',
            //         data: 'World War II (WWII or WW2), also known as the Second World War, was a global war that lasted from 1939 to 1945. It involved the vast majority of the world\'s countries—including all the great powers—forming two opposing military alliances: the Allies and the Axis.',
            //     },
            //     items: {},
            //     links: {},
            //     mutation: 0,
            // },
            {
                id: '108',
                nspace, uid,
                root: '108',
                parent: undefined,
                parents: [],
                created: now,
                updated: now,
                content: {
                    type: 'name',
                    data: "Russia"
                },
                items: {},
                links: {},
                mutation: 0,
            },
            {
                id: '109',
                nspace, uid,
                root: '109',
                parent: undefined,
                parents: [],
                created: now,
                updated: now,
                content: {
                    type: 'name',
                    data: "Canada"
                },
                items: PositionalArrays.create([
                    '111'
                ]),
                links: {},
                mutation: 0,
            },
            {
                id: '111',
                nspace, uid,
                root: '109',
                parent: '109',
                parents: ['109'],
                created: now,
                updated: now,
                content: {
                    type: 'markdown',
                    data: 'Canada is north of the United States'
                },
                items: {},
                links: {},
                mutation: 0,
            },
            {
                id: '106',
                nspace, uid,
                parent: '105',
                root: '102',
                parents: ['102', '105'],
                created: now,
                updated: now,
                content: {
                    type: 'markdown',
                    data: 'Lead by Franklin D. Roosevelt, [[Winston Churchill]], and Joseph Stalin '
                },
                items: {},
                links: PositionalArrays.create([
                    {
                        id: '112',
                        text: 'Winston Churchill'
                    }
                ]),
                mutation: 0,
            },
            {
                id: '107',
                nspace, uid,
                parent: undefined,
                parents: [],
                root: '107',
                created: now,
                updated: now,
                content: {
                    type: 'name',
                    data: "Germany"
                },
                links: {},
                items: PositionalArrays.create([
                    '110'
                ]),
                mutation: 0,
            },
            {
                id: '110',
                nspace, uid,
                parent: '107',
                parents: ['107'],
                root: '101',
                created: now,
                updated: now,
                content: {
                    type: 'markdown',
                    data: 'Germany Germany (German: Deutschland, German pronunciation: [ˈdɔʏtʃlant]), officially the Federal Republic of Germany (German: Bundesrepublik Deutschland, About this soundlisten),[e] is a country in Central and Western Europe and one of the major participants of [[World War II]]'
                },
                links: PositionalArrays.create([
                    {
                        id: '102',
                        text: 'World War II'
                    }
                ]),
                items: {},
                mutation: 0,
            },
            {
                id: '112',
                nspace, uid,
                parent: undefined,
                parents: [],
                root: '112',
                created: now,
                updated: now,
                content: {
                    type: 'name',
                    data: 'Winston Churchill'
                },
                links: {},
                items: {},
                mutation: 0,
            }

        ];
        return blocks;
    }
}


