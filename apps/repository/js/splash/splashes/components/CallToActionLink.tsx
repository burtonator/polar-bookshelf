import React from 'react';
import {EventTrackedLink} from './EventTrackedLink';

/**
 * A simple button which is a call to action, loads a link, but also sends an
 * event when it's acted upon.
 */
export class CallToActionLink extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
    }

    public render() {
        return (

            <EventTrackedLink href={this.props.href}
                              eventCategory={this.props.eventCategory}
                              eventAction='clicked'>

                {this.props.children}

            </EventTrackedLink>

        );
    }

}

interface IProps {
    readonly href: string;
    readonly eventCategory: string;
}

interface IState {
}

