import * as React from 'react';
import {ConditionalPrioritizedComponentRef} from '../ConditionalPrioritizedComponentRef';
import {ChromeExtensionReview} from './ChromeExtensionReview';

const ID = 'chrome-extension-review';

export class ChromeExtensionReviewRef extends ConditionalPrioritizedComponentRef {

    public readonly id = ID;

    constructor() {
        super(ID, 30, 'active');
    }

    public create(): JSX.Element {
        return <ChromeExtensionReview settingKey={this.settingKey}/>;
    }

}
