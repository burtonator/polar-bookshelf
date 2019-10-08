import {LocalPrefs} from '../../../../web/js/util/LocalPrefs';
import {Logger} from 'polar-shared/src/logger/Logger';
import {DurationMS} from 'polar-shared/src/util/TimeDurations';

const log = Logger.create();

export class SplashLifecycle {

    private static KEY = 'splash-shown';
    private static DELAY = '1d';

    public static canShow(): boolean {

        if (! navigator.onLine) {

            log.debug("Not showing due to not being online");
            // almost all the splashes (possibly all of them) require the user
            // to be online
            return false;
        }

        if (LocalPrefs.isDelayed(SplashLifecycle.KEY, SplashLifecycle.DELAY)) {
            log.debug("Splash is delayed due to " + SplashLifecycle.KEY);
            return false;
        }

        return true;

    }

    public static markShown() {
        LocalPrefs.markDelayed(this.KEY, SplashLifecycle.DELAY);
    }

    public static computeDelay(): DurationMS | undefined {
        return LocalPrefs.computeDelay(this.KEY);
    }

}
