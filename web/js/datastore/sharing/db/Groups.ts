import {Firestore} from '../../../firebase/Firestore';
import {ISODateTimeString} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {GroupIDStr} from '../../Datastore';
import {UserIDStr} from './Profiles';
import {Hashcodes} from 'polar-shared/src/util/Hashcodes';
import {ExternalLink} from "../rpc/GroupProvisions";
import {Clause, Collections, OrderByClause} from "./Collections";
import {PlainTextStr, URLStr} from "polar-shared/src/util/Strings";
import {Arrays} from "polar-shared/src/util/Arrays";

const HASHCODE_LEN = 20;

export class Groups {

    public static readonly COLLECTION = 'group';

    public static createIDForKey(uid: UserIDStr, key: string) {
        return Hashcodes.createID({key, uid}, HASHCODE_LEN);
    }

    public static async get(id: GroupIDStr): Promise<Group | undefined> {
        const firestore = await Firestore.getInstance();
        const ref = firestore.collection(this.COLLECTION).doc(id);
        const doc = await ref.get();
        return <Group> doc.data();
    }

    // TODO: get and getAll could be refactored to use Arrays.first and an empty
    // array when the item is missing.

    public  static async getAll(identifiers: ReadonlyArray<GroupIDStr>): Promise<ReadonlyArray<Group>> {
        const promises = identifiers.map(id => this.get(id));
        const resolved = await Promise.all(promises);
        return Arrays.onlyDefined(resolved);
    }

    public static async getByName(name: string): Promise<Group | undefined> {

        // protected and private groups can not have names and these must be public.
        const clauses: ReadonlyArray<Clause> = [
            ['visibility', '==' , 'public'],
            ['name', '==', name]
        ];

        return Collections.getByFieldValues(this.COLLECTION, clauses);

    }

    public static async executeSearchWithTags(tags: ReadonlyArray<TagStr>): Promise<ReadonlyArray<Group>> {

        // INDEXES NEEDED
        //
        // visibility, lang, tags, nrMembers
        // visibility, tags, nrMembers

        // search by tag and by number of members descending

        // no paging yet.. just top groups to get this working and off the groupnd

        const visibilityClauses: ReadonlyArray<Clause> = [
            ['visibility', '==' , 'public']
        ];

        const tagClauses: ReadonlyArray<Clause>
            = tags.map(current => ['tags', 'array-contains', current]);

        const clauses: ReadonlyArray<Clause> = [...visibilityClauses, ...tagClauses];

        const orderBy: ReadonlyArray<OrderByClause> = [
            ['nrMembers', 'desc']
        ];

        const limit = 50;

        return await Collections.list(this.COLLECTION,  clauses, {orderBy, limit});

    }


    public static async topGroups(): Promise<ReadonlyArray<Group>> {

        // INDEXES NEEDED
        //
        // visibility, lang, tags, nrMembers
        // visibility, tags, nrMembers

        // search by tag and by number of members descending

        // no paging yet.. just top groups to get this working and off the groupnd

        const visibilityClauses: ReadonlyArray<Clause> = [
            ['visibility', '==' , 'public']
        ];

        const clauses: ReadonlyArray<Clause> = [...visibilityClauses];

        const orderBy: ReadonlyArray<OrderByClause> = [
            ['nrMembers', 'desc'],
            ['name', 'asc']
        ];

        const limit = 50;

        return await Collections.list(this.COLLECTION,  clauses, {orderBy, limit});

    }

}


export interface GroupInit {

    /**
     * When specified, use the given group name.
     */
    readonly name?: string;

    /**
     * Must set the group visibility here so that we inherit the right value.
     */
    readonly visibility: GroupVisibility;

    readonly tags?: ReadonlyArray<TagStr>;

    /**
     * A string (not HTML) that is used as a description for this document.
     */
    readonly description?: PlainTextStr;

    readonly links?: ReadonlyArray<URLStr | ExternalLink>;

}

export interface Group extends GroupInit {

    readonly id: GroupIDStr;
    readonly nrMembers: number;
    readonly created: ISODateTimeString;

}
export type GroupVisibility = 'private' | 'protected' | 'public';

export type TagStr = string;

export type GroupNameStr = string;
