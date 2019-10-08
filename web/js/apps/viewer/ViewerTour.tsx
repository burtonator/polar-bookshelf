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

export class ViewerTour extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onCallback = this.onCallback.bind(this);

        const run =
            ! LifecycleToggle.isMarked(LifecycleEvents.VIEWER_TOUR_TERMINATED) &&
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
                target: '.polar-sidebar',
                title: <Title>Document Viewer</Title>,
                content: <div>
                    <p>
                        This is the main document viewer and allows you to both
                        view and <Term>annotate</Term> documents.
                    </p>

                    <p>It supports the following features: </p>

                    <ul style={{marginLeft: '20px'}}>
                        <li>Keeping track of your reading with pagemarks.</li>
                        <li>Highlighting text within the document</li>
                        <li>Creating comments and flashcards attached to these highlights.</li>
                    </ul>
                </div>,
                image: "/web/assets/images/doc.svg",
                placement: 'center'
            }),

            {
                target: '.polar-sidebar',
                title: <Title>Annotation Sidebar</Title>,
                disableBeacon: true,
                placement: 'left-start',
                spotlightPadding: 0,
                content: <div>

                    <p>

                        The <Term>annotation sidebar</Term> lists all
                        annotations on the current document including highlights
                        , comments, and flashcards.
                    </p>

               </div>
            },
            {
                target: '#polar-progress',
                title: <Title>Progress Bar</Title>,
                disableBeacon: true,
                spotlightPadding: 0,
                content: <div>

                    <p>
                        The <Term>progress bar</Term> keeps track of how much
                        of the document you've read by using <Term>pagemarks</Term>.
                    </p>

                    <p>
                        Pagemarks are manually created by the user while reading documents.
                    </p>

                    <p>
                        To create a pagemark just <Term>right click</Term> and
                        select <Term>Create Pagemark to Point</Term>.
                    </p>

                    <p>
                        Also, when using pagemarks we will automatically resume
                        your reading by jumping to the point where you last left
                        off.
                    </p>

                </div>
            },

            {
                target: '.annotation-sidebar .text-highlight',
                title: <Title>Text Highlights</Title>,
                disableBeacon: true,
                spotlightPadding: 5,
                content: <div>

                    <p>
                        <Term>Text highlights</Term> are stored for easy
                        reference on the annotation sidebar.
                    </p>

                    <p>
                        This includes both
                        associated <Term>comments</Term> and <Term>flashcards</Term>.

                    </p>

                </div>,
                placement: 'left'
            },

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
                        // arrowColor: '#e3ffeb',
                        // backgroundColor: '#e3ffeb',
                        // overlayColor: 'rgba(79, 26, 0, 0.4)',
                        primaryColor: '#007bff',
                        // textColor: '#004a14',
                        // width: 900,
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

        RendererAnalytics.event({category: 'viewer-tour-steps', action: 'did-step-' + callbackProps.index});

        if (callbackProps.status === STATUS.SKIPPED || callbackProps.status === STATUS.FINISHED) {

            try {

                switch (callbackProps.status) {

                    case STATUS.SKIPPED:
                        RendererAnalytics.event({category: 'viewer-tour-result', action: 'skipped'});
                        RendererAnalytics.event({category: 'viewer-tour-skip', action: 'skipped-at-step-' + callbackProps.index});

                        LifecycleToggle.mark(LifecycleEvents.VIEWER_TOUR_SKIPPED);
                        break;

                    case STATUS.FINISHED:
                        RendererAnalytics.event({category: 'viewer-tour-result', action: 'finished'});

                        LifecycleToggle.mark(LifecycleEvents.VIEWER_TOUR_FINISHED);
                        break;
                }

            } finally {
                LifecycleToggle.mark(LifecycleEvents.VIEWER_TOUR_TERMINATED);
            }

        }

    }

}

export interface IProps {

}

export interface IState {
    readonly run: boolean;
}
