import * as React from 'react';
import {IStyleMap} from '../../../web/js/react/IStyleMap';
import {NavLogo} from './nav/NavLogo';
import {DeviceRouter} from "../../../web/js/ui/DeviceRouter";
import {ITabProps, NavTabs} from "./NavTabs";
import Grid from '@material-ui/core/Grid';

const TABS: ReadonlyArray<ITabProps> = [
    {
        id: "nav-tab-document-repository",
        label: "Documents",
        link: {pathname: "/"},
    },
    {
        id: "nav-tab-annotations",
        label: "Annotations",
        link: {pathname: "/annotations"},
    }
    ,
    {
        id: "nav-tab-statistics",
        label: "Statistics",
        link: {pathname: "/stats"},
    }
].map((current, index) => ({...current, idx: index})) ;

const Styles: IStyleMap = {

    sidebar: {
        position: 'absolute',
        top: 0,
        left: 0,
        // display: 'none',
        backgroundColor: 'var(--primary-background-color)',
        zIndex: 99999,
        height: 'calc(100%)',
        // paddingLeft: '1px',
        // paddingTop: '1px'
    },

    subheader: {
        display: 'table'
    },

    subheaderItem: {
    }

};

/**
 * Simple header for the repository which supports arbitrary children.
 */
export class RepoNavbar extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
            expanded: false
        };

    }

    public render() {

        const display = this.state.expanded ? 'block' : 'none';

        const sidebarStyle = Object.assign({}, Styles.sidebar, {display});

        const Nav = () => {

            const Delegate =
                <div className="mt-auto mb-auto">

                    <div>

                        <NavTabs tabs={TABS}/>

                    </div>

                </div>;

            return <DeviceRouter desktop={Delegate}/>;

        };

        const NavFirstRow = () => (

            <Grid spacing={2}
                  container
                  direction="row"
                  justify="flex-start"
                  style={{
                      flexWrap: 'nowrap'
                  }}
                  alignItems="center">

                <Grid item>
                    <NavLogo/>
                </Grid>

                <Grid item>
                    <Nav/>
                </Grid>

            </Grid>
        );

        // REFACTOR: I think this code is legacy and that it's now basically just
        // NavFirstRow.  We used to toggle the sidebar here but I think that's
        // now not used.
        return (

            <div className="repo-sidebar">

                <NavFirstRow/>

                <section className="sidebar"
                         style={sidebarStyle}
                         data-expanded={this.state.expanded}>

                    <div className="subheader" style={Styles.subheader}>

                        <NavFirstRow/>

                    </div>

                </section>
            </div>

        );

    }

}

interface IProps {
}

interface IState {
    readonly expanded: boolean;
}

