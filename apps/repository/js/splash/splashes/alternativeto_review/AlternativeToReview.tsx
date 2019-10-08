/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {Splash} from '../../Splash';
import {EventTrackedLink} from '../components/EventTrackedLink';

const LINK = 'https://alternativeto.net/discussions/AddThread/?urlName=applications&itemId=e992e321-70ca-4d8f-aa59-d5a2be633787&type=review';
const EVENT_CATEGORY = 'splash-alternative-to-review';

export class AlternativeToReview extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
    }

    public render() {
        return (

            <Splash settingKey={this.props.settingKey}>

                <div style={{
                    display: 'flex'
                    }}>

                    <div className="w-100">

                        <h2>Could You Review Polar on AlternativeTo?</h2>

                        <p className="h5">
                            Could you take <b>1 minute</b> and leave us a review?
                        </p>

                        <p>
                            Many users use this site to discover new software and
                            we think they could benefit from using Polar.
                        </p>

                    </div>

                    <div>

                        <p className="text-center m-2">

                            <EventTrackedLink className=""
                                              eventCategory={EVENT_CATEGORY}
                                              eventAction='clicked-image'
                                              href={LINK}>

                                <i style={{fontSize: '125px'}} className="fas fa-vote-yea"></i>

                            </EventTrackedLink>

                        </p>

                    </div>


                </div>

                <p className="text-center mt-4 p-2">

                    <EventTrackedLink eventCategory={EVENT_CATEGORY}
                                      eventAction='clicked-cta'
                                      href={LINK}>

                        Review Polar on AlternativeTo

                    </EventTrackedLink>

                </p>

            </Splash>

        );
    }

}

interface IProps {
    readonly settingKey: string;
}

interface IState {
}

