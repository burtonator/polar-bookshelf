import {MainAppController} from './MainAppController';
import {app, BrowserWindow, dialog, Menu, shell} from "electron";
import {ElectronContextMenu} from '../../contextmenu/electron/ElectronContextMenu';
import {Version} from '../../util/Version';
import {AppLauncher} from './AppLauncher';
import {Logger} from 'polar-shared/src/logger/Logger';
import {Promises} from '../../util/Promises';
import {Updates} from '../../updates/Updates';
import {Platform, Platforms} from '../../util/Platforms';
import {AnnotationSidebarClient} from '../../annotation_sidebar/AnnotationSidebarClient';
import {BrowserWindowRegistry} from '../../electron/framework/BrowserWindowRegistry';
import {Menus} from './Menus';
import {isPresent} from 'polar-shared/src/Preconditions';
import {Directories} from '../../datastore/Directories';
import {Messenger} from '../../electron/messenger/Messenger';
import {AppUpdates} from '../../updates/AppUpdates';

const log = Logger.create();

const WINDOW_TYPE = 'type';

export class MainAppMenu {

    private readonly mainAppController: MainAppController;
    private mode: MainMenuMode;

    constructor(mainAppController: MainAppController,
                mode: MainMenuMode = MainMenuMode.DOC_REPO_APP) {

        this.mainAppController = mainAppController;
        this.mode = mode;

    }

    public setup(): void {

        const menu = Menu.buildFromTemplate(this.createMenuTemplate());

        Menu.setApplicationMenu(menu);

        // noinspection TsLint
        new ElectronContextMenu();

        this.registerEventListeners();

    }

    /**
     * Register event listeners so we can hide/disable/etc menus.
     */
    private registerEventListeners() {

        app.on('browser-window-focus', (event: Electron.Event, browserWindow: BrowserWindow) => {

            const meta = BrowserWindowRegistry.get(browserWindow.id);

            const isViewer: boolean
                = isPresent(meta) &&
                meta!.tags &&
                meta!.tags[WINDOW_TYPE] === 'viewer';

            const menu = Menu.getApplicationMenu()!;

            // **** handle toggle-annotation-sidebar

            function handleToggleAnnotationSidebar() {
                const viewMenu = Menus.find(menu.items, 'view');
                const viewMenuItems = Menus.submenu(viewMenu);
                const toggleAnnotationSidebar = Menus.find(viewMenuItems, 'toggle-annotation-sidebar');

                Menus.setVisible(toggleAnnotationSidebar!, isViewer);
            }

            handleToggleAnnotationSidebar();

            // **** handle sync-flashcards-to-anki

            function handleSyncFlashcardsToAnki() {

                const toolsMenu = Menus.find(menu.items, 'tools');
                const toolsMenuItems = Menus.submenu(toolsMenu);
                const syncFlashcardsToAnkiMenuItem = Menus.find(toolsMenuItems, 'sync-flashcards-to-anki');

                Menus.setVisible(syncFlashcardsToAnkiMenuItem!, ! isViewer);

            }

            handleSyncFlashcardsToAnki();

            // **** handle annotate menu

            const annotateMenu = Menus.find(menu.items, 'annotate');

            if (annotateMenu) {

                const annotateMenuItems = Menus.submenu(annotateMenu!)!;

                annotateMenuItems.forEach(current => {
                    Menus.setEnabled(current, isViewer);
                });

            }

        });

    }

    private createMenuTemplate(): any {

        const menuTemplate: any[] = [
            this.createFileMenuTemplate(),
            this.createEditMenuTemplate(),
            // this.createAnnotateMenuTemplate(),
            this.createViewMenuTemplate(),
            this.createToolsMenuTemplate(),
            this.createWindowMenuTemplate(),
            this.createHelpMenuTemplate()
        ];

        if (Platforms.get() === Platform.MACOS) {
            menuTemplate.unshift(this.createMacOSMenuTemplate());
        }

        return menuTemplate;

    }

    private createAboutMessage() {

        const dataDir = Directories.getDataDir().path;
        const version = Version.get();

        return '' +
            `version:  ${version}\n` +
            `data dir: ${dataDir}\n`
            ;
    }

