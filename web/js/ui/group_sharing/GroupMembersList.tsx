import React from 'react';
import {GroupMemberEntry} from './GroupMemberEntry';
import {MemberRecord} from './GroupSharingRecords';
import {NullCollapse} from '../null_collapse/NullCollapse';

/**
 * Allow the user to select from one or more of their contacts.
 */
export class GroupMembersList extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.state = {
        };

    }

    public render() {

        const members = this.props.members || [];

        return <div>

            <NullCollapse open={members.length > 0}>

                <div className="font-weight-bold mt-1 mb-1">
                    Currently shared with:
                </div>

            </NullCollapse>

            {members.map(item =>
                <GroupMemberEntry key={item.id}
                                  member={item}
                                  onDelete={this.props.onDelete}/>)}
        </div>;

    }


}

interface IProps {
    readonly onDelete: (member: MemberRecord) => void;
    readonly members?: ReadonlyArray<MemberRecord>;
}

interface IState {
}
