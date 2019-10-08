import * as React from 'react';
import {PersistenceLayerManager} from '../../../../web/js/datastore/PersistenceLayerManager';
import {Group} from "../../../../web/js/datastore/sharing/db/Groups";
import {VerticalAlign} from "../../../../web/js/ui/util/VerticalAlign";
import {LeftRightSplit} from "../../../../web/js/ui/left_right_split/LeftRightSplit";
import {GroupJoinButton} from "./GroupJoinButton";
import {Link} from "react-router-dom";

export class GroupCard extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        const {group} = this.props;

        return (

            <div className="border-top border-left border-right p-2">

                <LeftRightSplit left={<div style={{display: 'flex'}}>

                                    <VerticalAlign>

                                        <Link className="text-lg"
                                              to={{pathname: '/group/' + group.name!}}>

                                            {group.name}

                                        </Link>

                                    </VerticalAlign>

                                </div>}
                                right={<GroupJoinButton name={group.name!}/>}/>

                <p>
                    {group.description}
                </p>

                <div style={{display: 'flex'}}>

                    <VerticalAlign>
                        <i className="fa fa-users mr-1 text-muted" aria-hidden="true"></i>
                    </VerticalAlign>

                    <VerticalAlign>
                        {group.nrMembers} members
                    </VerticalAlign>


                </div>

            </div>

        );
    }

}

export interface IProps {
    readonly group: Group;
}

export interface IState {
}
