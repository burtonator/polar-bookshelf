import {FilePaths} from "polar-shared/src/util/FilePaths";
import {AppPath} from "./AppPath";

export class AppPaths {

    public static requireRelative(relativePath: string) {
        const entryPoint = FilePaths.join(AppPath.get(), relativePath);
        require(entryPoint);
    }

}
