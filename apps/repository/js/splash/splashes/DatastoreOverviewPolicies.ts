import {DatastoreOverview} from '../../../../../web/js/datastore/Datastore';
import {TimeDurations} from 'polar-shared/src/util/TimeDurations';
import {ISODateTimeStrings} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {Logger} from 'polar-shared/src/logger/Logger';
import {Preconditions} from 'polar-shared/src/Preconditions';

const log = Logger.create();

// TODO: we need events for these on startup... it would be nice to see how many
// users were onboarded
export class DatastoreOverviewPolicies {

    public static isLevel(level: UserLevel, datastoreOverview: DatastoreOverview) {

        Preconditions.assertPresent(datastoreOverview, 'datastoreOverview');

        switch (level) {

            case 'active':
                return this.isActive(datastoreOverview);

            case 'premium':
                return this.isPremium(datastoreOverview);

            case '24h':
                return this.is24H(datastoreOverview);

        }

    }

    public static is24H(datastoreOverview: DatastoreOverview) {

        if (! datastoreOverview.created) {
            return false;
        }

        const since = ISODateTimeStrings.parse(datastoreOverview.created);
        return TimeDurations.hasElapsed(since, '1d');

    }

    /**
     * The user has onboarded and has been using the app for a while.
     */
    public static isActive(datastoreOverview: DatastoreOverview) {

        if (! datastoreOverview.created) {
            return false;
        }

        const since = ISODateTimeStrings.parse(datastoreOverview.created);
        return TimeDurations.hasElapsed(since, '1w') && datastoreOverview.nrDocs > 5;

    }

    /**
     * The user is at a premium level but may or may not have converted to
     * premium.
     */
    public static isPremium(datastoreOverview: DatastoreOverview) {

        if (! datastoreOverview.created) {
            log.debug("No created time in datastore so unable to determine premium level");
            return false;
        }

        const since = ISODateTimeStrings.parse(datastoreOverview.created);
        const elapsed = TimeDurations.hasElapsed(since, '2w');
        const hasMinDocs = datastoreOverview.nrDocs > 15;

        const result = elapsed && hasMinDocs;

        log.info(`since: ${since}, expired: ${elapsed}, hasMinDocs: ${hasMinDocs}, result: ${result}`);

        return result;

    }

}

export type UserLevel = '24h' | 'active' | 'premium';
