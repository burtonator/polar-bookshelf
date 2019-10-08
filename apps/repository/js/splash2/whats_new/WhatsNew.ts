import {LifecycleToggle} from '../../../../../web/js/ui/util/LifecycleToggle';
import {LifecycleEvents} from '../../../../../web/js/ui/util/LifecycleEvents';
import {Version} from '../../../../../web/js/util/Version';
import {Logger} from 'polar-shared/src/logger/Logger';

const log = Logger.create();

export class WhatsNew {

    /**
     * Return true if we're blocked by another event.
     */
    private static isBlocked() {
        return ! LifecycleToggle.isMarked(LifecycleEvents.TOUR_TERMINATED);
    }

    /**
     * Return true if this should be shown under ideal circumstances
     */
    private static shouldShow(): boolean {

        const version = Version.get();

        // by default we set the prevVersion to the current version so on the
        // initial install we don't get a whats new dialog box.
        const prevVersion =
            LifecycleToggle.get(LifecycleEvents.WHATS_NEW_VERSION)
                .getOrElse(version);

        log.debug("Comparing versions: ", {version, prevVersion});

        // TODO: this needs semver... from WhatsNewComponent (which is now deprecated)
        return prevVersion !== version;

    }

    public static doShow(): boolean {

        const isBlocked = this.isBlocked();
        const shouldShow = this.shouldShow();

        log.debug("doShow history: ", {isBlocked, shouldShow});

        return ! isBlocked && shouldShow;
    }

    public static markShown() {

        const version = Version.get();

        log.debug("Marking version shown: " + version);

        LifecycleToggle.set(LifecycleEvents.WHATS_NEW_VERSION, version);

    }

}
