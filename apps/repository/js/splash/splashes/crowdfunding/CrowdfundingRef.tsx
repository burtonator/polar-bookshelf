import * as React from 'react';
import {ConditionalPrioritizedComponentRef} from '../ConditionalPrioritizedComponentRef';
import {Crowdfunding} from './Crowdfunding';

const ID = "crowdfunding-campaign-splash";

export class CrowdfundingRef extends ConditionalPrioritizedComponentRef {

    public readonly id = ID;

    constructor() {
        super(ID, 80, "24h");
    }

    public create(): JSX.Element {
        return <Crowdfunding/>;
    }

}
