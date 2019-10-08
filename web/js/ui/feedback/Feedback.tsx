import * as React from 'react';
import Button from 'reactstrap/lib/Button';
import {RendererAnalytics} from '../../ga/RendererAnalytics';
import {LeftRightSplit} from '../left_right_split/LeftRightSplit';
import {Nav} from '../util/Nav';
import {SURVEY_LINK} from '../../../../apps/repository/js/splash/splashes/survey/Survey';
import {MessageBox} from "../util/MessageBox";

export class Feedback extends React.Component<IProps, IState> {

    constructor(props: any, context: any) {
        super(props, context);

        this.onFeedback = this.onFeedback.bind(this);
        this.onUnsure = this.onUnsure.bind(this);
        this.takeExtendedSurvey = this.takeExtendedSurvey.bind(this);

        this.state = {
            completed: false
        };

    }

    public render() {

        interface FeedbackButtonProps {
            readonly rating: Rating;
            readonly background: string;
        }

        const Description = () => {

            if (this.props.description) {
                return <p className="text-center">{this.props.description}</p>;
            } else {
                return <div></div>;
            }

        };

        const UnsureButton = () => {

            if (this.props.unsure) {
                return <div>
                    <Button size='sm'
                            onClick={() => this.onUnsure()}>Not sure yet</Button>
                </div>;
            } else {
                return <div></div>;
            }

        };

        const FeedbackButton = (props: FeedbackButtonProps) => {

            let background = props.background;

            if (this.state.completed) {
                background = '#D8D8D8';
            }

            return <Button size='sm'
                           className="text-dark"
                           block={true}
                           disabled={this.state.completed}
                           style={{
                               width: '2.5em',
                               height: '2.5em',
                               margin: '5px',
                               display: 'inline-block',
                               backgroundColor: background
                           }}
                           onClick={() => this.onFeedback(props.rating)}>

                <div className="m-auto">
                    {props.rating}
                </div>

            </Button>;
        };

        const Thanks = () => {
            return <div className="text-center">

                <div className="text-success m-1">
                    <i style={{fontSize: '75px'}}
                       className="fas fa-check-circle"></i>
                </div>

                <h2>Thanks for your feedback!</h2>

            </div>;
        };

        const ButtonTable = () => {

            const colorSet = new GroupedColorSet();

            return <table className="ml-auto mr-auto">

                <tbody>
                <tr>
                    <td>

                        <div style={{
                            display: 'block',
                        }}>
                            <FeedbackButton rating={0}  background={colorSet.button0}/>

                            <FeedbackButton rating={1}  background={colorSet.button1}/>

                            <FeedbackButton rating={2}  background={colorSet.button2}/>

                            <FeedbackButton rating={3}  background={colorSet.button3}/>

                            <FeedbackButton rating={4}  background={colorSet.button4}/>

                            <FeedbackButton rating={5}  background={colorSet.button5}/>

                            <FeedbackButton rating={6}  background={colorSet.button6}/>

                            <FeedbackButton rating={7}  background={colorSet.button7}/>

                            <FeedbackButton rating={8}  background={colorSet.button8}/>

                            <FeedbackButton rating={9}  background={colorSet.button9}/>

                            <FeedbackButton rating={10} background={colorSet.button10}/>

                        </div>

                    </td>
                </tr>

                <tr>
                    <td>
                        <LeftRightSplit style={{marginLeft: '5px', marginRight: '5px'}}
                                        left={
                                            <span style={{fontWeight: 'bold'}}>{this.props.from}</span>
                                        }
                                        right={
                                            <span style={{fontWeight: 'bold'}}>{this.props.to}</span>
                                        }/>

                    </td>
                </tr>

                {/*<UnsureButton/>*/}

                </tbody>

            </table>;
        };

        const FeedbackForm = () => {

            return <MessageBox>

                <h3 className="text-center">{this.props.title}</h3>

                <div className="ml-auto mr-auto">
                    <Description/>
                </div>

                <ButtonTable/>

                <div className="text-center mt-2">
                    <Button color="link" size="sm" onClick={() => this.takeExtendedSurvey()}>Take Extended Survey</Button>
                </div>

                {this.props.footer}

            </MessageBox>;

        };

        if (this.state.completed) {
            return <div/>;
        } else {
            return <FeedbackForm/>;
        }

    }

    private onFeedback(rating: Rating) {

        if (! this.props.noEvent) {

            RendererAnalytics.event({
                                        category: this.props.category,
                                        action: `${rating}`,
                                        value: rating
                                    });

            console.log(`Sent feedback for category ${this.props.category}: ${rating}`);

        }

        this.markCompleted();

        if (this.props.onRated) {
            this.props.onRated(rating);
        }

    }

    private takeExtendedSurvey() {

        Nav.openLinkWithNewTab(SURVEY_LINK);
        this.markCompleted();

    }

    private onUnsure()  {

        if (! this.props.noEvent) {

            RendererAnalytics.event({
                                        category: this.props.category,
                                        action: `unsure`,
                                    });

            console.log(`Sent unsure feedback for category ${this.props.category}`);

        }

        this.markCompleted();

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
     * Text describing the minimum value.
     */
    readonly from: string;

    /**
     * Text describing the max value.
     */
    readonly to: string;

    /**
     * Don't send the event on form submission.  Just for testing.
     */
    readonly noEvent?: boolean;

    readonly onRated?: (rating: Rating) => void;

    /**
     * When true we include a button at the bottom so that the user can skip
     * sending the feedback.
     */
    readonly unsure?: boolean;

    readonly footer?: JSX.Element;

}

export interface IState {
    readonly completed: boolean;
}

interface ColorSet {

    readonly button0: string;
    readonly button1: string;
    readonly button2: string;
    readonly button3: string;
    readonly button4: string;
    readonly button5: string;
    readonly button6: string;
    readonly button7: string;
    readonly button8: string;
    readonly button9: string;
    readonly button10: string;

}

class LinearColorSet implements ColorSet {

    public readonly button0 = "rgba(255, 0, 0, 1.0)";
    public readonly button1 = "rgba(255, 0, 0, 1.0)";
    public readonly button2 = "rgba(255, 0, 0, 0.8)";
    public readonly button3 = "rgba(255, 0, 0, 0.6)";
    public readonly button4 = "rgba(255, 0, 0, 0.4)";
    public readonly button5 = "rgba(255, 0, 0, 0.2)";
    public readonly button6 = "rgba(0, 255, 0, 0.2)";
    public readonly button7 = "rgba(0, 255, 0, 0.4)";
    public readonly button8 = "rgba(0, 255, 0, 0.6)";
    public readonly button9 = "rgba(0, 255, 0, 0.8)";
    public readonly button10 = "rgba(0, 255, 0, 1.0)";

}

class GroupedColorSet implements ColorSet {

    public readonly button0 = "#CB5C45";
    public readonly button1 = "#CB5C45";
    public readonly button2 = "#CB5C45";
    public readonly button3 = "#CB5C45";
    public readonly button4 = "#CB5C45";
    public readonly button5 = "#CB5C45";
    public readonly button6 = "#CB5C45";
    public readonly button7 = "#EAC870";
    public readonly button8 = "#EAC870";
    public readonly button9 = "#3EC0B3";
    public readonly button10 = "#3EC0B3";

}

export type Rating = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
