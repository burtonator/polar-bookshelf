import * as React from 'react';
import {GithubStars} from './GithubStars';
import {ConditionalPrioritizedComponentRef} from '../ConditionalPrioritizedComponentRef';

export class GithubStarsRef extends ConditionalPrioritizedComponentRef {

    public readonly id = 'github-stars';

    constructor() {
        super('github-stars', 20, 'active');
    }

    public create(): JSX.Element {
        return <GithubStars settingKey={this.settingKey}/>;
    }

}
