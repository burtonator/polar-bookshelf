import {InjectedComponent, ReactInjector} from "../util/ReactInjector";
import {UpgradeRequiredMessageBox} from "./UpgradeRequiredMessageBox";
import * as React from "react";

export class UpgradeRequiredMessageBoxes {

    public static create() {

        let injected: InjectedComponent | undefined;

        const cleanup = () => {
            injected!.destroy();
        };

        const dispose = () => {
            cleanup();
        };

        injected = ReactInjector.inject(<UpgradeRequiredMessageBox dispose={dispose}/>);

    }

}
