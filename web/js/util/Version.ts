
const pkg: any = require("../../../package.json");

export class Version {

    public static get(): string {

        if (process && process.env && process.env.POLAR_VERSION) {
            // provide the version number from the environment so we can
            // override for testing.
            return process.env.POLAR_VERSION;
        }

        return pkg.version;

    }

}
