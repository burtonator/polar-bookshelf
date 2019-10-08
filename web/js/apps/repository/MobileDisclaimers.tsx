import React from 'react';
import {ReactInjector} from '../../ui/util/ReactInjector';
import {LocalPrefs} from '../../util/LocalPrefs';
import {LifecycleEvents} from '../../ui/util/LifecycleEvents';
import {MobileDisclaimer} from './MobileDisclaimer';
import {Platforms} from '../../util/Platforms';
import {Logger} from "polar-shared/src/logger/Logger";

const log = Logger.create();

export class MobileDisclaimers {

    public static createWhenNecessary() {

        if (Platforms.type() === 'desktop') {
            return;
        }

        if (Platforms.type() === 'unknown') {
            log.warn("Running on unknown platform");
            return;
        }

        if (LocalPrefs.isMarked(LifecycleEvents.MOBILE_PREVIEW_WARNING_SHOWN)) {
            return;
        }

        ReactInjector.inject(<MobileDisclaimer/>);

    }

}
