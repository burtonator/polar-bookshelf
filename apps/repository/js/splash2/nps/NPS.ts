import {ISODateTimeStrings} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {TimeDurations} from 'polar-shared/src/util/TimeDurations';
import {Logger} from 'polar-shared/src/logger/Logger';
import {Version} from '../../../../../web/js/util/Version';
import {LifecycleToggle} from '../../../../../web/js/ui/util/LifecycleToggle';
import {UserState} from '../UserState';
import {LocalPrefs} from '../../../../../web/js/util/LocalPrefs';

const log = Logger.create();

export const PREF_KEY = 'net-promoter-score';

export class NPS {

    constructor(private readonly userState: UserState) {

    }

    private hasMinimumUsage() {

        const {datastoreCreated} = this.userState;

        if (datastoreCreated) {

            const since = ISODateTimeStrings.parse(datastoreCreated);

            if (TimeDurations.hasElapsed(since, '1w')) {
                return true;
            }

        }

        return false;

    }

    private hasExpired() {
        return ! LocalPrefs.isDelayed(PREF_KEY, '1w');
    }

    private shouldShow(): boolean {

        const hasMinimumUsage = this.hasMinimumUsage();
        const hasExpired = this.hasExpired();

        return hasMinimumUsage && hasExpired;

    }

    public doShow(): boolean {

        const shouldShow = this.shouldShow();

        log.debug("doShow history: ", { shouldShow });

        return !shouldShow;
    }

    public static markShown() {

        const version = Version.get();

        log.debug("Marking version shown: " + version);

        LifecycleToggle.set(PREF_KEY, version);

    }

}
