// const path = require('path');
// const fs = require('fs');
// const os = require('os');
// const url = require('url');

import path from 'path';
import fs from 'fs';
import os from 'os';
import url from 'url';
import {remote} from 'electron';

declare var document: HTMLDocument;

export function injectApp(scriptSrc: string, fallbackLoader: () => void) {

    if (typeof require === 'function') {
        console.log("Loading via fallbackLoader");
        fallbackLoader();
    } else {
        console.log("Loading via script");
        injectScript(scriptSrc);
    }

}

export function injectScript(src: string, type?: string) {

    const script = document.createElement('script');
    script.src = src;

    // loading async is ugly but we're going to move to webpack and clean this
    // up eventually.
    script.async = false;
    script.defer = false;

    if (type) {
        script.type = type;
    }

    document.body.appendChild(script);

}

/**
 * Work around for the issue of loading modules with require in Electron when
 * loading file URLs and needing to access the filesystem.
 *
 * @param loadPath {string} The path to the file relative to document.location.href.
 * @private
 */
export function load(loadPath: string) {

    /**
     * The os.type() method returns a string identifying the operating system
     * name as returned by uname(3). For example 'Linux' on Linux, 'Darwin' on
     * macOS and 'Windows_NT' on Windows.
     */
    const osType = os.type();

    return _loadFromHref(document.location!.href, loadPath, osType);

}

export function loadFromAppPath(relativePath: string) {
    const appPath = remote.getGlobal("appPath");
    const entryPoint = path.join(appPath, relativePath);
    require(entryPoint);
}

/**
 *
 * @param href The URL we're currently working with in the browser.
 * @param loadPath The path we want to load.
 * @param osType  The os_type we're running under.
 * @private
 */
export function _loadFromHref(href: string, loadPath: string, osType: string) {
    const resolvedPath = _resolveFromHref(href, loadPath, osType);
    require(resolvedPath);
}

/**
 * Convert the given file: URL to a local path.
 *
 * @param href  The URL we're currently working with in the browser.
 * @param os_type The os we're running under.
 * @return {string}
 * @private
 */
export function _toPath(href: string, loadPath: string, os_type: string): string {

    if (href.startsWith('file:')) {
        return _toPathFromFileURL(href, os_type);
    }

    if (href.startsWith('http:') || href.startsWith('https:')) {
        throw new Error("http and https not supported");
        // return _toPathFromApp(href, loadPath, os_type);
    }

    throw new Error("Unable to load from href: " + href);

}

// export function _toPathFromApp(href: string, loadPath: string, os_type: string): string {
//
//     return app.getAppPath() + loadPath;
//
// }

export function _toPathFromFileURL(href: string, osType: string): string {

    let result = href;

    // remove the file URL portion

    result = result.replace('file://', '');

    // TODO: if we're on Windows we have to remove an additional '/' in the
    // path
    // https://blogs.msdn.microsoft.com/ie/2006/12/06/file-uris-in-windows/
    // https://github.com/TooTallNate/file-uri-to-path/blob/master/index.js

    // os.type is 'Windows_NT' on Windows

    if (osType === 'Windows_NT') {

        // on Windows there's a / prefix on file names.
        result = result.substring(1);

        // 3.2  Drives, drive letters, mount points, file system root
        // Drive letters are mapped into the top of a file URI in various ways,
        // depending on the implementation; some applications substitute
        // vertical bar ("|") for the colon after the drive letter, yielding
        // "file:///c|/tmp/test.txt".  In some cases, the colon is left
        // unchanged, as in "file:///c:/tmp/test.txt".  In other cases, the
        // colon is simply omitted, as in "file:///c/tmp/test.txt".
        result = result.replace(/^(.+)\|/, '$1:');

        // for Windows, we need to invert the path separators from what a URI uses
        result = result.replace(/\//g, '\\');

    }

    // now remove the filename and the query data.
    result = result.replace(/[^/.]+\.html([#?].*)?$/, '');

    result = decodeURI(result);

    return result;
}

/**
 *
 * @param from The starting URL to resolve from.
 * @param to The path to resolve based on the from URL.
 * @return {string}
 * @private
 */
export function _resolveURL(from: string, to: string) {
    return url.resolve(from, to);
}

/**
 * Performs the full resolution for us but does not do the require.
 *
 * @param href {string} The document.location.href
 * @param loadPath {string} The path expression to load.
 * @param osType The os we're running under.
 * @private
 */
export function _resolveFromHref(href: string, loadPath: string, osType: string) {

    const resolvedURL = _resolveURL(href, loadPath);

    const resolvedPath = _toPath(resolvedURL, loadPath, osType);

    if (! fs.existsSync(resolvedPath)) {
        throw new Error(`Could not find ${loadPath} (not found): ${resolvedPath}`);
    }

    return resolvedPath;

}

export interface LoadOptions {

    /**
     * When true we first determine the path from the file URL given, then we
     * change the URL via document
     */
    readonly useLocalWebURL: boolean;

}
