import * as React from 'react';
import {Logger} from 'polar-shared/src/logger/Logger';
import CardHeader from 'reactstrap/lib/CardHeader';
import Card from 'reactstrap/lib/Card';
import CardBody from 'reactstrap/lib/CardBody';

const log = Logger.create();

export default class DonationsCard extends React.Component<any, any> {

    constructor(props: any, context: any) {
        super(props, context);

    }

    public render() {

        return (

            <Card>
                <CardHeader><b>Donate to Polar</b></CardHeader>
                <CardBody>

                    <div className="mb-2 intro">

                        <p>
                            <b>Can you make a donation to Polar? </b>
                            We have an <a
                            href="https://opencollective.com/polar-bookshelf/donate">Open
                            Collective</a> setup to accept donations.  If you use
                            Polar at work ask your employer if they can make a donation.
                            Many larger employers will both match donations and support
                            projects that help their employees.
                        </p>

                        <p className="text-center m-2">
                            <a href="https://opencollective.com/polar-bookshelf/donate" target="_blank">
                                <img src="https://opencollective.com/polar-bookshelf/donate/button@2x.png?color=blue" width="300" />
                            </a>
                        </p>

                    </div>

                </CardBody>
            </Card>

        );
    }

}

export interface IProps {

}

export interface IState {

}
