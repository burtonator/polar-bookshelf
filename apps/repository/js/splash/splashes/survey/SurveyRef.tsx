import * as React from 'react';
import {ConditionalPrioritizedComponentRef} from '../ConditionalPrioritizedComponentRef';
import {Survey} from './Survey';

export class SurveyRef extends ConditionalPrioritizedComponentRef {

    public readonly id = 'survey';

    constructor() {
        super('survey', 30, 'active');
    }

    public create(): JSX.Element {
        return <Survey settingKey={this.settingKey}/>;
    }

}
