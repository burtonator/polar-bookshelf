import {GroupIDStr} from "../../../Datastore";
import {BaseDocAnnotation} from "./BaseDocAnnotation";
import {Clause, Collections, OrderByClause} from "../Collections";
import {IDStr} from "polar-shared/src/util/Strings";
import {Arrays} from "polar-shared/src/util/Arrays";

export class GroupDocAnnotations {

    public static readonly COLLECTION = 'group_doc_annotation';

    public static async list(groupID: GroupIDStr): Promise<ReadonlyArray<GroupDocAnnotation>> {

        // TODO we should really migrate this to use a a snapshot listener
        // so twe can watch when the data changes

        const orderBy: ReadonlyArray<OrderByClause> = [
            ['lastUpdated', 'desc']
        ];

        const limit = 50;

        const clauses: ReadonlyArray<Clause> = [['groupID', '==', groupID]];

        return await Collections.list(this.COLLECTION, clauses, {limit, orderBy});

    }

    public static async get(groupID: GroupIDStr, id: IDStr): Promise<GroupDocAnnotation | undefined> {

        const limit = 1;

        const clauses: ReadonlyArray<Clause> = [
            ['groupID', '==', groupID],
            ['id', '==', id]
        ];

        const results: ReadonlyArray<GroupDocAnnotation>
            = await Collections.list(this.COLLECTION, clauses, {limit});

        return Arrays.first(results);
    }

}

export interface GroupDocAnnotation extends BaseDocAnnotation {
    readonly groupID: GroupIDStr;
}
