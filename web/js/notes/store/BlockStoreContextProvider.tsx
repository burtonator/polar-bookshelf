import * as React from 'react';
import {UIDStr} from "./IBlock";
import {useUserInfoContext} from "../../apps/repository/auth_handler/UserInfoProvider";

export interface IBlockStoreContext {
    readonly uid: UIDStr;
}

const BlockStoreContext = React.createContext<IBlockStoreContext>(null!);

interface IProps {
    readonly uid: UIDStr;
    readonly children: JSX.Element;
}

export function useBlocksStoreContext() {
    return React.useContext(BlockStoreContext);
}

export const BlockStoreContextProvider = (props: IProps) => {
    return (
        <BlockStoreContext.Provider value={{uid: props.uid}}>
            {props.children}
        </BlockStoreContext.Provider>
    );
}

export const BlockStoreDefaultContextProvider = (props: {children: JSX.Element}) => {

    const userInfoContext = useUserInfoContext();

    if (! userInfoContext) {
        return null;
    }

    if (! userInfoContext.userInfo) {
        return null;
    }

    return (
        <BlockStoreContextProvider uid={userInfoContext.userInfo?.uid}>
            {props.children}
        </BlockStoreContextProvider>
    )

}
