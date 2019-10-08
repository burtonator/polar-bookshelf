import {Throttler} from '../../../web/js/datastore/Throttler';
import {RepoDocMetaLoader} from './RepoDocMetaLoader';
import {Releaseable} from '../../../web/js/reactor/EventListener';

export class RepoDocMetaLoaders {

    /**
     * Add an EventListener to the RepoDocMetaLoader that's throttled so that
     * we get periodic updates for performance reasons.
     *
     */
    public static addThrottlingEventListener(repoDocMetaLoader: RepoDocMetaLoader,
                                             callback: () => void): Releaseable {

        // DO NOT refresh too often if we get lots of documents as this really
        // locks up the UI but we also need a reasonable timeout.
        //
        // TODO: this is a tough decision as it trades throughput for latency
        // and I don't want latency in the UI.  It might be better to batch into
        // 50 items each when SENDING the events and not throttling the events
        // but throttling the actual snapshot rate.  For example, if we receive
        // a snapshot with 500 items we can just break that into say 50 items
        // each and then immediately update the UI with no trailing latency at
        // the end.  But we can throttle the actual number of snapshots so that
        // if we receive tons of snapshots with 1 item them we batch these but
        // even THEN that would add latency because we're not sure how often
        // the server is sending data.

        // TODO: consider ALWAYS sending the last event as soon as we get it
        // and clear the throttler.  This way if we receive the 100% event we
        // don't have any latency.  We're goign to need a clear() or flush()
        // method in the throttler. maybe just a force arg to exec() to force
        // this method from being called.  We might want to have a minTimeout
        // here too so that this flush behavior couldn't be triggered too often
        // but maybe we're overthinking here (for now).

        const throttlerOpts = { maxRequests: 250, maxTimeout: 500 };

        const refreshThrottler = new Throttler(() => callback(), throttlerOpts);

        return repoDocMetaLoader.addEventListener(event => {

            refreshThrottler.exec();

        });

    }

}
