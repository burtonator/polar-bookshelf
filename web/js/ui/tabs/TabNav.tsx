import * as React from 'react';
import Nav from 'reactstrap/lib/Nav';
import NavItem from 'reactstrap/lib/NavItem';
import NavLink from 'reactstrap/lib/NavLink';
import {ChannelCoupler} from '../../util/Channels';
import Button from 'reactstrap/lib/Button';
import {TabButtonContextMenu} from './TabButtonContextMenu';
import {TabPanes} from './TabPanes';
import {TabStyles} from './TabStyles';

let tabSequence: number = 10000;

// TODO
//
// - fit the screen properly including the webview content
// - disable the ability to close the primary tab

export class TabNav extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.toggle = this.toggle.bind(this);
        this.addTab = this.addTab.bind(this);
        this.closeTab = this.closeTab.bind(this);
        this.closeOtherTabs = this.closeOtherTabs.bind(this);

        this.props.addTabBinder(tab => this.addTab(tab));

        const initialTabs = this.props.initialTabs || [] ;

        const tabs = initialTabs.map(current => {
            return {
                ...current,
                id: tabSequence++
            };
        });

        this.state = {
            activeTab: 0,
            tabs
            // tabs: [
            //     {
            //         id: 0,
            //         title: "Repository",
            //         content: <div>This is the first page content</div>
            //     },
            //     {
            //         id: 1,
            //         title: "CNN",
            //         content: 'http://cnn.com'
            //     },
            // ]
        };

    }

    public render() {

        const NavTabs = () => {

            return <Nav style={TabStyles.TAB_NAV} tabs>

                {this.state.tabs.map(tab =>

                    <NavItem key={tab.id}>

                        <NavLink
                            className={"p-0 " + (tab.id === this.state.activeTab ? "active" : "")}
                            >

                            <div style={{display: 'flex'}}
                                 className={tab.id === this.state.activeTab ? "border-bottom border-primary " : ""}>

                                <TabButtonContextMenu onCloseOtherTabs={() => this.closeOtherTabs(tab.id)}
                                                      onClose={() => this.closeTab(tab.id)}>

                                    <div className="mt-auto mb-auto pt-1 pb-1 pl-2 pr-1"
                                         style={{userSelect: 'none'}}
                                         onClick={() => this.toggle(tab.id)}>
                                        {tab.title}
                                    </div>

                                </TabButtonContextMenu>

                                <div className="mt-auto mb-auto mr-1">

                                    <Button color="light"
                                            onClick={() => this.closeTab(tab.id)}
                                            className="text-muted p-1"
                                            style={{fontSize: '14px'}}>
                                        <i className="fas fa-times"></i>
                                    </Button>

                                </div>
                            </div>

                        </NavLink>

                    </NavItem>

                   )}

            </Nav>;

        };

        return (

            <div className="tab-nav">

                    <NavTabs/>

                    <TabPanes tabs={this.state.tabs} activeTab={this.state.activeTab}/>

            </div>

        );

    }

    private addTab(tab: TabInit) {

        const newTab = {
            ...tab,
            id: tabSequence++
        };

        // make it the activeTab by default
        const activeTab = newTab.id;

        this.setState({
            ...this.state,
            tabs: [...this.state.tabs, newTab],
            activeTab
        });

    }

    private closeTab(tab: number) {

        // TODO: we have to pick a new activeTab now...

        const tabs = this.state.tabs.filter(current => current.id !== tab);

        this.setState({...this.state, tabs});

    }

    private closeOtherTabs(tab: number) {

        const tabs = this.state.tabs.filter(current => current.id === tab);
        this.setState({...this.state, tabs, activeTab: tab});

    }

    private toggle(tab: number) {

        if (this.state.activeTab !== tab) {
            this.setState({...this.state, activeTab: tab});
        }

    }

}


interface IProps {

    readonly initialTabs?: ReadonlyArray<TabInit>;

    readonly addTabBinder: ChannelCoupler<TabInit>;
}

interface IState {
    readonly activeTab: number;
    readonly tabs: ReadonlyArray<Tab>;
}

export interface TabInit {

    readonly title: string;

    /**
     * What we should be displaying in the tab.
     */
    readonly content: JSX.Element | string;

}

/**
 * Our high level interface for a tab
 */
export interface Tab extends TabInit {

    readonly id: number;

}

/**
 * Used to load content externally via a WebView but I need to figure out if
 * this is even doable but I think if I set the height as 100vh that it will
 * work properly.
 */
class ExternalContent {

    constructor(public readonly href: string) {

    }
}
