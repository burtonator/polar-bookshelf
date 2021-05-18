import * as React from 'react';
import {IEventDispatcher} from '../../reactor/SimpleReactor';
import {IDocInfo} from 'polar-shared/src/metadata/IDocInfo';
import {PersistenceLayerManager} from '../../datastore/PersistenceLayerManager';
import {BrowserRouter, Route, Switch, useHistory, useLocation} from 'react-router-dom';
import {RepoDocMetaManager} from '../../../../apps/repository/js/RepoDocMetaManager';
import {RepoDocMetaLoader} from '../../../../apps/repository/js/RepoDocMetaLoader';
import WhatsNewScreen
    from '../../../../apps/repository/js/whats_new/WhatsNewScreen';
import {StatsScreen} from '../../../../apps/repository/js/stats/StatsScreen';
import {PricingScreen} from '../../../../apps/repository/js/premium/PricingScreen';
import {SupportScreen} from '../../../../apps/repository/js/support/SupportScreen';
import {AuthRequired} from "../../../../apps/repository/js/AuthRequired";
import {
    PersistenceLayerApp,
    PersistenceLayerContext,
    RepoDocMetaManagerContext
} from "../../../../apps/repository/js/persistence_layer/PersistenceLayerApp";
import {InviteScreen} from "../../../../apps/repository/js/invite/InviteScreen";
import {ReactRouters} from "../../react/router/ReactRouters";
import {SettingsScreen} from "../../../../apps/repository/js/configure/settings/SettingsScreen";
import {DeviceScreen} from "../../../../apps/repository/js/device/DeviceScreen";
import {App} from "./AppInitializer";
import {Callback} from "polar-shared/src/util/Functions";
import {MUIRepositoryRoot} from "../../mui/MUIRepositoryRoot";
import {DocRepoScreen2} from "../../../../apps/repository/js/doc_repo/DocRepoScreen2";
import {DocRepoStore2, useDocRepoCallbacks, useDocRepoStore} from "../../../../apps/repository/js/doc_repo/DocRepoStore2";
import {DocRepoSidebarTagStore} from "../../../../apps/repository/js/doc_repo/DocRepoSidebarTagStore";
import {AnnotationRepoSidebarTagStore} from "../../../../apps/repository/js/annotation_repo/AnnotationRepoSidebarTagStore";
import {AnnotationRepoStore2} from "../../../../apps/repository/js/annotation_repo/AnnotationRepoStore";
import {AnnotationRepoScreen2} from "../../../../apps/repository/js/annotation_repo/AnnotationRepoScreen2";
import {ReviewRouter} from "../../../../apps/repository/js/reviewer/ReviewerRouter";
import {PersistentRoute} from "./PersistentRoute";
import {UserTagsProvider} from "../../../../apps/repository/js/persistence_layer/UserTagsProvider2";
import {DocMetaContextProvider} from "../../annotation_sidebar/DocMetaContextProvider";
import {DocViewerDocMetaLookupContextProvider} from "../../../../apps/doc/src/DocViewerDocMetaLookupContextProvider";
import {DocViewerStore} from "../../../../apps/doc/src/DocViewerStore";
import {DocFindStore} from "../../../../apps/doc/src/DocFindStore";
import {AnnotationSidebarStoreProvider} from "../../../../apps/doc/src/AnnotationSidebarStore";
import {DocViewer} from "../../../../apps/doc/src/DocViewer";
import {Preconditions} from "polar-shared/src/Preconditions";
import {RepositoryRoot} from "./RepositoryRoot";
import {AddFileDropzoneScreen} from './upload/AddFileDropzoneScreen';
import {AnkiSyncController} from "../../controller/AnkiSyncController";
import {ErrorScreen} from "../../../../apps/repository/js/ErrorScreen";
import {ListenablePersistenceLayerProvider} from "../../datastore/PersistenceLayer";
import {RepoHeader3} from "../../../../apps/repository/js/repo_header/RepoHeader3";
import {RepoFooter} from "../../../../apps/repository/js/repo_footer/RepoFooter";
import {MUIDialogController} from "../../mui/dialogs/MUIDialogController";
import {UseLocationChangeStoreProvider} from '../../../../apps/doc/src/annotations/UseLocationChangeStore';
import {UseLocationChangeRoot} from "../../../../apps/doc/src/annotations/UseLocationChangeRoot";
import {deepMemo} from "../../react/ReactUtils";
import { PHZMigrationScreen } from './migrations/PHZMigrationScreen';
import { AddFileDropzoneRoot } from './upload/AddFileDropzoneRoot';
import {AnalyticsLocationListener} from "../../analytics/AnalyticsLocationListener";
import {LogsScreen} from "../../../../apps/repository/js/logs/LogsScreen";
import {PrefsContext2} from "../../../../apps/repository/js/persistence_layer/PrefsContext2";
import {LoginWithCustomTokenScreen} from "../../../../apps/repository/js/login/LoginWithCustomTokenScreen";
import {WelcomeScreen} from "./WelcomeScreen";
import {useSideNavStore} from '../../sidenav/SideNavStore';
import {SideNav, SIDENAV_WIDTH} from "../../sidenav/SideNav";
import Divider from '@material-ui/core/Divider';
import {SideNavInitializer} from "../../sidenav/SideNavInitializer";
import {AccountDialogScreen} from "../../ui/cloud_auth/AccountDialogScreen";
import {CreateAccountScreen} from "../../../../apps/repository/js/login/CreateAccountScreen";
import {SignInScreen} from "../../../../apps/repository/js/login/SignInScreen";
import {ZenModeGlobalHotKeys} from "../../mui/ZenModeGlobalHotKeys";
import {ZenModeDeactivateButton} from "../../mui/ZenModeDeactivateButton";
import {UserTagsDataLoader} from "../../../../apps/repository/js/persistence_layer/UserTagsDataLoader";
import {NotesRouter} from "../../notes/NotesRouter";
import {NotesContainer} from "../../notes/NotesContainer";
import {BlocksStoreProvider} from "../../notes/store/BlocksStore";
import {BlockStoreDefaultContextProvider} from "../../notes/store/BlockStoreContextProvider";
import {Devices} from 'polar-shared/src/util/Devices';
import {useResizeObserver} from '../../../../apps/doc/src/renderers/pdf/PinchToZoomHooks';

