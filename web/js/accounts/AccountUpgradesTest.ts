import {assert} from 'chai';
import {AccountUpgrades} from "./AccountUpgrades";

describe('AccountUpgrades', function() {

    it("upgradeRequired", function() {

        assert.isUndefined(AccountUpgrades.upgradeRequired('free', {storageInBytes: 200000000}));
        assert.equal(AccountUpgrades.upgradeRequired('free', {storageInBytes: 400000000}), 'bronze');
        assert.equal(AccountUpgrades.upgradeRequired('bronze', {storageInBytes: 6000000000}), 'gold');

    });

});
