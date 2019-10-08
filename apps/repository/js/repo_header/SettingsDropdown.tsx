import * as React from 'react';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import {UncontrolledDropdown} from 'reactstrap';
import {SettingsDropdownItem} from './SettingsDropdownItem';
import {Prefs} from '../../../../web/js/util/prefs/Prefs';

export class SettingsDropdown extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (
            <UncontrolledDropdown className="ml-1"
                                  size="sm"
                                  id="settings-dropdown">

                <DropdownToggle className="text-muted"
                                color="light"
                                caret>

                    <i className="fas fa-cog" style={{fontSize: '17px'}}></i>

                </DropdownToggle>

                <DropdownMenu className="shadow" right>

                    <SettingsDropdownItem name="settings-auto-resume"
                                          defaultValue={true}
                                          prefs={this.props.prefs}
                                          title="Automatically Resume Reading Position"
                                          tooltip="Automatically resume the current reading position when opening documents."/>

                </DropdownMenu>

            </UncontrolledDropdown>
        );

    }


}

interface IProps {
    readonly prefs: () => Prefs | undefined;
}

interface IState {

}
