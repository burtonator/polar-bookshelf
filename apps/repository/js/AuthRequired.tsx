import * as React from 'react';
import {Logger} from 'polar-shared/src/logger/Logger';
import {
    AuthHandlers,
    AuthStatus
} from "../../../web/js/apps/repository/auth_handler/AuthHandler";

export class AuthRequired extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

    }

    public render() {

        if (this.props.authStatus === 'needs-authentication') {
            const authHandler = AuthHandlers.get();
            authHandler.authenticate();
            return <div/>;
        }

        return this.props.children;

    }

}

interface IProps {
    readonly authStatus: AuthStatus;

}

interface IState {

}

