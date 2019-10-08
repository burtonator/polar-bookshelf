/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {Splash} from '../../Splash';
import {EmbeddedImages} from '../../../splash2/whats_new/EmbeddedImages';
import {SplitLayout, SplitLayoutLeft} from '../../../../../../web/js/ui/split_layout/SplitLayout';
import {EventTrackedLink} from '../components/EventTrackedLink';
import {SplitLayoutRight} from '../../../../../../web/js/ui/split_layout/SplitLayoutRight';

const LINK = 'https://chrome.google.com/webstore/detail/save-to-polar/jkfdkjomocoaljglgddnmhcbolldcafd/';
const EVENT_CATEGORY = 'splash-chrome-extension-review';

export class ChromeExtensionReview extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
    }

    public render() {
        return (

            <Splash settingKey={this.props.settingKey}>

                <SplitLayout>

                    <SplitLayoutLeft>

                        <h2>Rate our Chrome Extension?</h2>

                        <p className="h5">
                            Could you please take <b>1 minute</b> to rate our
                            Chrome Extension?
                        </p>

                        <p className="h5">
                            These ratings greatly help other users discover Polar.
                        </p>

                        <p className="text-center mt-4">

                            <EventTrackedLink eventCategory={EVENT_CATEGORY}
                                              eventAction='clicked-cta'
                                              href={LINK}>
                                Review Polar Chrome Extension
                            </EventTrackedLink>

                        </p>

                        <p className="text-center text-muted">
                            Just select <i>Reviews</i> then click <i>Write a Review</i> on the review page.
                        </p>

                    </SplitLayoutLeft>

                    <SplitLayoutRight>

                        <div className="text-center m-2">

                            <div className="img-shadow">

                                <EventTrackedLink className=""
                                                  eventCategory='splash-chrome-extension-review'
                                                  eventAction='clicked-image'
                                                  href={LINK}>

                                    <img style={{maxHeight: '250px'}} src={EmbeddedImages.CHROME_LOGO}/>

                                </EventTrackedLink>

                            </div>

                        </div>

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

