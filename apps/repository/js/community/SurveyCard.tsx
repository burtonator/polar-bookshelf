import * as React from 'react';
import {Logger} from 'polar-shared/src/logger/Logger';
import {EmbeddedImages} from '../splash2/whats_new/EmbeddedImages';
import Card from 'reactstrap/lib/Card';
import CardHeader from 'reactstrap/lib/CardHeader';
import CardBody from 'reactstrap/lib/CardBody';

const log = Logger.create();

const SURVEY_LINK = 'https://kevinburton1.typeform.com/to/BuX1Ef';

export default class SurveyCard extends React.Component<any, any> {

    constructor(props: any, context: any) {
        super(props, context);

    }

    public render() {

        return (

            <Card>
                <CardHeader><b>Take our Survey</b></CardHeader>
                <CardBody>

                    <div className="mt-2 mb-2 intro">

                        <p className="text-center">

                        <a href={SURVEY_LINK}>
                        <img src={EmbeddedImages.SURVEY}></img>
                        </a>

                        </p>

                        <p>
                        Could you take 2 minutes and <a href={SURVEY_LINK}>answer 10 questions
                        </a> about
                        your use of Polar?  We're trying to focus on the most
                        important features for our user base and your feedback
                        is critical!
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