    /**
     * Created for MacOS so that we have a 'Polar' menu before 'File' with MacOS
     * specific actions like 'hide'
     *
     */
    private createAppMenuTemplate() {

        return {
            label: 'Polar',
            id: 'polar',
            platform: 'darwin',
            submenu: [

                {role: 'about'},
                {type: 'separator'},
                {role: 'hide'},
                {role: 'hideothers'},
                {role: 'unhide'},
                {type: 'separator'},
                {role: 'quit'}

            ]

        };

    }

    private createMacOSMenuTemplate() {

        return {
            label: 'Polar',
            submenu: [

                {
                    label: 'About Polar',
                    click: () => this.showHelpAboutDialog()
                },
                {
                    type: 'separator'
                },

                { role: 'hide', label: 'Hide Polar' },
                { role: 'hideOthers' },
                { role: 'unhide' },
                { type: 'separator'},
                {
                    label: 'Quit',
                    accelerator: 'CmdOrCtrl+Q',
                    click: () => this.mainAppController.cmdExit()
                },
            ]
        };

    }

    private createFileMenuTemplate() {

        const isMacOS = Platforms.get() === Platform.MACOS;

        return {
            label: 'File',
            // accelerator: 'Ctrl+F',
            submenu: [

                {
                    label: 'Import from Disk',
                    accelerator: 'CmdOrCtrl+I',
                    click: () => {
                        this.mainAppController.cmdImport()
                            .catch((err: Error) => log.error("Could not import from disk: ", err));
                    }

                },
                {
                    label: 'Capture Web Page',
                    accelerator: 'CommandOrControl+N',
                    click: () => {
                        this.mainAppController.cmdCaptureWebPageWithBrowser()
                            .catch((err: Error) => log.error("Could not capture page: ", err));
                    }

                },

                {
                    type: 'separator'
                },

                {
                    label: 'Print',
                    accelerator: 'CmdOrCtrl+P',
                    click: (item: Electron.MenuItem, focusedWindow: BrowserWindow) => {
                        if (focusedWindow) {
                            focusedWindow.webContents.print();
                        }
                    }
                },
                // { role: 'hide', visible: isMacOS },
                // { role: 'hideOthers', visible: isMacOS },
                // { role: 'unhide', visible: isMacOS },
                // { type: 'separator', visible: isMacOS},

                {
                    type: 'separator'
                },
                {
                    role: 'quit',
                    label: 'Quit',
                    visible: ! isMacOS,
                    accelerator: 'CmdOrCtrl+Q',
                    click: () => this.mainAppController.cmdExit()
                },
            ]
        };

    }


