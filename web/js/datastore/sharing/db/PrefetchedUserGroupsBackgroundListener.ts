import {BackgroundListeners} from "../../../util/BackgroundListener";
import {UserGroup, UserGroups} from "./UserGroups";
import {Group, Groups} from "./Groups";
import {SetArrays} from "polar-shared/src/util/SetArrays";
import {IDMaps} from "polar-shared/src/util/IDMaps";
import {SnapshotUnsubscriber} from "../../../firebase/Firebase";
import {Logger} from "polar-shared/src/logger/Logger";
import {GroupIDStr} from "../../Datastore";

const log = Logger.create();

export class PrefetchedUserGroups {

    public static async get(): Promise<PrefetchedUserGroup | undefined> {

        const userGroups = await UserGroups.get();
        return this.prefetch(userGroups);

    }

    public static async onSnapshot(handler: (userGroups: PrefetchedUserGroup | undefined) => void): Promise<SnapshotUnsubscriber> {

        return await UserGroups.onSnapshot(userGroups => {
            this.prefetch(userGroups)
                .then(prefetchedUserGroup => handler(prefetchedUserGroup))
                .catch(err => log.error("Unable to prefetch groups: ", err));

        });

    }

    private static async prefetch(userGroup: UserGroup | undefined): Promise<PrefetchedUserGroup | undefined> {

        if (! userGroup) {
            return undefined;
        }

        const groupIDs =
            SetArrays.union(userGroup.admin || [],
                            userGroup.invitations || [],
                            userGroup.moderator || [],
                            userGroup.groups || []);

        // get all the referenced groups for the user.
        const referencedGroups = await Groups.getAll(groupIDs);

        const prefetched = IDMaps.toIDMap(referencedGroups);

        const groups = IDMaps.fetch(prefetched, userGroup.groups || []);

        return {userGroup, prefetched, groups};

    }

}
/**
 * Provides us with a background updated snapshot of the latest UserGroups
 * which stays active in memory.  Even with cache it seems FB has some latencies.
 */
export class PrefetchedUserGroupsBackgroundListener {

    private static delegate = BackgroundListeners.create(PrefetchedUserGroups);

    public static async start() {
        await this.delegate.start();
    }

    public static get(): PrefetchedUserGroup | undefined {
        return this.delegate.get();
    }

}

export interface PrefetchedUserGroup {

    /**
     * The original UserGroup we used to build this prefetched set.
     */
    readonly userGroup: UserGroup;

    readonly prefetched: UserGroupMap;

    /**
     * All the groups this user is a member of
     */
    readonly groups: ReadonlyArray<Group>;

}

/**
 * Stores a pre-fetched set of groups for the user.
 */
export interface UserGroupMap {
    [groupID: string]: Group;
}
