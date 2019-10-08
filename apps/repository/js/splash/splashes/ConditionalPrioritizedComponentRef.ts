import {ConditionalSetting} from '../../../../../web/js/ui/util/ConditionalSetting';
import {PrioritizedComponentRef} from '../../../../../web/js/ui/prioritized/PrioritizedComponentManager';
import {DatastoreOverview} from '../../../../../web/js/datastore/Datastore';
import {DatastoreOverviewPolicies, UserLevel} from './DatastoreOverviewPolicies';
import {Logger} from 'polar-shared/src/logger/Logger';

const log = Logger.create();

export abstract class ConditionalPrioritizedComponentRef implements PrioritizedComponentRef {

    public abstract id: string;

    protected readonly settingKey: string;

    protected readonly defaultPriority: number;

    protected readonly userLevel: UserLevel | undefined;

    protected constructor(settingKey: string, defaultPriority: number, userLevel?: UserLevel) {
        this.settingKey = settingKey;
        this.defaultPriority = defaultPriority;
        this.userLevel = userLevel;
    }

    public priority(datastoreOverview: DatastoreOverview): number | undefined {

        const conditionalSetting = new ConditionalSetting(this.settingKey);

        if (this.userLevel && ! DatastoreOverviewPolicies.isLevel(this.userLevel, datastoreOverview)) {
            log.info("User is not at user level: " + this.userLevel);
            return undefined;
        }

        if (conditionalSetting.get().getOrElse('') === 'do-not-show-again') {
            return undefined;
        }

        if (conditionalSetting.get().getOrElse('') !== '') {

            // see if it's an integer

            const val = conditionalSetting.get().getOrElse('');

            if (val.match(/[0-9]+/)) {

                if (Date.now() > parseInt(val)) {
                    return this.defaultPriority;
                } else {
                    return undefined;
                }

            }

        }

        return this.defaultPriority;

    }

    public abstract create(): JSX.Element;

}



