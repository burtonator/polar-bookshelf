
const assert = require('assert');
const loader = require('./index.js');

describe('Loader', function() {

    describe('_toPath', function() {

        it("with regular query data", function () {

            let href = 'file:///home/burton/projects/polar-bookshelf/pdfviewer/web/viewer.html?file=http%3A%2F%2F127.0.0.1%3A8500%2Ffiles%2F1VMrRLSDsoHG6EiwuPSKY3Dwei8KFXZZFKeeH6mkoWEhB6B8vN';

            let basedir = loader._toPath(href, "Linux");
            assert.equal(basedir, '/home/burton/projects/polar-bookshelf/pdfviewer/web/');

        });

        it("with space in path", function () {

            let href = 'file:///home/burton/projects/polar%20bookshelf/pdfviewer/web/viewer.html';

            let basedir = loader._toPath(href, "Linux");
            assert.equal(basedir, '/home/burton/projects/polar bookshelf/pdfviewer/web/');

        });

    });

    describe('_resolveFromHref', function() {

        it("with regular query data", function () {

            let href = 'file:///home/burton/projects/polar-bookshelf/pdfviewer/web/viewer.html?file=http%3A%2F%2F127.0.0.1%3A8500%2Ffiles%2F1VMrRLSDsoHG6EiwuPSKY3Dwei8KFXZZFKeeH6mkoWEhB6B8vN';

            let resolvedPath = loader._resolveFromHref(href, '../../web/js/apps/electron.js');
            assert.equal(resolvedPath, '/home/burton/projects/polar-bookshelf/web/js/apps/electron.js');

        });
    });

    describe('_resolveURL', function() {

        it("with basic data.", function () {

            let resolvedPath = loader._resolveURL('file:///home/alice/my-app/', './web/js/apps/electron.js');
            assert.equal(resolvedPath, 'file:///home/alice/my-app/web/js/apps/electron.js');

        });

        it("with query data.", function () {

            let resolvedPath = loader._resolveURL('file:///home/alice/my-app/index.html?hello=world', './web/js/apps/electron.js');
            assert.equal(resolvedPath, 'file:///home/alice/my-app/web/js/apps/electron.js');

        });

        it("with query file.", function () {

            let resolvedPath = loader._resolveURL('file:///home/alice/my-app/index.html', './web/js/apps/electron.js');
            assert.equal(resolvedPath, 'file:///home/alice/my-app/web/js/apps/electron.js');

        });

    });

    describe('_toPath (Windows_NT)', function() {

        it("with basic data.", function () {

            let resolvedPath = loader._toPath('file:///C:/Documents%20and%20Settings/davris/FileSchemeURIs.doc', 'Windows_NT');
            assert.equal(resolvedPath, 'C:\\Documents and Settings\\davris\\FileSchemeURIs.doc');

        });

    });


});
