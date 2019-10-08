import * as React from 'react';
import {SplashLifecycle} from '../../../../apps/repository/js/splash2/SplashLifecycle';
import {LifecycleEvents} from '../util/LifecycleEvents';
import {LocalPrefs} from '../../util/LocalPrefs';
import {RendererAnalytics} from '../../ga/RendererAnalytics';
import {DatastoreOverview} from '../../datastore/Datastore';
import {Logger} from 'polar-shared/src/logger/Logger';
import {Numbers} from "polar-shared/src/util/Numbers";

const log = Logger.create();

export class PrioritizedComponentManager extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

    }

    public render() {

        const NullComponent = () => {
            return (<div></div>);
        };

        if (! LocalPrefs.isMarked(LifecycleEvents.TOUR_TERMINATED)) {
            // no splashes unless we have the tour.
            return <NullComponent/>;
        }

        const datastoreOverview = this.props.datastoreOverview;

        const canShow = SplashLifecycle.canShow();

        const sorted =
            [...this.props.prioritizedComponentRefs]
                .filter(current => current.priority(datastoreOverview) !== undefined)
                .sort((o1, o2) => Numbers.compare(o1.priority(datastoreOverview), o2.priority(datastoreOverview)) * -1);

        log.debug("Remaining prioritized splashes: " , sorted);

        if (sorted.length === 0 || document.location!.hash !== '') {
            // return an empty div if we have no splashes OR if we have a
            // specific hash URL to load.  The splashes should only go on the
            // home page on load.

            return <NullComponent/>;
        }

        const prioritizedComponentRef = sorted[0];

        // mark this as shown so that we delay the next splash, even on refresh
        SplashLifecycle.markShown();

        RendererAnalytics.event({category: 'splashes', action: 'shown'});

        RendererAnalytics.event({category: 'splashes-shown', action: prioritizedComponentRef.id});

        // return the top ranking element.
        return prioritizedComponentRef.create();

    }

}

/**
 * Allows us to give a set or components to the
 */
export interface PrioritizedComponent {

    /**
     * Allows the component to determine its priority.  This could be used
     * to see if it needs to popup now or just some sort of static priority.
     *
     * Return undefined if the component should not be displayed.  This can be
     * used if the user has already performed a given action.
     */
    priority(): number | undefined;

}

export interface PrioritizedComponentRef {

    id: string;

    /**
     * Allows the component to determine its priority.  This could be used
     * to see if it needs to popup now or just some sort of static priority.
     *
     * Return undefined if the component should not be displayed.  This can be
     * used if the user has already performed a given action.
     */
    priority(datastoreOverview: DatastoreOverview): number | undefined;

    /**
     * Create the component when we're ready for it.
     */
    create(): JSX.Element;

}

export interface IProps {

    readonly prioritizedComponentRefs: ReadonlyArray<PrioritizedComponentRef>;

    readonly datastoreOverview: DatastoreOverview;

}

export interface IState {

}

