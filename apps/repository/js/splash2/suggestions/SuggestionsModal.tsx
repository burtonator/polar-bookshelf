/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {Feedback} from '../../../../../web/js/ui/feedback/Feedback';
import {Rating} from '../../../../../web/js/ui/feedback/Feedback';
import {Toaster} from '../../../../../web/js/ui/toaster/Toaster';
import {MachineIDs} from '../../../../../web/js/util/MachineIDs';
import {ISODateTimeStrings} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {UserFeedbacks} from '../../../../../web/js/telemetry/UserFeedback';
import {Suggestions} from '../../../../../web/js/ui/feedback/Suggestions';
import {LocalPrefs} from '../../../../../web/js/util/LocalPrefs';
import {SplashKeys} from '../SplashKeys';
import {UserFeedback} from '../../../../../web/js/telemetry/UserFeedback';
import {NetPromoterScore} from '../../../../../web/js/telemetry/UserFeedback';
import {RendererAnalytics} from '../../../../../web/js/ga/RendererAnalytics';
import {Version} from '../../../../../web/js/util/Version';

export class SuggestionsModal extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.onSuggestion = this.onSuggestion.bind(this);
    }

    public render() {

        return (

            <Suggestions category={"user-suggestions"}
                         title={"How should we improve Polar?"}
                         description="We need your help to improve Polar!  In your opinion what should we do to make it better?"
                         onDone={text => this.onSuggestion(text)}/>

        );
    }

    private onSuggestion(text: string) {

        Toaster.success("Thanks for your feedback!");

        const netPromoterScore = LocalPrefs.get(SplashKeys.NET_PROMOTER_SCORE)
            .map(current => Number.parseInt(current))
            .map(current => current as NetPromoterScore)
            .getOrNull();

        if (netPromoterScore === null) {
            RendererAnalytics.event({category: 'suggestions-splash', action: 'no-nps'});
        }

        const version = Version.get();

        const userFeedback: UserFeedback = {
            machine: MachineIDs.get(),
            text,
            netPromoterScore,
            created: ISODateTimeStrings.create(),
            version
        };

        UserFeedbacks.write(userFeedback)
            .catch(err => console.error("Unable to write user feedback: ", err));

    }
}

interface IProps {
}

interface IState {
}

