/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {IStyleMap} from '../../react/IStyleMap';
import {Progress} from 'reactstrap';
import {Reactor} from '../../reactor/Reactor';
import Collapse from 'reactstrap/lib/Collapse';
import {IEventDispatcher} from '../../reactor/SimpleReactor';
import {EventListener} from '../../reactor/EventListener';
import {Logger} from 'polar-shared/src/logger/Logger';


/**
 * A simple collapse that just renders a null component when not open.
 */
export class NullCollapse extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
    }


    public render() {

        if (this.props.open) {
            return this.props.children;
        } else {
            // return an empty array to not change the DOM at all.
            return [];
        }

    }

}

interface IProps {

    readonly open?: boolean;

}

interface IState {


}