    private createEditMenuTemplate() {
        return {
            id: 'edit',
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                // { type: 'separator' },
                // { label: 'Find', accelerator: 'CmdOrCtrl+f', click: () =>
                // InPageSearch.execute() },
                { type: 'separator' },
                { role: 'cut'},
                { role: 'copy' },
                { role: 'paste' },
                { role: 'pasteandmatchstyle' },
                { role: 'selectall' },
                { type: 'separator' },
                // {
                //     label: 'Change Pagemark Column Type',
                //     submenu: [
                //         { label: 'Single', },
                //         { label: 'Double', },
                //         { label: 'Triple', },
                //     ]
                // },
            ]
        };
    }

    private createAnnotateMenuTemplate() {

        // TODO: create pagemark
        //       Mark current page read
        //       Create new pagemark
        //

        return {
           id: 'annotate',
           label: 'Annotate',
           enabled: false,
           visible: false,
           submenu: [
                { role: 'undo', enabled: false, visible: 'false'},
                { role: 'redo' },
                // { type: 'separator' },
                // { label: 'Find', accelerator: 'CmdOrCtrl+f', click: () =>
                // InPageSearch.execute() },
                { type: 'separator' },
                { role: 'cut'},
                { role: 'copy' },
                { role: 'paste' },
                { role: 'pasteandmatchstyle' },
                { role: 'selectall' },
                { type: 'separator' },
                // {
                //     label: 'Change Pagemark Column Type',
                //     submenu: [
                //         { label: 'Single', },
                //         { label: 'Double', },
                //         { label: 'Triple', },
                //     ]
                // },
            ]
        };
    }


    private createViewMenuTemplate() {
        return {
            id: 'view',
            label: 'View',
            submenu: [
                {
                    label: 'Reload',
                    accelerator: 'CmdOrCtrl+R',
                    click: (item: Electron.MenuItem, focusedWindow: BrowserWindow) => {
                        if (focusedWindow) {
                            focusedWindow.webContents.reloadIgnoringCache();
                        }
                    }
                },
                // {
                //     label: 'Annotations Sidebar',
                //     type: 'checkbox',
                //     click: (item: Electron.MenuItem, focusedWindow:
                // BrowserWindow) => { if (focusedWindow) {
                // focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
                // } } },

                {
                    id: 'toggle-annotation-sidebar',
                    accelerator: 'F10',
                    label: 'Toggle Annotation Sidebar',
                    visible: false,
                    click: () => AnnotationSidebarClient.toggleAnnotationSidebar()
                },

                {
                    label: 'Toggle Full Screen',
                    accelerator: (function() {
                        if (process.platform === 'darwin') {
                            return 'Ctrl+Command+F';
                        } else {
                            return 'F11';
                        }
                    })(),
                    click: (item: Electron.MenuItem, focusedWindow: BrowserWindow) => {
                        if (focusedWindow) {
                            focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
                        }
                    }
                },
            ]
        };
    }

    private createWindowMenuTemplate() {
        return {
            label: 'Window',
            role: 'window',
            submenu: [
                { role: 'minimize' },
                { role: 'close' },
            ]
        };
    }

    private createToolsMenuTemplate() {
        return {
            id: 'tools',
            label: 'Tools',
            submenu: [
                {
                    label: 'Document Repository',
                    click: () => Promises.executeLogged(AppLauncher.launchRepositoryApp)
                },
                {
                    id: 'sync-flashcards-to-anki',
                    label: 'Sync Flashcards to Anki',
                    click: () => {
                        Messenger.postMessage( {
                           message: {
                               type: "start-anki-sync"
                           }
                        }).catch(err => log.error("Could not post message", err));
                    }
                },
                {type: 'separator'},
                {
                    label: 'Toggle Developer Tools',
                    click: this.mainAppController.cmdToggleDevTools
                },
            ]
        };

    }

    private createHelpMenuTemplate() {
        return {
            id: 'help',
            label: 'Help',
            role: 'help',

            submenu: [
                {
                    label: 'About',
                    click: () => this.showHelpAboutDialog()
                },
                { label: 'Documentation',
                    click: () => shell.openExternal('https://getpolarized.io/docs/') },
                {
                    id: 'check-for-updates',
                    label: 'Check for Updates',
                    // only show on Windows and MacOS as all other platforms
                    // have their own dist system (for now).
                    visible: AppUpdates.platformSupportsUpdates(),
                    click: (item: Electron.MenuItem) => Updates.checkForUpdates(item),
                },

                {type: 'separator'},

                { label: 'Donate',
                    click: () => shell.openExternal('https://opencollective.com/polar-bookshelf/donate') },

                {type: 'separator'},
                { label: 'Discord',
                    click: () => shell.openExternal('https://discord.gg/GT8MhA6') },

                { label: 'Reddit',
                    click: () => shell.openExternal('https://www.reddit.com/r/PolarBookshelf/') },

                { label: 'Learn More',
                    click: () => shell.openExternal('https://github.com/burtonator/polar-bookshelf') },
                {type: 'separator'},
                { label: 'Cookie Policy',
                    click: () => shell.openExternal('https://getpolarized.io/cookie-policy.html') },

                { label: 'Terms of Service',
                    click: () => shell.openExternal('https://getpolarized.io/terms-of-service.html') },

                { label: 'Privacy Policy',
                    click: () => shell.openExternal('https://getpolarized.io/privacy-policy.html') },

            ]
        };
    }

    private showHelpAboutDialog() {

        dialog.showMessageBox(BrowserWindow.getFocusedWindow()!, {
            type: 'info',
            buttons: ['OK'],
            title: 'Polar',
            message: this.createAboutMessage(),
            detail: '',
            // icon: APP_ICON
        });

    }

}


// TODO: this is a short term work around to enable selected options from JUST
// the editor window.
export enum MainMenuMode {
    DOC_REPO_APP,
    VIEWER_APP
}
