import * as React from 'react';
import {FixedNav, FixedNavBody} from '../FixedNav';
import {RepoFooter} from '../repo_footer/RepoFooter';
import {UserInfo} from "../../../../web/js/apps/repository/auth_handler/AuthHandler";
import {Billing} from "polar-accounts/src/Billing";
import {EmailAddressParser} from "../../../../web/js/util/EmailAddressParser";
import {InviteUsersContent} from "./InviteUsersContent";
import {Invitations} from "../../../../web/js/datastore/Invitations";
import {Logger} from "polar-shared/src/logger/Logger";

const log = Logger.create();

export class InviteScreen extends React.Component<IProps> {

    private invitedUsersText: string = "";

    constructor(props: Readonly<IProps>) {
        super(props);

        this.onInvite = this.onInvite.bind(this);
        this.onInvitedUserText = this.onInvitedUserText.bind(this);
    }

    public render() {

        return (

            <FixedNav id="doc-repository">

                <header>

                    {/*<RepoHeader/>*/}

                </header>

                <FixedNavBody className="container-fluid bg-grey100">

                    <div className="row">

                        <div className="col-lg-12 w-100 pt-4">

                            <div className="border ml-auto mr-auto rounded p-4 bg-white"
                                 style={{
                                     maxWidth: '800px',
                                     flexGrow: 1
                                 }}>

                                <InviteUsersContent onInvite={() => this.onInvite()}
                                                    onInvitedUserText={(invitedUsersText) => this.onInvitedUserText(invitedUsersText)}/>

                            </div>

                        </div>
                    </div>

                </FixedNavBody>

                <RepoFooter/>

            </FixedNav>

        );
    }

    private onInvitedUserText(invitedUsersText: string) {
        this.invitedUsersText = invitedUsersText;
    }


    private onInvite() {

        const emailAddresses
            = EmailAddressParser.parse(this.invitedUsersText);

        const handleInvitedUsers = async () => {
            await Invitations.sendInvites(...emailAddresses);
        };

        handleInvitedUsers()
            .catch(err => log.error("Unable to invite users: ", err));

    }

}

export interface IProps {
    readonly interval?: Billing.Interval;
    readonly userInfo?: UserInfo;
}

