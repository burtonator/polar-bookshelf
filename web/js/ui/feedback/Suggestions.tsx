import * as React from 'react';
import Button from 'reactstrap/lib/Button';
import Input from 'reactstrap/lib/Input';
import {TakeExtendedSurveyButton} from './TakeExtendedSurveyButton';
import {RendererAnalytics} from '../../ga/RendererAnalytics';

export class Suggestions extends React.Component<IProps, IState> {

    private value: string = "";

    constructor(props: any, context: any) {
        super(props, context);

        this.onDone = this.onDone.bind(this);
        this.onCancel = this.onCancel.bind(this);

        this.state = {
            completed: false
        };

    }

    public render() {

        const Description = () => {

            if (this.props.description) {
                return <p>{this.props.description}</p>;
            } else {
                return <div></div>;
            }

        };

        const Form = () => {

            return <div style={{
                            width: '600px',
                            position: 'fixed',
                            right: 25,
                            bottom: 25,
                            zIndex: 9999,
                        }}
                        className="border rounded shadow bg-white p-3">

                <h3>{this.props.title}</h3>

                <div className="ml-auto mr-auto">
                    <Description/>
                </div>

                <Input type="textarea"
                       onChange={event => this.value = event.target.value}
                       style={{height: '8em'}}/>

                <div className="mt-2" style={{display: 'flex'}}>

                    <div className="ml-auto">

                        <TakeExtendedSurveyButton/>

                        <Button size="md"
                                color="secondary"
                                onClick={() => this.onCancel()}>Cancel</Button>

                        <Button size="md"
                                color="primary"
                                className="ml-1"
                                onClick={() => this.onDone()}>Send Feedback</Button>

                    </div>

                </div>

            </div>;

        };

        if (this.state.completed) {
            return <div/>;
        } else {
            return <Form/>;
        }

    }

    private onCancel() {

        if (! this.props.noEvent) {

            RendererAnalytics.event({
                category: this.props.category,
                action: 'cancel-suggestion',
            });

        }

        this.markCompleted();

    }

    private onDone() {

        if (! this.props.noEvent) {

            RendererAnalytics.event({
                category: this.props.category,
                action: 'sent-suggestion',
            });

        }

        this.markCompleted();

        if (this.props.onDone) {
            this.props.onDone(this.value);
        }

    }

    private markCompleted() {

        this.setState({
            completed: true
        });

    }

}

export interface IProps {

    readonly category: string;

    readonly title: string;

    readonly description?: string;

    /**
     * Don't send the event on form submission.  Just for testing.
     */
    readonly noEvent?: boolean;

    readonly onDone?: (text: string) => void;

}

export interface IState {
    readonly completed: boolean;
}

