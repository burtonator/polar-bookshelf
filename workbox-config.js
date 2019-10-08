const fs = require('fs');
const libpath = require('path');

const globDirectory = 'dist/public';

const STATIC_FILE_EXTENSIONS = ["css", "html", "png", "svg", "ico", "woff2"];
const JAVASCRIPT_AND_STATIC_FILE_EXTENSIONS = ["js", ...STATIC_FILE_EXTENSIONS];

function recurse(dir) {

    const files = fs.readdirSync(dir);

    const result  = [];

    for (const file of files) {

        const path = libpath.join(dir, file);

        const stat = fs.statSync(path);

        if (stat.isDirectory()) {
            result.push(...recurse(path));
        }

        if (stat.isFile()) {
            result.push(path);
        }

    }

    return result;

}

function toExtension(path) {

    if (! path) {
        return undefined;
    }

    const matches = path.match(/\.([a-z0-9]{1,15})$/);

    if (matches && matches.length === 2) {
        return matches[1];
    }

    return undefined;

}

/**
 * Return true if the path has one of the given extensions.
 */
function hasExtension(path, exts) {

    const ext = toExtension(path);

    if (! ext) {
        return false;
    }

    return exts.includes(ext);

}

function stripDirPrefix(path, prefix) {

    if (! prefix.endsWith(libpath.sep)) {
        prefix = prefix + libpath.sep
    }

    if (path.startsWith(prefix)) {
        return path.substring(prefix.length);
    }

    return path;

}

function createGlobsRecursively(path, exts) {

    if (! exts) {
        exts = STATIC_FILE_EXTENSIONS;
    }

    return recurse(libpath.join(globDirectory, path))
        .filter(current => hasExtension(current, exts))
        .map(current => stripDirPrefix(current, globDirectory));

}

function createPDFJSGlobs() {

    return [

        'pdfviewer/build/pdf.js',
        'pdfviewer/build/pdf.worker.js',
        'pdfviewer/web/viewer.js',
        'pdfviewer/web/viewer.css',
        'pdfviewer/web/index.html',
        'pdfviewer/web/locale/en-US/viewer.properties',
        'pdfviewer/web/locale/en-GB/viewer.properties',
        ...createGlobsRecursively('pdfviewer/web/images', ["png", "svg"]),

    ];

}

const globPatterns = [

    ...createGlobsRecursively('apps', STATIC_FILE_EXTENSIONS),
    ...createGlobsRecursively('htmlviewer', JAVASCRIPT_AND_STATIC_FILE_EXTENSIONS),

    ...createPDFJSGlobs(),

    ...createGlobsRecursively('pdfviewer-custom', JAVASCRIPT_AND_STATIC_FILE_EXTENSIONS),
    ...createGlobsRecursively('web/dist', JAVASCRIPT_AND_STATIC_FILE_EXTENSIONS),
    ...createGlobsRecursively('web/assets', JAVASCRIPT_AND_STATIC_FILE_EXTENSIONS),
    'icon.ico',
    'icon.png',
    'icon.svg',
    'index.html',
    'manifest.json',
    'apps/init.js',
    'apps/service-worker-registration.js',
    // now the custom specified resources that we need for the webapp to
    // function (scripts and CSS)
    'node_modules/firebase/firebase.js',
    'node_modules/firebaseui/dist/firebaseui.js',
    'node_modules/firebaseui/dist/firebaseui.css',
    'node_modules/react-table/react-table.css',
    'node_modules/bootstrap/dist/css/bootstrap.min.css',
    'node_modules/bootstrap/dist/css/bootstrap-grid.min.css',
    'node_modules/bootstrap/dist/css/bootstrap-reboot.min.css',
    'node_modules/toastr/build/toastr.min.css',
    'node_modules/@fortawesome/fontawesome-free/css/all.min.css',
    'node_modules/@burtonator/react-dropdown/dist/react-dropdown.css',
    'node_modules/summernote/dist/summernote-bs4.css',

];

console.log("Using static file globs: \n ", globPatterns.join("\n  "));
console.log("====");

module.exports = {
    globDirectory: 'dist/public',
    globPatterns,
    globIgnores: [],
    globStrict: false,
    // stripPrefix: 'dist/public',
    maximumFileSizeToCacheInBytes: 15000000,
    // runtimeCaching: [{
    //     urlPattern: /this\\.is\\.a\\.regex/,
    //     handler: 'networkFirst'
    // }]
    swDest: 'dist/public/service-worker.js',
    modifyURLPrefix: {
        // Remove a '/dist' prefix from the URLs:
        '/dist/public': ''
    }
};






