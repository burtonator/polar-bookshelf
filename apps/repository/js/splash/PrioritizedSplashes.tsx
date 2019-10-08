import * as React from 'react';
import {Logger} from 'polar-shared/src/logger/Logger';
import {PrioritizedComponentManager, PrioritizedComponentRef} from '../../../../web/js/ui/prioritized/PrioritizedComponentManager';
import {PersistenceLayerManager} from '../../../../web/js/datastore/PersistenceLayerManager';
import {DatastoreOverview} from '../../../../web/js/datastore/Datastore';
import {TimeDurations} from 'polar-shared/src/util/TimeDurations';
import {SplashLifecycle} from '../splash2/SplashLifecycle';

const log = Logger.create();

const MIN_DELAY = TimeDurations.toMillis('15m');

const prioritizedComponentRefs: PrioritizedComponentRef[] = [
    // new JoinDiscordRef(),
    // new WhatsNewRef(),
    // new CrowdfundingRef(),
    // new NPSRef(),
    // new GithubStarsRef(),
    // new SurveyRef(),
    // new ChromeExtensionReviewRef(),
    // new AlternativeToReviewRef(),
];

// if (DistConfig.ENABLE_PURCHASES) {
//     prioritizedComponentRefs.push(new PremiumRef());
// }

export class PrioritizedSplashes extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
            lastUpdated: 0
        };

        this.doUpdate()
            .catch(err => log.error("Unable to update: ", err));

    }

    public render() {

        if (this.state.datastoreOverview) {

            return (
                <PrioritizedComponentManager prioritizedComponentRefs={prioritizedComponentRefs}
                                             datastoreOverview={this.state.datastoreOverview}/>
            );

        } else {
            return <div/>;
        }

    }

    private async doUpdate() {

        try {

            const persistenceLayer = await this.props.persistenceLayerManager.getAsync();

            const datastore = persistenceLayer.datastore;

            const datastoreOverview = await datastore.overview();

            if (datastoreOverview) {

                this.setState({
                    datastoreOverview,
                    lastUpdated: Date.now()
                });

                log.info("Datastore overview updated");

            }

        } finally {
            this.scheduleNextUpdate();
        }

    }

    private scheduleNextUpdate() {

        const delay = SplashLifecycle.computeDelay();

        const effectiveDelay = Math.max(delay || MIN_DELAY, MIN_DELAY);

        log.debug("Scheduling next updated: ", {delay, effectiveDelay});

        setTimeout(() => {

            this.doUpdate()
                .catch(err => log.error("Unable to do update: ", err));

        }, effectiveDelay);

    }

}

interface IProps {
    readonly persistenceLayerManager: PersistenceLayerManager;
}

interface IState {
    readonly datastoreOverview?: DatastoreOverview;
    readonly lastUpdated: number;
}


