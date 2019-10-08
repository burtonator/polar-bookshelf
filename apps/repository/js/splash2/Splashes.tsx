import * as React from 'react';
import {Logger} from 'polar-shared/src/logger/Logger';
import {PersistenceLayerManager} from '../../../../web/js/datastore/PersistenceLayerManager';
import {UserFacts} from './SplashEngine';
import {SplashEngine} from './SplashEngine';
import {DefaultSplashEngine} from './SplashEngine';
import {Version} from '../../../../web/js/util/Version';
import {TimeDurations} from 'polar-shared/src/util/TimeDurations';
import {RendererAnalytics} from '../../../../web/js/ga/RendererAnalytics';
import {NPSModal} from './nps/NPSModal';
import {WhatsNewModal} from './whats_new/WhatsNewModal';
import {SuggestionsModal} from './suggestions/SuggestionsModal';

const log = Logger.create();

/**
 * This is a basic algorithm for displaying splashes which is designed to be
 * easy to manage / debug until we bring on something more sophisticated.
 *
 * This algorithm is generally very simple.
 *
 * - check if we have to display 'what's new' by seeing if the version number
 *   has incremented.
 *
 *    - if it has, display the what's new and have a timeout before we display
 *      the next message.
 *
 * - determine which additional splash to display:
 *
 *    - net-promoter-score must come first and we should only display it once
 *      per week
 *
 *    - Then, 24 hours later, should come a text prompt asking for the users
 *      feedback to improve polar.  Ask these separately spaced apart so we
 *      don't get latency.
 *
 *    - I think this should eventually be implemented via a more complex rules
 *      engine but these systems are complicated and might take 2-4 days to find
 *      one and implement that we actually like.
 *
 */
export class Splashes extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onWhatsNew = this.onWhatsNew.bind(this);
        this.onNetPromoter = this.onNetPromoter.bind(this);

        this.state = {
            splash: 'none'
        };

        this.init()
            .catch(err => log.error("Unable to init: ", err));

    }

    public render() {

        // TODO: add some callbacks on state to prevent double dialog open in
        // the future but we have a 5m latency now between these.

        switch (this.state.splash) {

            case 'none':
                return <div/>;

            case 'net-promoter':
                return <NPSModal/>;

            case 'suggestions':
                return <SuggestionsModal/>;

            case 'whats-new':
                return <div/>;
                // return <WhatsNewModal/>;

        }

    }

    private onWhatsNew() {
        RendererAnalytics.event({category: 'splash-subsystem', action: 'displaying-whats-new'});

        this.setState({...this.state, splash: 'whats-new'});
    }

    private onNetPromoter() {

        RendererAnalytics.event({category: 'splash-subsystem', action: 'displaying-net-promoter'});
        this.setState({...this.state, splash: 'net-promoter'});

    }

    private onSuggestions() {

        RendererAnalytics.event({category: 'splash-subsystem', action: 'displaying-suggestions'});
        this.setState({...this.state, splash: 'suggestions'});

    }

    private async init() {

        const userFacts = await this.computeUserFacts();

        if (userFacts) {

            const splashEngine = new DefaultSplashEngine(userFacts, {
                onWhatsNew: () => this.onWhatsNew(),
                onNetPromoter: () => this.onNetPromoter(),
                onSuggestions: () => this.onSuggestions()
            });

            this.doUpdate(splashEngine);

        } else {
            log.warn("Unable to run splash engine due to no user facts");
            RendererAnalytics.event({category: 'splash-subsystem', action: 'warn-no-user-facts'});
        }

    }

    private doUpdate(splashEngine: SplashEngine) {

        try {

            RendererAnalytics.event({category: 'splash-subsystem-background', action: 'do-update'});

            splashEngine.run();

        } finally {
            this.scheduleNextUpdate(splashEngine);
        }

    }

    private async computeUserFacts(): Promise<UserFacts | undefined> {

        const persistenceLayer = await this.props.persistenceLayerManager.getAsync();

        const datastore = persistenceLayer.datastore;

        const datastoreOverview = await datastore.overview();

        if (datastoreOverview) {

            const userFacts: UserFacts = {
                datastoreCreated: datastoreOverview.created!,
                version: Version.get()
            };

            return userFacts;

        }

        return undefined;

    }

    private scheduleNextUpdate(splashEngine: SplashEngine) {

        const delay = TimeDurations.toMillis('5m');

        setTimeout(() => {

            this.doUpdate(splashEngine);

        }, delay);

    }

}

interface IProps {
    readonly persistenceLayerManager: PersistenceLayerManager;
}

interface IState {
    readonly splash: SplashID;
}

type SplashID = 'none' | 'net-promoter' | 'whats-new' | 'suggestions';

