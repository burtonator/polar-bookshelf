import * as React from 'react';
import Button from 'reactstrap/lib/Button';
import {Nav} from '../util/Nav';
import {SURVEY_LINK} from '../../../../apps/repository/js/splash/splashes/survey/Survey';

export class TakeExtendedSurvey extends React.Component<IProps, IState> {

    constructor(props: any, context: any) {
        super(props, context);

        this.onDone = this.onDone.bind(this);

        this.state = {
            completed: false
        };

    }

    public render() {
        return (

            <div className="text-center mt-2">

                <div className="text-center mt-2">
                    <Button color="link" size="sm" onClick={() => this.onDone()}>Take Extended Survey</Button>
                </div>

            </div>);

    }

    private onDone() {

        Nav.openLinkWithNewTab(SURVEY_LINK);

    }

}

export interface IProps {

}

export interface IState {
}

