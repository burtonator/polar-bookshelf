import fs from 'fs';

// TODO this doesn't work yet as it wasn't strictly needed for our chrome
// extension update.

// load the version from the package.json file
const pkg: any = require("./package.json");
const version = pkg.version;

const buff = fs.readFileSync('web/js/util/Version.ts');

const content = buff.toString('utf-8');

content.replace(/foo/, `asdf`);
