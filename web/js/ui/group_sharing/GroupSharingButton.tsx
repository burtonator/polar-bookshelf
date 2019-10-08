/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import Button from 'reactstrap/lib/Button';
import PopoverBody from 'reactstrap/lib/PopoverBody';
import {Popover} from 'reactstrap';
import {InvitationRequest} from './GroupSharingControl';
import {DocRefs} from '../../datastore/sharing/db/DocRefs';
import {FirebaseDatastores} from '../../datastore/FirebaseDatastores';
import {GroupDatastores} from '../../datastore/sharing/GroupDatastores';
import {Toaster} from '../toaster/Toaster';
import {DropdownChevron} from '../util/DropdownChevron';
import {Logger} from 'polar-shared/src/logger/Logger';
import {GroupSharing} from './GroupSharing';
import {MemberRecord} from './GroupSharingRecords';
import {Doc} from '../../metadata/Doc';
import {DatastoreCapabilities} from '../../datastore/Datastore';
import {UserRefs} from '../../datastore/sharing/rpc/UserRefs';
import {GroupMember} from '../../datastore/sharing/db/GroupMembers';
import {GroupMemberInvitation} from '../../datastore/sharing/db/GroupMemberInvitations';
import {GroupMemberDeletes} from '../../datastore/sharing/rpc/GroupMemberDeletes';
import {GroupNameStr, Groups} from '../../datastore/sharing/db/Groups';
import {Firebase} from '../../firebase/Firebase';
import {Preconditions} from 'polar-shared/src/Preconditions';
import {ContactOptions} from './ContactOptions';
import {GroupDocsAdd} from "../../datastore/sharing/rpc/GroupDocsAdd";
import {Arrays} from "polar-shared/src/util/Arrays";

export class GroupSharingButton extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.onDone = this.onDone.bind(this);
        this.doGroupProvision = this.doGroupProvision.bind(this);
        this.doGroupDocsAdd = this.doGroupDocsAdd.bind(this);
        this.onDelete = this.onDelete.bind(this);

        this.state = {
            open: false,
        };

    }


    public render() {

        return (

            <div className="mr-1 ml-1">

                <Button color="primary"
                        id="share-control-button"
                        size="md"
                        disabled={this.props.disabled}
                        hidden={this.props.hidden}
                        onClick={() => this.toggle(true)}
                        className="pl-2 pr-2">

                    <i className="fas fa-share"/>
                    &nbsp;
                    Share

                    <DropdownChevron/>

                </Button>

                <Popover trigger="legacy"
                         placement="bottom"
                         isOpen={this.state.open}
                         toggle={() => this.toggle(false)}
                         target="share-control-button"
                         fade={false}
                         delay={0}
                         className=""
                         style={{
                             minWidth: '500px',
                             maxWidth: '800px'
                         }}>

                    <PopoverBody className="shadow">

                        <GroupSharing doc={this.props.doc}
                                      onCancel={() => this.toggle(false)}
                                      onDelete={member => this.onDelete(member)}
                                      onDone={(contactSelections, groups) => this.onDone(contactSelections, groups)}/>

                    </PopoverBody>

                </Popover>

            </div>

        );

    }

    private toggle(open: boolean) {
        this.setState({...this.state, open});
    }

    private onDone(invitationRequest: InvitationRequest, groups: ReadonlyArray<GroupNameStr>) {

        console.log("onDone...: ", invitationRequest);

        this.toggle(false);
        this.props.onDone();

        this.doGroupProvision(invitationRequest)
            .catch(err => Toaster.error("Could not provision group: " + err.message));

        this.doGroupDocsAdd(groups)
            .catch(err => Toaster.error("Could not add document to group: " + err.message));

    }

    private async doGroupProvision(invitationRequest: InvitationRequest) {

        if (invitationRequest.contactSelections.length === 0) {
            console.log("No contacts to invite.  Done.");
            // there's nothing to be done so don't provision a group with zero
            // members.
            return;
        }

        const docRef = this.createDocRef();

        const {message} = invitationRequest;

        Toaster.info("Sharing document with users ... ");

        await GroupDatastores.provision({
            key: docRef.fingerprint,
            visibility: 'private',
            docs: [docRef],
            invitations: {
                message,
                to: invitationRequest.contactSelections
            }
        });

        Toaster.success("Document shared successfully");

    }

    private createDocRef() {

        const docMeta = this.props.doc.docMeta;
        const fingerprint = docMeta.docInfo.fingerprint;
        const docID = FirebaseDatastores.computeDocMetaID(fingerprint);
        return DocRefs.fromDocMeta(docID, docMeta);

    }

    private async doGroupDocsAdd(groups: ReadonlyArray<GroupNameStr>) {

        if (groups.length === 0) {
            console.log("No groups to invite.  Done.");
            return;
        }

        const computeGroupsOverview = () => {

            const nrGroups = groups.length;

            let groupsText = "";

            if (nrGroups <= 4) {
                groupsText = groups.join(", ");
            } else {
                groupsText = Arrays.head(groups, 4) + ", ...";
            }

            return `${nrGroups} groups (${groupsText})`;

        };

        const groupsOverview = computeGroupsOverview();

        const toastRef = Toaster.info(`Adding document to ${groupsOverview}`);

        for (const groupName of groups) {

            const docRef = this.createDocRef();
            const group = await Groups.getByName(groupName);

            if (! group) {
                Toaster.error("No group named: " + groupName);
                continue;
            }

            const groupID = group.id;

            await GroupDocsAdd.exec({groupID, docs: [docRef]});

        }

        Toaster.remove();

        Toaster.success(`Document added to ${groupsOverview}`);

    }

    private onDelete(member: MemberRecord) {

        console.log("Deleting member: ", member);

        const toUserRef = () => {

            switch (member.type) {

                case 'member':
                    const groupMember = member.value as GroupMember;
                    return UserRefs.fromProfileID(groupMember.profileID);
                case 'pending':
                    const groupMemberInvitation = member.value as GroupMemberInvitation;
                    return UserRefs.fromEmail(groupMemberInvitation.to);

            }

        };

        const handle = async () => {

            const user = await Firebase.currentUser();
            Preconditions.assertPresent(user, 'user');
            const uid = user!.uid;

            const {doc} = this.props;
            const fingerprint = doc.docInfo.fingerprint;

            const userRef = toUserRef();

            const groupID = Groups.createIDForKey(uid, fingerprint);

            await GroupMemberDeletes.exec({groupID, userRefs: [userRef]});

        };

        handle()
            .catch(err => {
                const msg = "Failed to delete user from group: ";
                console.error(msg, err);
                Toaster.error(msg + err.message);
            });

    }

}

interface IProps {

    readonly doc: Doc;

    readonly datastoreCapabilities: DatastoreCapabilities;

    readonly onDone: () => void;

    readonly disabled?: boolean;

    readonly hidden?: boolean;

}

interface IState {

    readonly open: boolean;
}
