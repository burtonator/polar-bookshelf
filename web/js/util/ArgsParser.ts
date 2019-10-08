/**
 * Simple util that takes command line arguments like --foo=bar and parses them
 * into a map.
 */
import {Strings} from "polar-shared/src/util/Strings";

export class ArgsParser {

    /**
     * Convert an argument name --enable-foo in a --enable-foo=bar arg to enableFoo
     *
     * @private
     */
    static _toKey(key: string) {

        key = key.replace(/^--/, "");
        key = key.replace(/-([a-zA-Z])/g, (match) => {
            return match.replace("-", "").toUpperCase();
        });

        return key;

    }

    static parse(argv: any[]) {

        let result: {[name: string]: any} = {};

        argv.forEach((arg) => {

            if( /^--[a-zA-Z0-9_-]+=[a-zA-Z0-9_-]+/.test(arg) ) {
                let _split = arg.split("=");
                let key = ArgsParser._toKey(_split[0]);
                let value = Strings.toPrimitive(_split[1]);
                result[key] = value;
            }

        });

        return result;

    }

}
