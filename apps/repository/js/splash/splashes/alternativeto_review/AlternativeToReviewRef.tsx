import * as React from 'react';
import {ConditionalPrioritizedComponentRef} from '../ConditionalPrioritizedComponentRef';
import {AlternativeToReview} from './AlternativeToReview';

const ID = 'alternative-to-review';

export class AlternativeToReviewRef extends ConditionalPrioritizedComponentRef {

    public readonly id = ID;

    constructor() {
        super(ID, 20, 'active');
    }

    public create(): JSX.Element {
        return <AlternativeToReview settingKey={this.settingKey}/>;
    }

}
