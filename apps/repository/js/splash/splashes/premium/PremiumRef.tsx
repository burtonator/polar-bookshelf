import * as React from 'react';
import {ConditionalPrioritizedComponentRef} from '../ConditionalPrioritizedComponentRef';
import {Premium} from './Premium';

export class PremiumRef extends ConditionalPrioritizedComponentRef {

    public readonly id = 'premium';

    constructor() {
        super('premium', 40, 'premium');
    }

    public create(): JSX.Element {
        return <Premium settingKey={this.settingKey}/>;
    }

}
