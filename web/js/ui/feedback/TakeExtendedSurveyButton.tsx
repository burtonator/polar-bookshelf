import * as React from 'react';
import Button from 'reactstrap/lib/Button';
import {Nav} from '../util/Nav';
import {SURVEY_LINK} from '../../../../apps/repository/js/splash/splashes/survey/Survey';

export class TakeExtendedSurveyButton extends React.Component<IProps, IState> {

    constructor(props: any, context: any) {
        super(props, context);

        this.onDone = this.onDone.bind(this);

        this.state = {
            completed: false
        };

    }

    public render() {
        return (
            <Button color="link" size="sm" onClick={() => this.onDone()}>Take Extended Survey</Button>
        );

    }

    private onDone() {

        Nav.openLinkWithNewTab(SURVEY_LINK);

    }

}

export interface IProps {

}

export interface IState {
}

