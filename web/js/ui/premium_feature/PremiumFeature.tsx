/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {Analytics} from "../../analytics/Analytics";
import {useUserInfoContext} from "../../apps/repository/auth_handler/UserInfoProvider";
import {UpgradeButton} from './UpgradeButton';
import {Plans} from "polar-accounts/src/Plans";
import {Billing} from 'polar-accounts/src/Billing';

export type UISize = 'xs' | 'sm' | 'md' | 'lg';

interface IProps {
    readonly required: Billing.Plan;
    readonly feature: string;
    readonly size: UISize;
    readonly children: React.ReactElement;
}

export const PremiumFeature = (props: IProps) => {

    const {required, feature} = props;
    const userInfoContext = useUserInfoContext();

    function onUpgrade() {
        Analytics.event({category: 'premium', action: 'upgrade-from-premium-feature-wall'});
        document.location.hash = "plans";
    }

    const PremiumFeatureWarningSM = () => {
        return <div>
            <UpgradeButton required={required} feature={feature}/>
        </div>;

    };

    const PremiumFeatureWarningMD = () => {
        return <div>

            <div style={{filter: 'blur(8px)'}}>
                {props.children}
            </div>

            <div className="text-center mt-1">
                <UpgradeButton required={required} feature={feature}/>
            </div>

        </div>;

    };
    const PremiumFeatureWarning = () => {
        const {size} = props;

        switch (size) {
            case "xs":
                return <PremiumFeatureWarningSM/>;
            case "sm":
                return <PremiumFeatureWarningSM/>;
            case "md":
                return <PremiumFeatureWarningMD/>;
            case "lg":
                return <PremiumFeatureWarningMD/>;
        }

    };

    const hasRequiredPlan = () => {

        if (! userInfoContext) {
            return false;
        }

        if (! userInfoContext.userInfo) {
            return false;
        }

        return Plans.hasLevel(required, userInfoContext?.userInfo?.subscription.plan);

    };

    if (hasRequiredPlan()) {
        return props.children;
    } else {
        return (
            <PremiumFeatureWarning/>
        );
    }

}


