import {app, ipcMain} from 'electron';
import {autoUpdater, UpdateCheckResult, UpdateInfo} from 'electron-updater';
import {ProgressInfo} from "builder-util-runtime";
import {Logger} from 'polar-shared/src/logger/Logger';

import process from 'process';
import {Broadcasters} from '../ipc/Broadcasters';
import {Version} from '../util/Version';
import {AppUpdate} from './AppUpdate';
import {ToasterMessages} from '../ui/toaster/ToasterMessages';
import {ToasterMessageType} from '../ui/toaster/Toaster';
import {TimeDurations} from 'polar-shared/src/util/TimeDurations';
import {Platform, Platforms} from '../util/Platforms';
import {DistConfig} from '../dist_config/DistConfig';
import {AppUpdates} from './AppUpdates';

const ENABLE_AUTO_UPDATE = true;

const RANDOM_DELAY = TimeDurations.toRandom('3d');

// const AUTO_UPDATE_DELAY_INITIAL = TimeDurations.toMillis('2m');
// const AUTO_UPDATE_DELAY_RECHECK = TimeDurations.toMillis('1h');

const AUTO_UPDATE_DELAY_INITIAL = RANDOM_DELAY;
const AUTO_UPDATE_DELAY_RECHECK = RANDOM_DELAY;

// borrowed from here and ported to typescript:
//
// https://github.com/electron-userland/electron-builder/blob/docs/encapsulated%20manual%20update%20via%20menu.js

const log = Logger.create();

// autoDownload has to be false becuase we look at the version number we're
// downloading to avoid downloading it multiple times.
autoUpdater.autoDownload = false;

// this is so that we can
autoUpdater.allowPrerelease = process.env.POLAR_AUTO_UPDATER_ALLOW_PRERELEASE === 'true';

log.info("Allowing pre-releases for auto-updates: " + autoUpdater.allowPrerelease);

export class Updates {

    public static updateRequestedManually: boolean = false;

    public static performingUpdate: boolean = false;

    /**
     * The current version that was updated to prevent duplicate updates.
     */
    public static updatedVersion?: string | undefined;

    // export this to MenuItem click callback
    public static checkForUpdates(menuItem: Electron.MenuItem) {

        if (this.performingUpdate) {
            return;
        }

        updater = menuItem;
        updater.enabled = false;

        this.checkForUpdatesManually();

    }

    public static checkForUpdatesManually() {

        if (this.performingUpdate) {
            return;
        }

        log.info("Checking for updates manually.");

        Updates.updateRequestedManually = true;

        this.doCheckForUpdates()
            .catch(err => log.error("Error handling updates: " + err ));

    }

    public static scheduleAutoUpdate(delay: number = AUTO_UPDATE_DELAY_RECHECK) {

        log.info("Scheduling auto update for N ms: " + delay);

        setTimeout(() => this.doAutoUpdate(), delay);

    }

    public static doAutoUpdate() {

        log.info("Checking for updates...");

        this.doCheckForUpdates()
            .then((updateCheckResult) => {

                log.info("Update result: ", updateCheckResult);
                this.scheduleAutoUpdate();

            })
            .catch(err => {
                log.error("Failed to check for updates: ", err);
                this.scheduleAutoUpdate();
            });

    }

    public static async doCheckForUpdates(): Promise<UpdateCheckResult | undefined> {

        if (this.performingUpdate) {
            log.warn("Update already running. Skipping.");
            return undefined;
        }

        return await autoUpdater.checkForUpdates();

    }

    public static hasUpdated() {
        return this.updatedVersion !== undefined;
    }

    public static quitAndInstall() {
        autoUpdater.quitAndInstall();
    }

}

let updater: Electron.MenuItem | null;

// export declare type UpdaterEvents = "login" | "checking-for-update" | "update-available" | "update-cancelled" | "download-progress" | "update-downloaded" | "error";


autoUpdater.on('checking-for-update', (info: UpdateInfo) => {
    Updates.performingUpdate = true;
});

autoUpdater.on('error', (error) => {

    log.info('update error:', error);

    ToasterMessages.send({
        type: ToasterMessageType.ERROR,
        message: 'Error: ' + error == null ? "unknown" : (error.stack || error).toString()
    });

    Updates.updateRequestedManually = false;

    Updates.performingUpdate = false;

});

autoUpdater.on('update-cancelled', (info: UpdateInfo) => {
    log.info('update-cancelled');
    Updates.performingUpdate = false;
});

autoUpdater.on('update-available', (info: UpdateInfo) => {

    try {

        log.info("update-available: ", info);

        if (info && info.version) {
            const fromVersion = Version.get();
            const toVersion = info.version;

            if (Updates.updatedVersion === toVersion) {
                log.warn(`Already updated to version ${toVersion} (not re-downloading)`);
                return;
            }

            Updates.updatedVersion = toVersion;

            const appUpdate: AppUpdate = {
                fromVersion,
                toVersion,
                automatic: ! Updates.updateRequestedManually
            };

            Broadcasters.send("app-update:available", appUpdate);

            ToasterMessages.send({
                type: ToasterMessageType.INFO,
                message: `Downloading app update to version ${toVersion}`
            });

            log.info("Downloading update: " + toVersion, info);

        }

        autoUpdater.downloadUpdate()
            .then(async () => {

                log.info("Update downloaded.");

            })
            .catch(err => log.error("Error handling updates: " + err));



    } finally {
        Updates.updateRequestedManually = false;
    }

});

autoUpdater.on('update-not-available', () => {

    log.info('update-not-available');

    if (Updates.updateRequestedManually) {

        ToasterMessages.send({
            type: ToasterMessageType.INFO,
            title: 'No update available',
            message: 'The current version of Polar is up-to-date',
            options: {
                requiresAcknowledgment: true,
                preventDuplicates: true
            }
        });

        if (updater) {
            updater!.enabled = true;
            updater = null;
        }

    }

    Updates.updateRequestedManually = false;

});

autoUpdater.on('update-downloaded', () => {

    log.info('update-downloaded');

    // ToasterMessages.send({
    //     type: ToasterMessageType.SUCCESS,
    //     title: 'Update downloaded',
    //     message: 'A new update for Polar was downloaded.  Please restart.',
    //     options: {
    //         requiresAcknowledgment: true,
    //         preventDuplicates: true
    //     }
    // });

    Broadcasters.send("app-update:update-downloaded", {status: true} );

    Updates.updateRequestedManually = false;
    Updates.performingUpdate = false;

});

autoUpdater.on('download-progress', (progress: ProgressInfo) => {

    // ProgressBar

    // https://github.com/electron-userland/electron-builder/blob/docs/auto-update.md#event-download-progress
    // bytesPerSecond percent total transferred

    log.info(`Auto update download progress: ${progress.percent}. `, progress);

    // TODO: we're running in the main process here. We could use the IPC
    // broadcaster to send message to every renderer and have a controller
    // running there, listening for the messages on download progress updates
    // and then display the appropriate UI.

    Broadcasters.send("app-update:download-progress", progress);

    Broadcasters.send("download-progress", progress);

});

ipcMain.on('app-update:check-for-update', () => {
    Updates.checkForUpdatesManually();
});

ipcMain.on('app-update:quit-and-install', () => {
    autoUpdater.quitAndInstall();
});

if (ENABLE_AUTO_UPDATE && AppUpdates.platformSupportsUpdates()) {
    log.info("Auto updates enabled.");

    Updates.scheduleAutoUpdate(AUTO_UPDATE_DELAY_INITIAL);
} else {
    log.info("Auto updates disabled.");
}

