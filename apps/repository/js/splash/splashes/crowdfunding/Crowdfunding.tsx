/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {Splash} from '../../Splash';
import {CrowdfundingCampaign} from '../../../../../../web/js/ui/crowdfunding/CrowdfundingCampaign';

export class Crowdfunding extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
    }

    public render() {

        const settingKey = 'crowdfunding-campaign-splash';

        return <Splash settingKey={settingKey}
                       disableDontShowAgain={true}>

            <CrowdfundingCampaign/>;

        </Splash>;
    }

}

interface IProps {
}

interface IState {
}

