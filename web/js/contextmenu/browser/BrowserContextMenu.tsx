import {ContextMenuWrapper, addContextMenuEventListener} from '@burtonator/react-context-menu-wrapper';
import {TestMenu} from '../../../spectron0/ui-components/TestMenu';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ContextMenu} from '../../ui/context_menu/ContextMenu';
import Dropdown, {DropdownMenu, MenuItem} from "@burtonator/react-dropdown";
import {TriggerEvent} from '../TriggerEvent';
import {ContextMenuMessages} from '../ContextMenuMessages';
import {ContextMenuType} from '../ContextMenuType';
import {AnnotationSidebarClient} from '../../annotation_sidebar/AnnotationSidebarClient';
import {PagemarkModes} from '../../metadata/PagemarkModes';

export class BrowserContextMenu extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.state = {

            selectionContexts: {
                page: false,
                areaHighlight: false,
                textHighlight: false,
                pagemark: false
            }

        };

        const id = this.props.id;

        addContextMenuEventListener(id, (eventName: string, data: TriggerEvent | null) => {

            const triggerEvent: TriggerEvent = data!;

            const state = {...this.state, triggerEvent};

            if (triggerEvent) {

                state.selectionContexts.page = triggerEvent.contextMenuTypes.includes(ContextMenuType.PAGE);
                state.selectionContexts.textHighlight = triggerEvent.contextMenuTypes.includes(ContextMenuType.TEXT_HIGHLIGHT);
                state.selectionContexts.areaHighlight = triggerEvent.contextMenuTypes.includes(ContextMenuType.AREA_HIGHLIGHT);
                state.selectionContexts.pagemark = triggerEvent.contextMenuTypes.includes(ContextMenuType.PAGEMARK);
            }

            this.setState(state);

        });

    }

    public render() {

        const triggerEvent = this.state.triggerEvent!;

        const CreateModeSubmenuItems = () => {

            return <MenuItem hidden={!this.state.selectionContexts.pagemark}>

                Pagemark

                <MenuItem>

                    Set Mode

                    {PagemarkModes.toDescriptors().map(current => {
                        return (<MenuItem key={current.key}
                                          hidden={!this.state.selectionContexts.pagemark}
                                          onSelect={() => ContextMenuMessages.postContextMenuMessage("set-pagemark-mode-" + current.key, triggerEvent)}>

                            {current.title}

                        </MenuItem>);
                    })}

                </MenuItem>

                <MenuItem divider/>

                <MenuItem hidden={!this.state.selectionContexts.pagemark}
                          onSelect={() => ContextMenuMessages.postContextMenuMessage("delete-pagemark", triggerEvent)}>

                    <div className="text-danger">Delete</div>

                </MenuItem>

            </MenuItem>;

        };

        return (

            <ContextMenu id={this.props.id}>

                <DropdownMenu>

                    <MenuItem hidden={!this.state.selectionContexts.page}
                              onSelect={() => ContextMenuMessages.postContextMenuMessage("create-pagemark-to-point", triggerEvent)}>

                        Create Pagemark to Point

                    </MenuItem>

                    <MenuItem hidden={!this.state.selectionContexts.page}
                              onSelect={() => ContextMenuMessages.postContextMenuMessage("create-pagemark", triggerEvent)}>

                        Create Pagemark Box

                    </MenuItem>

                    <MenuItem hidden={!this.state.selectionContexts.page}
                              onSelect={() => ContextMenuMessages.postContextMenuMessage("create-area-highlight", triggerEvent)}>

                        Create Area Highlight

                    </MenuItem>

                    <MenuItem divider hidden={!this.state.selectionContexts.pagemark}/>

                    <CreateModeSubmenuItems/>

                    <MenuItem divider hidden={!this.state.selectionContexts.textHighlight}/>

                    <MenuItem hidden={!this.state.selectionContexts.textHighlight}>

                        Text Highlight

                        <MenuItem hidden={!this.state.selectionContexts.textHighlight}
                                  onSelect={() => ContextMenuMessages.postContextMenuMessage("scroll-to-text-highlight", triggerEvent)}>

                            Scroll Into View

                        </MenuItem>

                        <MenuItem hidden={!this.state.selectionContexts.textHighlight}
                                  onSelect={() => ContextMenuMessages.postContextMenuMessage("delete-text-highlight", triggerEvent)}>

                            <div className="text-danger">Delete</div>

                        </MenuItem>

                    </MenuItem>

                    <MenuItem divider hidden={!this.state.selectionContexts.areaHighlight}/>

                    <MenuItem hidden={!this.state.selectionContexts.areaHighlight}>

                        Area Highlight

                        <MenuItem hidden={!this.state.selectionContexts.areaHighlight}
                                  onSelect={() => ContextMenuMessages.postContextMenuMessage("delete-area-highlight", triggerEvent)}>

                            <div className="text-danger">Delete</div>

                        </MenuItem>

                    </MenuItem>

                    <MenuItem divider/>

                    <MenuItem onSelect={() => AnnotationSidebarClient.toggleAnnotationSidebar()}>

                        Toggle Annotation Sidebar

                    </MenuItem>

                </DropdownMenu>

            </ContextMenu>
        );

    }

}

interface IProps {
    readonly id: string;
}

interface IState {
    readonly selectionContexts: SelectionContexts;
    readonly triggerEvent?: TriggerEvent;
}


interface SelectionContexts {
    page: boolean;
    textHighlight: boolean;
    areaHighlight: boolean;
    pagemark: boolean;
}
