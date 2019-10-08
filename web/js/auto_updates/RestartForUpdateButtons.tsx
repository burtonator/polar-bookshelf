import {ReactInjector} from '../ui/util/ReactInjector';
import {RestartForUpdateButton} from './RestartForUpdateButton';
import React from 'react';

export class RestartForUpdateButtons {

    public static create() {
        ReactInjector.inject(<RestartForUpdateButton/>, 'restart-for-update');
    }

}
