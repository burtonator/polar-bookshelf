import * as React from 'react';
import {Logger} from 'polar-shared/src/logger/Logger';
import {IStyleMap} from '../../../../web/js/react/IStyleMap';
import {CloudAuthButton} from '../../../../web/js/ui/cloud_auth/CloudAuthButton';
import {PersistenceLayerManager} from '../../../../web/js/datastore/PersistenceLayerManager';
import {RepoSidebar} from '../RepoSidebar';
import {SplitBar, SplitBarRight} from '../SplitBar';
import {LinkDropdown} from './LinkDropdown';
import {HelpDropdown} from './HelpDropdown';
import {SettingsDropdown} from './SettingsDropdown';
import {Providers} from 'polar-shared/src/util/Providers';
import {Prefs} from '../../../../web/js/util/prefs/Prefs';
import {ChromeExtensionInstallButton} from '../ChromeExtensionInstallButton';
import {Notifications} from '../../../../web/js/ui/notifications/Notifications';
import { SplitBarLeft } from '../SplitBarLeft';

const log = Logger.create();

const Styles: IStyleMap = {

};

/**
 * Simple header for the repository which supports arbitrary children.
 */
export class RepoHeader extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        const Settings = () => {

            const prefs = (): Prefs | undefined => {

                const persistenceLayer = this.props.persistenceLayerManager.get();

                if (! persistenceLayer) {
                    return undefined;
                }

                return persistenceLayer.datastore.getPrefs().get();

            };

            return ( <SettingsDropdown prefs={prefs}/> );

        };

        return (

            <div className="border-bottom">
                <SplitBar>

                    <SplitBarLeft width={500}>
                        <RepoSidebar/>
                    </SplitBarLeft>

                    <SplitBarRight>

                        <ChromeExtensionInstallButton/>

                        <Notifications persistenceLayerProvider={() => this.props.persistenceLayerManager.get()}/>

                        <CloudAuthButton persistenceLayerManager={this.props.persistenceLayerManager} />

                        <LinkDropdown/>

                        <HelpDropdown/>

                        <Settings/>

                    </SplitBarRight>

                </SplitBar>
            </div>

        );

    }

}

interface IProps {
    readonly persistenceLayerManager: PersistenceLayerManager;
}

interface IState {

}
