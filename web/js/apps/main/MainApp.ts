import {app, BrowserWindow} from 'electron';
import {CacheRegistry} from '../../backend/proxyserver/CacheRegistry';
import {Directories} from '../../datastore/Directories';
import {CaptureController} from '../../capture/controller/CaptureController';
import {DialogWindowService} from '../../ui/dialog_window/DialogWindowService';
import {MainAppController} from './MainAppController';
import {MainAppMenu} from './MainAppMenu';
import {Cmdline} from '../../electron/Cmdline';
import {Logger} from 'polar-shared/src/logger/Logger';
import {Datastore} from '../../datastore/Datastore';
import {ScreenshotService} from '../../screenshots/electron/ScreenshotService';
import {DocLoaderService} from './doc_loaders/electron/ipc/DocLoaderService';
import {AppLauncher} from './AppLauncher';
import {DocInfoBroadcasterService} from '../../datastore/advertiser/DocInfoBroadcasterService';
import process from "process";
import {AppPath} from '../../electron/app_path/AppPath';
import {MainAPI} from './MainAPI';
import {MainAppExceptionHandlers} from './MainAppExceptionHandlers';
import {FileImportClient} from '../repository/FileImportClient';
import {RendererAnalyticsService} from '../../ga/RendererAnalyticsService';
import {AnalyticsFileLoader} from './file_loaders/AnalyticsFileLoader';
import {DefaultFileLoader} from './file_loaders/DefaultFileLoader';
import {FileImportRequests} from '../repository/FileImportRequests';
import {DefaultRewrites} from "polar-backend-shared/src/webserver/DefaultRewrites";
import {WebserverConfigs} from "polar-shared-webserver/src/webserver/WebserverConfig";
import {FileRegistry} from "polar-shared-webserver/src/webserver/FileRegistry";
import {Webserver} from "polar-shared-webserver/src/webserver/Webserver";

declare var global: any;

const log = Logger.create();

const WEBSERVER_PORT = 8500;

// TODO: refactor the proxy server isn't used any longer but it is referenced
// in a number of places including the cache config and registry.
const PROXYSERVER_PORT = 8600;

export class MainApp {

    private readonly datastore: Datastore;

    constructor(datastore: Datastore) {
        this.datastore = datastore;
    }

    public async start(): Promise<MainAppStarted> {

        MainAppExceptionHandlers.register();

        // share the disk datastore with the remote.
        // TODO: move this so that we don't expose 'global' here.
        global.datastore = this.datastore;

        const webserverConfig = WebserverConfigs.create({
            dir: AppPath.get(),
            port: WEBSERVER_PORT,
            host: 'localhost',
            useSSL: false,
            rewrites: DefaultRewrites.create()
        });

        const fileRegistry = new FileRegistry(webserverConfig);

        const cacheRegistry = new CacheRegistry();

        const directories = new Directories();

        const captureController = new CaptureController(cacheRegistry, fileRegistry);

        const dialogWindowService = new DialogWindowService();

        const defaultFileLoader = new DefaultFileLoader(fileRegistry, cacheRegistry);

        const screenshotService = new ScreenshotService();
        screenshotService.start();

        new RendererAnalyticsService().start();

        await directories.init();

        log.info("Electron app path is: " + app.getAppPath());

        // *** start the webserver

        const webserver = new Webserver(webserverConfig, fileRegistry);
        await webserver.start();

        log.info("App loaded from: ", app.getAppPath());
        log.info("Stash dir: ", directories.stashDir);
        log.info("Logs dir: ", directories.logsDir);

        // NOTE: removing the next three lines removes the colors in the
        // toolbar. const appIcon = new Tray(app_icon);
        // appIcon.setToolTip('Polar Bookshelf');
        // appIcon.setContextMenu(contextMenu);

        const mainWindow = await AppLauncher.launchRepositoryApp();

        // create a session and configure it for the polar which is persistent
        // across restarts so that we do not lose cookies, etc.

        // mainSession.cookies.get({}, (err, cookies) => {
        //
        //     cookies.filter(cookie => {
        //         console.log("Found cookie: " , cookie);
        //     });
        //
        // });

        // const cacheInterceptorService =
        //     new CachingStreamInterceptorService(cacheRegistry, mainSession.protocol);

        // await cacheInterceptorService.start()
        //     .catch(err => log.error(err));

        captureController.start();

        await dialogWindowService.start();

        const fileLoader = new AnalyticsFileLoader(defaultFileLoader);

        await new DocInfoBroadcasterService().start();

        log.info("Running with process.args: ", JSON.stringify(process.argv));

        const mainAppController = new MainAppController(fileLoader, webserver);

        global.mainAppController = mainAppController;

        const mainAppAPI = new MainAPI(mainAppController, webserver);
        mainAppAPI.start();

        const mainAppService = new DocLoaderService(mainAppController);
        mainAppService.start();

        // TODO: handle the command line here.. IE if someone opens up a file
        // via argument.

        const mainAppMenu = new MainAppMenu(mainAppController);
        mainAppMenu.setup();

        app.on('open-file', async (event, path) => {

            log.info("Open file called for: ", path);
            FileImportClient.send(FileImportRequests.fromPath(path));

        });

        app.on('second-instance', async (event, commandLine) => {

            log.info("Someone opened a second instance.");

            const fileArg = Cmdline.getDocArg(commandLine);

            if (fileArg) {

                FileImportClient.send(FileImportRequests.fromPath(fileArg));

            } else {
                mainAppController.activateMainWindow();
            }

        });

        // quit when all windows are closed.
        app.on('window-all-closed', function() {

            // determine if we need to quit:
            log.info("No windows left. Quitting app.");

            const forcedExit = () => {

                try {

                    log.info("Forcing app quit...");
                    app.quit();
                    log.info("Forcing process exit...");
                    process.exit();

                } catch (e) {
                    log.error("Unable to force exit: ", e);
                }

            };

            const gracefulExit = () => {

                try {
                    mainAppController.exitApp();
                } catch (e) {
                    log.error("Failed graceful exit: ", e);
                    forcedExit();

                }

            };

            gracefulExit();


        });

        app.on('activate', async function() {

            // On OS X it's common to re-create a window in the app when the
            // dock icon is clicked and there are no other windows open. The
            // way
            // we handle this now is that if there are no windows open we
            // re-create the document repository so they can select one.
            // Otherwise we just re-focus the most recently used window.

            const visibleWindows = BrowserWindow.getAllWindows()
                .filter(current => current.isVisible());

            if (visibleWindows.length === 0) {

                AppLauncher.launchRepositoryApp()
                    .catch(err => log.error("Could not launch repository app: ", err));

            }

        });

        return {mainWindow, mainAppController};

    }

}

export interface MainAppStarted {
    mainWindow: BrowserWindow;
    mainAppController: MainAppController;
}

