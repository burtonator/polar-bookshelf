import React from 'react';
import {PreviewDisclaimer} from './PreviewDisclaimer';
import {ReactInjector} from '../../ui/util/ReactInjector';
import {LocalPrefs} from '../../util/LocalPrefs';
import {LifecycleEvents} from '../../ui/util/LifecycleEvents';
import {AppRuntime} from '../../AppRuntime';

export class PreviewDisclaimers {

    public static createWhenNecessary() {

        if (! AppRuntime.isBrowser()) {
            return;
        }

        if (LocalPrefs.isMarked(LifecycleEvents.WEBAPP_PREVIEW_WARNING_SHOWN)) {
            return;
        }

        const injectedComponent = ReactInjector.inject(<PreviewDisclaimer/>);

    }

}