interface IProps {
    readonly app: App;
    readonly repoDocMetaManager: RepoDocMetaManager;
    readonly repoDocMetaLoader: RepoDocMetaLoader;
    readonly persistenceLayerManager: PersistenceLayerManager;
    readonly updatedDocInfoEventDispatcher: IEventDispatcher<IDocInfo>;
    readonly onFileUpload: Callback;
}

interface RepositoryDocViewerScreenProps {
    readonly persistenceLayerProvider: ListenablePersistenceLayerProvider;
    readonly repoDocMetaLoader: RepoDocMetaLoader;
    readonly repoDocMetaManager: RepoDocMetaManager;
    readonly persistenceLayerManager: PersistenceLayerManager;

}

export const RepositoryDocViewerScreen = deepMemo(function RepositoryDocViewerScreen(props: RepositoryDocViewerScreenProps) {

    return (
        <AuthRequired>
            <PersistenceLayerContext.Provider value={{persistenceLayerProvider: props.persistenceLayerProvider}}>
                <PersistenceLayerApp tagsType="documents"
                                     repoDocMetaManager={props.repoDocMetaManager}
                                     repoDocMetaLoader={props.repoDocMetaLoader}
                                     persistenceLayerManager={props.persistenceLayerManager}>
                    <PrefsContext2>
                        <AnnotationSidebarStoreProvider>
                            <UserTagsProvider>
                                <DocMetaContextProvider>
                                    <DocViewerStore>
                                        <DocViewerDocMetaLookupContextProvider>
                                            <DocFindStore>
                                                <DocViewer/>
                                            </DocFindStore>
                                        </DocViewerDocMetaLookupContextProvider>
                                    </DocViewerStore>
                                </DocMetaContextProvider>
                            </UserTagsProvider>
                        </AnnotationSidebarStoreProvider>
                    </PrefsContext2>
                </PersistenceLayerApp>
            </PersistenceLayerContext.Provider>
        </AuthRequired>
    );
});

