import * as React from 'react';
import {TrackedDropdownItem} from './TrackedDropdownItem';
import {LocalPrefs} from '../../../../web/js/util/LocalPrefs';
import {PrefsProvider} from '../../../../web/js/datastore/Datastore';
import {Prefs} from '../../../../web/js/util/prefs/Prefs';

const ICON_ON = "fas fa-check text-primary";
const ICON_OFF = "fas fa-minus";

/**
 */
export class SettingsDropdownItem extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        const prefs = this.props.prefs();

        const hidden = prefs === undefined;

        let marked: boolean = false;
        let icon: string = ICON_OFF;

        if (prefs) {
            marked = prefs.isMarked(this.props.name, this.props.defaultValue);
            icon = marked ? ICON_ON : ICON_OFF;
        }

        return (

            <TrackedDropdownItem trackingCategory='settings-dropdown-click'
                                 id={'setting-' + this.props.name}
                                 title={this.props.title}
                                 tooltip={this.props.tooltip}
                                 icon={icon}
                                 hidden={hidden}
                                 onClick={() => this.onClick()}/>

        );

    }

    private onClick() {
        const prefs = this.props.prefs()!;
        prefs.toggleMarked(this.props.name, this.props.defaultValue);
    }

}

interface IProps {

    // the setting name
    readonly name: string;

    readonly defaultValue: boolean;

    readonly title: string;

    readonly tooltip: string;

    readonly hidden?: boolean;

    readonly prefs: () => Prefs | undefined;

}

interface IState {

}
