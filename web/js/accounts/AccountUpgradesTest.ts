import {assert} from 'chai';
import {AccountUpgrades, AccountUsage} from "./AccountUpgrades";
import { TestingTime } from 'polar-shared/src/test/TestingTime';
import { Plans } from 'polar-accounts/src/Plans';
import {Billing} from "polar-accounts/src/Billing";
import V2PlanPlus = Billing.V2PlanPlus;
import V2PlanPro = Billing.V2PlanPro;
import { assertJSON } from '../test/Assertions';
import V2Plan = Billing.V2Plan;
import V2PlanFree = Billing.V2PlanFree;
import {Bytes} from "polar-shared/src/util/Bytes";
import isV2Grandfathered = AccountUpgrades.isV2Grandfathered;

TestingTime.freeze()

describe('AccountUpgrades', function() {


    it("isV2Grandfathered", function() {
        assert.isTrue(isV2Grandfathered('2012-03-02T11:38:49.321Z'));
        assert.isTrue(isV2Grandfathered('2020-09-02T00:00:00.000Z'));
        assert.isFalse(isV2Grandfathered('2020-10-16T00:00:00.000Z'));
    });

    it("computePlanRequiredForAccount", function() {

        const created = new Date().toISOString();

        function doTest(currentPlan: V2Plan,
                        accountUsage: AccountUsage,
                        expected: V2Plan) {

            const requiredPlan = AccountUpgrades.computePlanRequiredForAccount(Plans.toV2('free'), accountUsage);
            console.log("requiredPlan: ", requiredPlan);
            assertJSON(requiredPlan, expected);
        }

        doTest(V2PlanFree, {storageInBytes: Bytes.toBytes('200MB'), created}, V2PlanFree);
        doTest(V2PlanFree, {storageInBytes: Bytes.toBytes('400MB'), created}, V2PlanFree);
        doTest(V2PlanFree, {storageInBytes: Bytes.toBytes('900MB'), created}, V2PlanFree);
        doTest(V2PlanFree, {storageInBytes: Bytes.toBytes('1GB'), created}, V2PlanFree);
        doTest(V2PlanFree, {storageInBytes: Bytes.toBytes('2GB'), created}, V2PlanPlus);

    });

});
