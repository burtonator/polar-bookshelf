import * as React from 'react';
import {prepareContextMenuHandlers} from '@burtonator/react-context-menu-wrapper';
import {ContextMenuHandlers} from '@burtonator/react-context-menu-wrapper';
import {ContextMenuWrapper} from '@burtonator/react-context-menu-wrapper';
import DropdownItem from 'reactstrap/lib/DropdownItem';
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';
import {DocDropdownItems} from './DocDropdownItems';
import {RepoDocInfo} from './RepoDocInfo';
import {IStyleMap} from '../../../web/js/react/IStyleMap';
import deepEqual = require('deep-equal');

let sequence: number = 0;

export class DocContextMenu extends React.Component<IProps, IState> {

    private contextMenuHandlers: ContextMenuHandlers;

    private id: string;

    constructor(props: IProps, context: any) {
        super(props, context);

        this.id = 'doc-context-menu2-' + sequence++;

        this.contextMenuHandlers = prepareContextMenuHandlers({id: this.id});

    }

    // TODO: this should go away in favor of simpler PureComponents.
    public shouldComponentUpdate(nextProps: Readonly<IProps>, nextState: Readonly<IState>, nextContext: any): boolean {
        return ! deepEqual(this.props.repoDocInfo, nextProps.repoDocInfo);
    }

    public render() {

        return (

            <div>

                <div {...this.contextMenuHandlers}>
                    {this.props.children}
                </div>

                <ContextMenuWrapper id={this.id}>

                    <div className="border shadow rounded pt-2 pb-2"
                         style={{backgroundColor: 'white'}}>

                        <DocDropdownItems toggle={false} {...this.props}/>

                    </div>

                </ContextMenuWrapper>

            </div>

        );

    }

}


interface IProps {
    readonly id: string;
    readonly repoDocInfo: RepoDocInfo;
    readonly onDelete: (repoDocInfo: RepoDocInfo) => void;
    readonly onSetTitle: (repoDocInfo: RepoDocInfo, title: string) => void;
    readonly onDocumentLoadRequested: (repoDocInfo: RepoDocInfo) => void;
}

interface IState {
}


