import Joyride, {CallBackProps, Step, STATUS} from 'react-joyride';
import * as React from 'react';
import {LifecycleToggle} from '../../ui/util/LifecycleToggle';
import {LifecycleEvents} from '../../ui/util/LifecycleEvents';
import {RendererAnalytics} from '../../ga/RendererAnalytics';
import {JoyrideTours} from '../../ui/tours/JoyrideTours';
import {AppRuntime} from '../../AppRuntime';

export class Styles {

    public static IMG: React.CSSProperties = {
        maxWidth: '450px',
        maxHeight: '325px',
        marginBottom: '10px',
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
    };

}

/**
 * Tour of the preview viewer to tell them what to do about the add-content button
 */
export class PreviewTour extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onCallback = this.onCallback.bind(this);

        const run =
            ! LifecycleToggle.isMarked(LifecycleEvents.PREVIEW_TOUR_TERMINATED) &&
            AppRuntime.isElectron();

        this.state = {
            run
        };

    }

    public render() {

        const Term = (props: any) => {
            return <b><i>{props.children}</i></b>;
        };

        const Title = (props: any) => {
            return <div style={{fontSize: '22px'}}>{props.children}</div>;
        };

        const steps: Step[] = [
            // {
            //     target: '.polar-sidebar',
            //     content: <div>
            //         <h2>Document Viewer</h2>
            //
            //         <img src="/web/assets/images/doc.svg" style={Styles.IMG}/>
            //
            //
            //     </div>,
            //     styles: {
            //         tooltip: {
            //             width: '650px'
            //         }
            //     },
            //     disableBeacon: true,
            //     placement: 'center'
            // },

            JoyrideTours.createImageStep({
                target: 'header',
                // title: <Title>Document Repository</Title>,
                content: <div>
                    <h2 className="text-center">Welcome to Polar!</h2>

                    <p>
                        This is the document preview window in Polar.
                    </p>

                    <p>
                        Polar allows you to:
                    </p>

                    <ul>

                        <li>Keep all your documents in one place.</li>

                        <li>Easily keep track of your reading with <b>pagemarks</b> and <b>stats tracking</b>.</li>

                        <li><b>Annotate</b>, <b>tag</b>, and <span className="text-dark" style={{backgroundColor: 'yellow'}}><b>highlight</b></span> all your documents and build a personal knowledge repository.</li>

                    </ul>

                    <p>
                        Additionally, Polar supports <b>not just PDF</b> documents
                        but capturing <b>web content</b> and storing
                        it offline in your archive in perpetuity.
                    </p>

                    <p>
                        The tour should take about 60 seconds.
                    </p>

                </div>,
                image: "/icon.png",
                placement: 'center'

            }),

            JoyrideTours.createImageStep({
                target: '.polar-sidebar',
                title: <Title>Document Viewer</Title>,
                content: <div>
                    <p>
                        This is the main document viewer and allows you to both
                        view and <Term>annotate</Term> documents.
                    </p>

                </div>,
                image: "/web/assets/images/doc.svg",
                placement: 'center'
            }),

        ];

        return (

            <Joyride
                steps={steps}
                continuous={true}
                callback={data => this.onCallback(data)}
                run={this.state.run}
                showProgress={true}
                showSkipButton={true}
                styles={{
                    options: {
                        primaryColor: '#007bff',
                        zIndex: 999999999,
                    },
                    tooltipContainer: {
                        textAlign: 'left',
                    }
                }}
            />

        );

    }

    private onCallback(callbackProps: CallBackProps): void {

        RendererAnalytics.event({category: 'preview-tour-steps', action: 'did-step-' + callbackProps.index});

        if (callbackProps.status === STATUS.SKIPPED || callbackProps.status === STATUS.FINISHED) {

            try {

                switch (callbackProps.status) {

                    case STATUS.SKIPPED:
                        RendererAnalytics.event({category: 'preview-tour-result', action: 'skipped'});
                        RendererAnalytics.event({category: 'preview-tour-skip', action: 'skipped-at-step-' + callbackProps.index});

                        LifecycleToggle.mark(LifecycleEvents.PREVIEW_TOUR_SKIPPED);
                        break;

                    case STATUS.FINISHED:
                        RendererAnalytics.event({category: 'preview-tour-result', action: 'finished'});

                        LifecycleToggle.mark(LifecycleEvents.PREVIEW_TOUR_FINISHED);
                        break;
                }

            } finally {
                LifecycleToggle.mark(LifecycleEvents.PREVIEW_TOUR_TERMINATED);
            }

        }

    }

}

export interface IProps {

}

export interface IState {
    readonly run: boolean;
}
