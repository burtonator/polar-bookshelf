import React from 'react';
import {MemberRecord} from './GroupSharingRecords';
import Button from 'reactstrap/lib/Button';
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';
import {Dialogs} from '../dialogs/Dialogs';
import {ConfirmProps} from '../dialogs/Confirm';

/**
 * Allow the user to select from one or more of their contacts.
 */
export class GroupMemberEntry extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.onDelete = this.onDelete.bind(this);

    }

    public render() {

        const {member} = this.props;

        return <div style={{display: 'flex'}}>

            <div className="mt-auto mb-auto"
                 style={{
                     flexGrow: 1,
                 }}>

                <div className="mt-auto mb-auto">
                    {member.label}
                </div>

            </div>

            <div className="mt-auto mb-auto">

                <div className="mt-auto mb-auto"
                     style={{
                         display: 'flex'
                     }}>

                    <div className="mt-auto mb-auto">
                        {member.type}
                    </div>

                    <div className="mt-auto mb-auto ml-1">

                        <Button color="light"
                                size="sm"
                                onClick={() => this.onDelete(member)}
                                className="pl-2 pr-2">

                            <i className="fas fa-trash"/>

                        </Button>

                    </div>

                </div>
            </div>

        </div>;

    }

    private onDelete(member: MemberRecord) {

        const opts: ConfirmProps = {
            title: 'Are you sure you want to delete this group member?',
            onConfirm: () => this.props.onDelete(member),
            onCancel: NULL_FUNCTION
        };

        Dialogs.confirm(opts);

    }


}

interface IProps {
    readonly member: MemberRecord;
    readonly onDelete: (member: MemberRecord) => void;
}

interface IState {
}
