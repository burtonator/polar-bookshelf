/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import Button from 'reactstrap/lib/Button';
import {GroupIDStr} from "../../../../web/js/datastore/Datastore";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {
    GroupJoinRequest,
    GroupJoins
} from "../../../../web/js/datastore/sharing/rpc/GroupJoins";
import {Logger} from "polar-shared/src/logger/Logger";
import {Toaster} from "../../../../web/js/ui/toaster/Toaster";
import {
    GroupNameStr,
    Groups
} from "../../../../web/js/datastore/sharing/db/Groups";
import {AuthHandlers} from "../../../../web/js/apps/repository/auth_handler/AuthHandler";
import {Link} from "react-router-dom";

const log = Logger.create();

export class CreateGroupButton extends React.PureComponent<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.onCreate = this.onCreate.bind(this);

        this.state = {
        };

    }


    public render() {

        // TODO: this doesn't work the way I need it to work because the link
        // is triggered BEFORE ... not after. we require authentication.
        return (

            <Link to={{pathname: "/groups/create"}}
                  onClick={() => this.onCreate()}
                  className="btn btn-success btn-sm">Create Group</Link>

        );

    }

    private onCreate() {

        const handler = async () => {

            await AuthHandlers.requireAuthentication();

        };

        handler()
            .catch(err => log.error("Unable to join group: ", err));

        return false;

    }

}

interface IProps {

}

interface IState {
}
