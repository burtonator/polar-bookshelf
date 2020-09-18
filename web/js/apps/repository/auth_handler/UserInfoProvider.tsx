import React from 'react';
import {toUserInfo, UserInfo} from "./AuthHandler"
import {useFirestore} from "../../../../../apps/repository/js/FirestoreProvider";
import {AccountSnapshots} from "../../../accounts/AccountSnapshots";
import {deepMemo} from "../../../react/ReactUtils";
import {
    SnapshotSubscribers,
    SnapshotSubscriberWithID
} from "polar-shared/src/util/Snapshots";
import {Account} from "../../../accounts/Account";
import {useSnapshotSubscriber} from "../../../ui/data_loader/UseSnapshotSubscriber";

interface IUserInfoContext {

    /**
     * The UserInfo or undefined if the user is not logged in.
     */
    readonly userInfo: UserInfo | undefined;

}

/**
 * The IUserInfoContext or undefined if it has not yet been set.
 */
const UserInfoContext = React.createContext<IUserInfoContext | undefined>(undefined);

export function useUserInfoContext() {
    return React.useContext(UserInfoContext);
}

interface IProps {
    readonly children: React.ReactNode;
}

function useUserInfoContextSnapshotSubscriber(): SnapshotSubscriberWithID<IUserInfoContext> {

    const {user, firestore} = useFirestore();

    if (! user) {
        return {
            id: 'no-user',
            subscribe: SnapshotSubscribers.of({userInfo: undefined})
        };
    }

    const accountSnapshotSubscriber = AccountSnapshots.create(firestore, user.uid);

    function toUserInfoContext(account: Account | undefined): IUserInfoContext | undefined {

        if (! user) {
            return undefined;
        }

        const userInfo = toUserInfo(user, account);
        return {userInfo};

    }

    const subscribe = SnapshotSubscribers.converted<Account, IUserInfoContext>(accountSnapshotSubscriber, toUserInfoContext);
    return {id: user.uid, subscribe};

}


// TODO: migrate this to a store so that the entire UI doesn't need to be
// repainted.
export const UserInfoProvider = deepMemo((props: IProps) => {

    const snapshotSubscriber = useUserInfoContextSnapshotSubscriber();

    // TODO: should we use on onError here with the dialog manager
    const {value, error} = useSnapshotSubscriber(snapshotSubscriber);

    if (error) {
        console.error("Could not get user info: ", error);
        // TODO: this needs to raise an error in the UI but MUIDialogController
        // is deeper in the tree
        return null;
    }

    return (
        <UserInfoContext.Provider value={value!}>
            {props.children}
        </UserInfoContext.Provider>
    )

});
