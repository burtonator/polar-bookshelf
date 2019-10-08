import * as React from 'react';
import {Button, Modal, ModalBody, ModalFooter} from 'reactstrap';
import {InviteUsersContent} from './InviteUsersContent';
import {EmailAddress, EmailAddressParser} from '../../util/EmailAddressParser';

export class InviteUsersModal extends React.Component<IProps, IState> {

    private invitedUsersText: string = "";

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onInvite = this.onInvite.bind(this);
        this.onInvitedUserText = this.onInvitedUserText.bind(this);

    }

    public render() {

        return (

            <Modal isOpen={this.props.isOpen}
                   size="lg"
                   style={{overflowY: 'initial', minWidth: '700px'}}>
                <ModalBody>

                    <InviteUsersContent onInvitedUserText={(invitedUsersText) => this.onInvitedUserText(invitedUsersText)}/>

                </ModalBody>
                <ModalFooter>

                    <Button color="secondary"
                            onClick={() => this.props.onCancel()}>
                        Cancel
                    </Button>

                    <Button color="primary"
                            onClick={() => this.onInvite()}>
                        Invite
                    </Button>

                </ModalFooter>
            </Modal>

        );

    }

    private onInvitedUserText(invitedUsersText: string) {
        this.invitedUsersText = invitedUsersText;
    }


    private onInvite() {

        const emailAddresses
            = EmailAddressParser.parse(this.invitedUsersText);

        this.props.onInvite(emailAddresses);

    }


}

interface IProps {

    readonly isOpen: boolean;

    readonly onCancel: () => void;

    readonly onInvite: (emailAddresses: ReadonlyArray<string>) => void;

}

interface IState {

}
