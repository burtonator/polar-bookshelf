import * as React from 'react';
import {FixedNav} from '../FixedNav';
import {RepoFooter} from "../repo_footer/RepoFooter";
import {DeviceRouter} from "../../../../web/js/ui/DeviceRouter";
import {DockLayout} from "../../../../web/js/ui/doc_layout/DockLayout";
import {MUIPaperToolbar} from "../../../../web/js/mui/MUIPaperToolbar";
import {FolderSidebar2} from "../folders/FolderSidebar2";
import {AnnotationListView2} from "./AnnotationListView2";
import {AnnotationRepoFilterBar2} from "./AnnotationRepoFilterBar2";
import {AnnotationInlineViewer2} from "./AnnotationInlineViewer2";
import {StartReviewDropdown} from "./filter_bar/StartReviewDropdown";
import {AnnotationRepoRoutedComponents} from './AnnotationRepoRoutedComponents';
import {StartReviewSpeedDial} from './StartReviewSpeedDial';
import {MUIElevation} from "../../../../web/js/mui/MUIElevation";
import { AnnotationRepoTable2 } from './AnnotationRepoTable2';
import useTheme from '@material-ui/core/styles/useTheme';

namespace Phone {

    export const Main = () => (
        <DockLayout dockPanels={[
            {
                id: 'dock-panel-center',
                type: 'grow',
                component: <AnnotationListView2/>,
            },
        ]}/>
    );

}

namespace Tablet {


    export const Main = () => (
        <DockLayout dockPanels={[
            {
                id: 'dock-panel-center',
                type: 'fixed',
                style: {
                    overflow: 'visible',
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    minHeight: 0,
                },
                component: <AnnotationRepoTable2 />,
                width: 450
            },
            {
                id: 'dock-panel-right',
                type: 'grow',
                component: <AnnotationInlineViewer2 />
            }
        ]}/>
    );


}

namespace Desktop {

    const StartReviewHeader = () => {

        const theme = useTheme();

        return (
            <StartReviewDropdown style={{
                flexGrow: 1,
                marginTop: theme.spacing(1),
                marginBottom: theme.spacing(1)
            }}/>
        );

    };

    const Toolbar = React.memo(function Toolbar() {
        return (
            <MUIPaperToolbar id="header-filter"
                             padding={1}>

                <div style={{
                    display: 'flex',
                    alignItems: 'center'
                }}>

                    <div style={{
                        flexGrow: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end'
                    }}>
                        <AnnotationRepoFilterBar2/>
                    </div>

                </div>

            </MUIPaperToolbar>
        );
    });

    const Right = React.memo(function Right() {

        return (
            <div style={{
                     display: 'flex',
                     flexGrow: 1,
                     flexDirection: 'column',
                     minHeight: 0,
                     minWidth: 0
                 }}>

                <Toolbar/>

                <DockLayout dockPanels={[
                    {
                        id: 'dock-panel-center',
                        type: 'fixed',
                        style: {
                            overflow: 'visible',
                            display: 'flex',
                            flexDirection: 'column',
                            flexGrow: 1,
                            minHeight: 0,
                        },
                        component:
                            <div style={{
                                flexGrow: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                minHeight: 0
                            }}>
                                <AnnotationRepoTable2/>
                            </div>,
                        width: 450
                    },
                    {
                        id: 'dock-panel-right',
                        type: 'grow',
                        style: {
                            display: 'flex'
                        },
                        component:
                            <MUIElevation elevation={0}
                                          style={{
                                              flexGrow: 1,
                                              display: 'flex'
                                          }}>
                                <AnnotationInlineViewer2/>
                            </MUIElevation>

                    }
                ]}/>
            </div>

        );
    });


    export const Main = () => {

        return (
            <DockLayout dockPanels={[
                {
                    id: 'dock-panel-left',
                    type: 'fixed',
                    style: {
                        overflow: 'visible',
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: 1,
                        minHeight: 0,
                    },
                    component: (
                        <FolderSidebar2 header={<StartReviewHeader/>}/>
                    ),
                    width: 300
                },
                {
                    id: 'dock-panel-right',
                    type: 'grow',
                    style: {
                        display: 'flex'
                    },
                    component:
                        <Right/>

                }
            ]}/>
        );
    };

}

namespace screen {

    export const HandheldScreen = () => {

        return (

            <FixedNav id="doc-repository"
                      className="annotations-view">

                <AnnotationRepoRoutedComponents/>

                <FixedNav.Body>
                    <div style={{
                             flexGrow: 1,
                             display: 'flex',
                             flexDirection: 'column',
                             minHeight: 0
                         }}>

                        <StartReviewSpeedDial/>

                        <DeviceRouter phone={<Phone.Main />}
                                      tablet={<Tablet.Main />}/>

                    </div>
                </FixedNav.Body>

            </FixedNav>

        );
    };

    export const DesktopScreen = () => (

        <FixedNav id="doc-repository"
                  className="annotations-view">

            <header>

            </header>

            <AnnotationRepoRoutedComponents/>
            <Desktop.Main />


        </FixedNav>

    );

}

export const AnnotationRepoScreen2 = React.memo(() => (

    <>

        <DeviceRouter desktop={<screen.DesktopScreen/>}
                      handheld={<screen.HandheldScreen/>}/>

    </>
));
