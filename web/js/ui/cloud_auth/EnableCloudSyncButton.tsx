/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {Button, Popover, PopoverBody, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';
import Popper from 'popper.js';
import {CloudLoginModal} from './CloudLoginModal';
import {Firebase} from '../../firebase/Firebase';
import * as firebase from '../../firebase/lib/firebase';
import {FirebaseUIAuth} from '../../firebase/FirebaseUIAuth';
import {Logger} from 'polar-shared/src/logger/Logger';
import {PersistenceLayerManager} from '../../datastore/PersistenceLayerManager';
import {CloudSyncOverviewModal} from './CloudSyncOverviewModal';
import {CloudSyncConfiguredModal} from './CloudSyncConfiguredModal';
import {RendererAnalytics} from '../../ga/RendererAnalytics';
import {Nav} from '../util/Nav';
import {InviteUsersModal} from './InviteUsersModal';
import {Invitations} from '../../datastore/Invitations';
import {SimpleTooltip} from '../tooltip/SimpleTooltip';
import {URLs} from 'polar-shared/src/util/URLs';

const log = Logger.create();

export class EnableCloudSyncButton extends React.PureComponent<IProps, IState> {

    constructor(props: IProps) {
        super(props);

    }

    public render() {

            return (
                <div>

                    <Button id="enable-cloud-sync"
                            color="primary"
                            size="sm"
                            onClick={() => this.props.onClick()}>

                        <i className="fas fa-cloud-upload-alt" style={{marginRight: '5px'}}></i>

                        <span className="d-none-mobile">Cloud Sync</span>

                    </Button>

                    <SimpleTooltip target="enable-cloud-sync">
                        Cloud sync enables synchronizing your repository across
                        multiple computers.  Files are distributed in real time
                        and always up to date.
                    </SimpleTooltip>

                </div>
            );

    }

}

interface IProps {
    readonly onClick: () => void;
}

interface IState {
}
