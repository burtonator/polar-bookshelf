import {Accounts} from "../../accounts/Accounts";
import {MachineDatastores} from "../../telemetry/MachineDatastores";
import {AccountUpgrades} from "../../accounts/AccountUpgrades";
import {UpgradeRequiredMessageBoxes} from "./UpgradeRequiredMessageBoxes";
import {RendererAnalytics} from "../../ga/RendererAnalytics";
import {Logger} from "polar-shared/src/logger/Logger";

const log = Logger.create();

export class AccountUpgrader {

    public async upgradeRequired() {

        const account = await Accounts.get();
        const machineDatastore = await MachineDatastores.get();

        if (! account) {
            return;
        }

        if (! machineDatastore) {
            return;
        }

        const planRequiredForUpgrade = AccountUpgrades.upgradeRequired(account.plan, machineDatastore);

        const result = planRequiredForUpgrade && account.plan !== planRequiredForUpgrade;

        if (result) {
            log.warn(`Current account needs to be upgrade from ${account.plan} to ${planRequiredForUpgrade}`);
        }

        return result;

    }

    public startUpgrade() {

        RendererAnalytics.event({category: 'upgrades', action: 'required-upgrade-triggered'});

        UpgradeRequiredMessageBoxes.create();

    }

}