interface SideNavDocumentsProps {
    readonly persistenceLayerProvider: ListenablePersistenceLayerProvider;
    readonly repoDocMetaLoader: RepoDocMetaLoader;
    readonly repoDocMetaManager: RepoDocMetaManager;
    readonly persistenceLayerManager: PersistenceLayerManager;
}

const SideNavDocuments = React.memo(function SideNavDocuments(props: SideNavDocumentsProps) {

    const {tabs} = useSideNavStore(['tabs']);

    return (
        <>
            {tabs.map(tab => {

                return (
                    <PersistentRoute key={`doc-${tab.id}`}
                                     exact
                                     strategy={tab.type === 'pdf' ? 'display' : 'visibility'}
                                     path={tab.url}>

                        <RepositoryDocViewerScreen persistenceLayerProvider={props.persistenceLayerProvider}
                                                   repoDocMetaManager={props.repoDocMetaManager}
                                                   repoDocMetaLoader={props.repoDocMetaLoader}
                                                   persistenceLayerManager={props.persistenceLayerManager}/>

                    </PersistentRoute>
                );

            })}
        </>
    );

});

const MainRenderer: React.FC = ({children}) => {
    const {isLeftDockOpen, sidenavElem} = useDocRepoStore(['isLeftDockOpen', 'sidenavElem']);
    const {setLeftDockOpen} = useDocRepoCallbacks();
    const ref = React.useRef<HTMLDivElement>(null);

    if (["phone", "tablet"].indexOf(Devices.get()) === -1) {
        return <>{children}</>;
    }

    const updateStyles = () => {
        const elem = ref.current;
        if (elem && sidenavElem) {
            elem.style.left = `${isLeftDockOpen ? sidenavElem.getBoundingClientRect().width : 0}px`;
        }
    };

    React.useEffect(() => updateStyles(), [isLeftDockOpen]);

    useResizeObserver(updateStyles, { current: sidenavElem || null });

    return (
        <div style={{
            display: 'flex',
            minWidth: 0,
            minHeight: 0,
            flexDirection: 'column',
            flexGrow: 1,
            position: "absolute",
            width: "100%",
            height: "100%",
            left: 0,
            transition: "left 225ms cubic-bezier(0, 0, 0.2, 1)",
            background: "white",
        }}
            ref={ref}
        >
            {isLeftDockOpen && <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, width: "100%", height: "100%", background: "rgba(0, 0, 0, 0.5)", zIndex: 150 }} onClick={() => setLeftDockOpen(false)} />}
             {children}
         </div>
    );
};

