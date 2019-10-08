import BrowserWindow = Electron.BrowserWindow;
import WebContents = Electron.WebContents;
import {Logger} from 'polar-shared/src/logger/Logger';
import fs from 'fs';

const log = Logger.create();

export abstract class WebResource {

    public abstract loadBrowserWindow(browserWindow: BrowserWindow): void;

    public abstract loadWebContents(webContents: WebContents): void;

    public abstract load(loader: URLLoader): void;

    public static createFile(path: string): WebResource {
        return new FileWebResource(path);
    }

    public static createURL(url: string): WebResource {
        return new URLWebResource(url);
    }

}

export enum WebResourceType {
    FILE = "FILE",
    URL = "URL"
}

class FileWebResource extends WebResource {

    public readonly type = WebResourceType.FILE;
    public readonly file: string;

    constructor(file: string) {
        super();

        if (!fs.existsSync(file)) {
            throw new Error("File does not exist: " + file);
        }

        this.file = file;

    }

    public loadBrowserWindow(browserWindow: BrowserWindow): void {
        browserWindow.loadFile(this.file)
            .catch(err => console.error(err));

    }

    public loadWebContents(webContents: WebContents): void {
        log.info("Loading file: ", this.file);
        // webContents.loadFile(this.file);
        webContents.loadURL('file://' + this.file)
            .catch(err => console.error(err));
    }

    public load(loader: URLLoader): void {
        log.info("Loading file: ", this.file);
        loader.loadURL('file://' + this.file);
    }

    public toString(): string {
        return `${this.type}: ${this.file}`;
    }

}

class URLWebResource extends WebResource {

    public readonly type = WebResourceType.URL;

    public readonly url: string;

    constructor(url: string) {
        super();
        this.url = url;
    }

    public loadBrowserWindow(browserWindow: BrowserWindow): void {
        browserWindow.loadURL(this.url)
            .catch(err => console.error(err));
    }

    public loadWebContents(webContents: WebContents): void {
        log.info("Loading URL: ", this.url);
        webContents.loadURL(this.url)
            .catch(err => console.error(err));
    }

    public load(loader: URLLoader): void {
        log.info("Loading URL: ", this.url);
        loader.loadURL(this.url);
    }

    public toString(): string {
        return `${this.type}: ${this.url}`;
    }

}

export interface URLLoader {
    loadURL(url: string): void;
}
