/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {Splash} from '../../Splash';
import {EmbeddedImages} from '../../../splash2/whats_new/EmbeddedImages';
import {SplitLayout, SplitLayoutLeft} from '../../../../../../web/js/ui/split_layout/SplitLayout';
import {SplitLayoutRight} from '../../../../../../web/js/ui/split_layout/SplitLayoutRight';
import {CallToActionLink} from '../components/CallToActionLink';

export const SURVEY_LINK = 'https://kevinburton1.typeform.com/to/BuX1Ef';

// https://kevinburton1.typeform.com/to/BuX1Ef

export class Survey extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
    }

    public render() {
        return (

            <Splash settingKey={this.props.settingKey}>

                <SplitLayout>

                    <SplitLayoutLeft>

                        <h2>What do you think of Polar?</h2>

                        <p className="h5">
                            Could you take <b>2 minutes</b> and answer 10 questions about
                            your use of Polar?
                        </p>

                        <p className="text-center mt-4">


                            <CallToActionLink href={SURVEY_LINK} eventCategory='splash-survey'>
                                Provide Feedback
                            </CallToActionLink>

                        </p>

                        <p className="text-center text-muted">
                            We read <i>every</i> response and your feedback is
                            critical to the success of Polar!
                        </p>

                    </SplitLayoutLeft>

                    <SplitLayoutRight>

                        <p className="text-center m-2">

                            <i style={{fontSize: '200px'}} className="text-primary fas fa-bullhorn"></i>

                        </p>

                    </SplitLayoutRight>

                </SplitLayout>

            </Splash>

        );
    }

}

interface IProps {
    readonly settingKey: string;
}

interface IState {
}