export const RepositoryApp = React.memo(function RepositoryApp(props: IProps) {

    const {app, repoDocMetaManager, repoDocMetaLoader, persistenceLayerManager} = props;

    Preconditions.assertPresent(app, 'app');

    const RenderDocViewerScreen = React.memo(() => (
        <RepositoryDocViewerScreen persistenceLayerProvider={app.persistenceLayerProvider}
                                   repoDocMetaManager={repoDocMetaManager}
                                   repoDocMetaLoader={repoDocMetaLoader}
                                   persistenceLayerManager={persistenceLayerManager}/>
    ));

    const RenderDocRepoScreen = React.memo(function RenderDocRepoScreen() {
        return (
            <DocRepoSidebarTagStore>
                <>
                    <SideNavInitializer/>
                    <AnkiSyncController/>
                    <DocRepoScreen2/>
                </>
            </DocRepoSidebarTagStore>
        );
    });


    const RenderAnnotationRepoScreen = React.memo(function RenderAnnotationRepoScreen() {
        return (
            <PersistenceLayerApp tagsType="annotations"
                                 repoDocMetaManager={repoDocMetaManager}
                                 repoDocMetaLoader={repoDocMetaLoader}
                                 persistenceLayerManager={persistenceLayerManager}>
                 <AnnotationRepoStore2>
                     <AnnotationRepoSidebarTagStore>
                         <>
                             <ReviewRouter/>
                             <AnnotationRepoScreen2/>
                         </>
                     </AnnotationRepoSidebarTagStore>
                 </AnnotationRepoStore2>
            </PersistenceLayerApp>
        );
    });

    const RenderSettingsScreen = () => (
        <PersistenceLayerApp tagsType="documents"
                             repoDocMetaManager={repoDocMetaManager}
                             repoDocMetaLoader={repoDocMetaLoader}
                             persistenceLayerManager={persistenceLayerManager}>
            <SettingsScreen/>
        </PersistenceLayerApp>
    );

    const renderDeviceScreen = () => (
        <DeviceScreen/>
    );

    const RenderDefaultScreen = React.memo(() => (
        <RenderDocRepoScreen/>
    ));

    RenderDefaultScreen.displayName='RenderDefaultScreen';

    const renderWhatsNewScreen = () => (
        <WhatsNewScreen/>
    );

    const renderStatsScreen = () => (
        <PersistenceLayerApp tagsType="documents"
                             repoDocMetaManager={repoDocMetaManager}
                             repoDocMetaLoader={repoDocMetaLoader}
                             persistenceLayerManager={persistenceLayerManager}>
            <StatsScreen/>
        </PersistenceLayerApp>
    );

    const premiumScreen = () => {
        return (
            <PricingScreen/>
        );
    };

    const supportScreen = () => {
        return (<SupportScreen/>);
    };

    const renderInvite = () => {
        return <InviteScreen/>;
    };

    const FeatureRequestsScreen = () => {
        document.location.href = 'http://feedback.getpolarized.io/feature-requests';
        return null;
    }

    const NotesScreen = () => {

        return (
            <NotesContainer>
                <NotesRouter/>
            </NotesContainer>
        );
    }

    return (
        <RepoDocMetaManagerContext.Provider value={repoDocMetaManager}>
            <MUIRepositoryRoot>
                <RepositoryRoot>
                    <PersistenceLayerContext.Provider value={{
                                                          persistenceLayerProvider: app.persistenceLayerProvider
                                                      }}>

                        <div className="RepositoryApp"
                             style={{
                                 display: 'flex',
                                 minWidth: 0,
                                 minHeight: 0,
                                 flexDirection: 'column',
                                 flexGrow: 1
                             }}>

                            <>
                                <UseLocationChangeStoreProvider>
                                    <BrowserRouter>
                                        <AnalyticsLocationListener/>
                                        <UseLocationChangeRoot>
                                            <MUIDialogController>
                                                <AddFileDropzoneRoot>
                                                    <>
                                                        <Switch>

                                                            {/*<Route exact path={["/login", "/login.html"]}>*/}
                                                            {/*    <LoginScreen/>*/}
                                                            {/*</Route>*/}

                                                            <Route exact path={["/create-account"]}>
                                                                <CreateAccountScreen/>
                                                            </Route>

                                                            <Route exact path={["/sign-in", "/login", "/login.html"]}>
                                                                <SignInScreen/>
                                                            </Route>

                                                            <Route exact path={["/login-with-custom-token"]}>
                                                                <LoginWithCustomTokenScreen/>
                                                            </Route>

                                                            <Route exact path="/error">
                                                                <ErrorScreen/>
                                                            </Route>

                                                            <Route exact path="/migration/phz">
                                                                <PHZMigrationScreen/>
                                                            </Route>

                                                            <Route>
                                                                <AuthRequired>
                                                                    <PrefsContext2>
                                                                        <UserTagsDataLoader>
                                                                            <BlockStoreDefaultContextProvider>
                                                                                <BlocksStoreProvider>
                                                                                    <PersistenceLayerApp tagsType="documents"
                                                                                                         repoDocMetaManager={repoDocMetaManager}
                                                                                                         repoDocMetaLoader={repoDocMetaLoader}
                                                                                                         persistenceLayerManager={persistenceLayerManager}>
                                                                                        <DocRepoStore2>
                                                                                            <>
                                                                                                <div style={{
                                                                                                         display: 'flex',
                                                                                                         minWidth: 0,
                                                                                                         minHeight: 0,
                                                                                                         flexGrow: 1
                                                                                                     }}>

                                                                                                    <>
                                                                                                        <ZenModeGlobalHotKeys/>
                                                                                                        <ZenModeDeactivateButton/>
                                                                                                        <SideNav/>
                                                                                                        <Divider orientation="vertical"/>
                                                                                                    </>

                                                                                                    <MainRenderer>

                                                                                                        <PersistentRoute strategy="display" exact path="/">
                                                                                                            <RenderDefaultScreen/>
                                                                                                        </PersistentRoute>

                                                                                                        <PersistentRoute strategy="display" exact path="/annotations">
                                                                                                            <RenderAnnotationRepoScreen/>
                                                                                                        </PersistentRoute>

                                                                                                        <SideNavDocuments persistenceLayerProvider={app.persistenceLayerProvider}
                                                                                                                          repoDocMetaManager={props.repoDocMetaManager}
                                                                                                                          repoDocMetaLoader={props.repoDocMetaLoader}
                                                                                                                          persistenceLayerManager={props.persistenceLayerManager}/>

                                                                                                        <Switch location={ReactRouters.createLocationWithPathOnly()}>

                                                                                                            <Route exact path='/whats-new'
                                                                                                                   render={renderWhatsNewScreen}/>

                                                                                                            <Route exact path='/invite' render={renderInvite}/>

                                                                                                            <Route exact path='/plans' render={premiumScreen}/>

                                                                                                            <Route exact path='/premium' render={premiumScreen}/>

                                                                                                            <Route exact path='/support' render={supportScreen}/>

                                                                                                            <Route exact path='/stats'
                                                                                                                   component={renderStatsScreen}/>

                                                                                                            <Route exact path="/settings"
                                                                                                                   component={RenderSettingsScreen}/>

                                                                                                            <Route exact path="/logs"
                                                                                                                   component={LogsScreen}/>

                                                                                                            <Route exact path="/device"
                                                                                                                   component={renderDeviceScreen}/>

                                                                                                            <Route exact path="/feature-requests"
                                                                                                                   component={FeatureRequestsScreen}/>

                                                                                                            <Route path="/notes"
                                                                                                                   component={NotesScreen}/>

                                                                                                        </Switch>


                                                                                                    </MainRenderer>
                                                                                                </div>

                                                                                                {/* the following are small popup screens that can exist anywhere */}
                                                                                                <Switch location={ReactRouters.createLocationWithHashOnly()}>

                                                                                                    <Route path='#welcome'
                                                                                                           component={() =>
                                                                                                               <WelcomeScreen/>
                                                                                                           }/>

                                                                                                    <Route path='#account'
                                                                                                           component={() =>
                                                                                                               <AccountDialogScreen/>
                                                                                                           }/>

                                                                                                    <Route path='#add'>
                                                                                                        <PersistenceLayerContext.Provider value={{persistenceLayerProvider: app.persistenceLayerProvider}}>
                                                                                                            <AddFileDropzoneScreen/>
                                                                                                        </PersistenceLayerContext.Provider>
                                                                                                    </Route>

                                                                                                </Switch>
                                                                                            </>
                                                                                        </DocRepoStore2>
                                                                                    </PersistenceLayerApp>
                                                                                </BlocksStoreProvider>
                                                                            </BlockStoreDefaultContextProvider>
                                                                        </UserTagsDataLoader>
                                                                    </PrefsContext2>
                                                                </AuthRequired>
                                                            </Route>

                                                        </Switch>

                                                    </>
                                                </AddFileDropzoneRoot>

                                            </MUIDialogController>
                                        </UseLocationChangeRoot>
                                 </BrowserRouter>
                                </UseLocationChangeStoreProvider>
                            </>

                        </div>
                    </PersistenceLayerContext.Provider>
                </RepositoryRoot>
            </MUIRepositoryRoot>
        </RepoDocMetaManagerContext.Provider>
    );

});
