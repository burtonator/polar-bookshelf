import * as React from 'react';
import {GroupDocAddButton} from "./GroupDocAddButton";
import {GroupDocInfo} from "../../../../web/js/datastore/sharing/GroupDocInfos";
import {PersistenceLayerProvider} from "../../../../web/js/datastore/PersistenceLayer";
import Moment from "react-moment";
import {LinkHost} from "./LinkHost";

export class GroupDocInfoCard extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (

            <div className="border-top border-left border-right p-2">

                {/*<LeftRightSplit left={<div style={{display: 'flex'}}>*/}

                {/*                    <VerticalAlign>*/}
                {/*                        <a className="text-lg" href={'#group/' + this.props.id}>{group.name}</a>*/}
                {/*                    </VerticalAlign>*/}

                {/*                </div>}*/}
                {/*                right={<GroupDocAddButton groupID={group.id}/>}/>*/}

                {/*<p>*/}
                {/*    {group.description}*/}
                {/*</p>*/}

                {/*<div style={{display: 'flex'}}>*/}

                {/*    <VerticalAlign>*/}
                {/*        <i className="fa fa-users mr-1 text-muted" aria-hidden="true"/>*/}
                {/*    </VerticalAlign>*/}

                {/*    <VerticalAlign>*/}
                {/*        {group.nrMembers} members*/}
                {/*    </VerticalAlign>*/}

                {/*</div>*/}



                <div style={{display: 'flex'}}>

                    <div style={{flexGrow: 1}}
                         className="mt-auto mb-auto text-lg">
                        {this.props.title}
                    </div>

                    <div>

                        <GroupDocAddButton persistenceLayerProvider={this.props.persistenceLayerProvider}
                                           groupID={this.props.groupID}
                                           fingerprint={this.props.fingerprint}/>

                    </div>
                </div>

                <div>
                    {this.props.description}
                </div>

                <div style={{display: 'flex'}} className="mt-2">

                    <div style={{flexGrow: 1}} className="text-grey600">

                        <div style={{display: 'flex'}}>

                            <LinkHost url={this.props.url}/>

                            <div>
                                <b>{this.props.nrPages}</b> pages
                            </div>

                        </div>

                    </div>

                    <div className="text-grey600">

                        <Moment withTitle={true}
                                titleFormat="D MMM YYYY hh:MM A"
                                format="MMM DD YYYY HH:mm A"
                                ago
                                filter={(value) => value.replace(/^an? /g, '1 ')}>
                            {this.props.published}
                        </Moment>

                    </div>
                </div>

            </div>

        );
    }

}

export interface IProps extends GroupDocInfo {
    readonly persistenceLayerProvider: PersistenceLayerProvider;

}

export interface IState {
}
