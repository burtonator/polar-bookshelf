import Joyride, {ACTIONS, CallBackProps, EVENTS, STATUS} from 'react-joyride';
import * as React from 'react';
import {LifecycleToggle} from '../../ui/util/LifecycleToggle';
import {LifecycleEvents} from '../../ui/util/LifecycleEvents';
import {Logger} from 'polar-shared/src/logger/Logger';
import {EnhancedStep, JoyrideTours} from '../../ui/tours/JoyrideTours';
import {AppRuntime} from '../../AppRuntime';
import {Analytics} from "../../analytics/Analytics";
import {Devices} from "polar-shared/src/util/Devices";

const log = Logger.create();

const Z_INDEX = 100000;

export class Styles {

    public static IMG: React.CSSProperties = {
        maxWidth: '450px',
        maxHeight: '325px',
        marginBottom: '10px',
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
    };

    public static SPLIT_BAR_IMG: React.CSSProperties = {
        maxWidth: '225px',
        maxHeight: '225px',
        marginBottom: '10px',
        display: 'block',
        marginLeft: '5px',
        marginRight: '5px',
    };

}


export class RepositoryTour extends React.Component<IProps, IState> {

    private callback?: CallBackProps;

    private steps: EnhancedStep[];

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onCallback = this.onCallback.bind(this);
        this.createSteps = this.createSteps.bind(this);

        this.steps = this.createSteps();

        const run =
            ! LifecycleToggle.isMarked(LifecycleEvents.TOUR_TERMINATED);

        this.state = {
            run,
            stepIndex: 0
        };

    }

    public render() {

        if (! Devices.isDesktop()) {
            return null;
        }

        return (

            <Joyride
                steps={this.steps}
                continuous={true}
                callback={data => this.onCallback(data)}
                run={this.state.run}
                showProgress={true}
                showSkipButton={true}
                stepIndex={this.state.stepIndex}
                styles={{
                    options: {
                        // arrowColor: '#e3ffeb',
                        // backgroundColor: '#e3ffeb',
                        // overlayColor: 'rgba(79, 26, 0, 0.4)',
                        primaryColor: '#007bff',
                        // textColor: '#004a14',
                        // width: 900,
                        zIndex: Z_INDEX,
                    },
                    tooltipContainer: {
                        textAlign: 'left',
                    }
                }}></Joyride>

        );

    }

    private createSteps(): EnhancedStep[] {

        // TODO: show them how to use the rich text area including images,
        // HTML, etc.

        // TODO: full tour of capturing web documents

        // TODO:

        const Term = (props: any) => {
            return <b><i>{props.children}</i></b>;
        };

        const Title = (props: any) => {
            return <div style={{
                fontSize: '22px',
                marginLeft: '10px'}}>
                {props.children}
            </div>;
        };

        interface IconProps {
            className: string;
        }

        const Icon = (props: IconProps) => {
            return <div className="text-primary">
                <i className={props.className}
                   style={{
                       fontSize: '175px',
                       marginLeft: '5px',
                   }}>

                </i>
            </div>;
        };

        const steps: EnhancedStep[] = [

            // TODO: we don't really give the user a tour through the annotations view
            // TODO: we don't realy give them a tour through capturing web pages.

            JoyrideTours.createImageStep({
                target: 'header',
                // title: <Title>Document Repository</Title>,
                content: <div>
                    <h2 className="text-center">Welcome to Polar!</h2>

                    <p>
                        Polar allows you to:
                    </p>

                    <ul>

                        <li><b>Keep all your reading</b> in one place.</li>

                        <li><b>Track all your reading</b> statistics.</li>

                        <li><b>Build a personal knowledge repository</b> with <span className="text-dark" style={{backgroundColor: 'rgba(255,255,0.3)'}}><b>highlights</b></span>, tags, and annotations.</li>

                        <li><b>Permanently remember</b> facts using spaced repetition and incremental reading</li>

                    </ul>

                    <p>
                        Additionally, Polar supports <b>not just PDF</b> documents
                        but capturing <b>web content</b> and storing
                        it offline in your archive - forever!
                    </p>

                </div>,
                image: "/icon.png",
                placement: 'center'

            }),

            JoyrideTours.createImageStep({
                target: 'header',
                title: <Title>Web, Desktop and Cloud.</Title>,
                content: <div>

                    <p>
                        You're using the <b>web</b> version of Polar.
                    </p>

                    <p>
                        Polar works on both the desktop (MacOS,
                        Windows, and Linux) as well as the web (Chrome, Firefox,
                        and major browsers) and is <b>fully cloud aware</b>.
                    </p>

                    {/*<p>*/}
                    {/*    If you use the desktop version of Polar you can enable*/}
                    {/*    cloud sync which will <b>keep all your documents in*/}
                    {/*    sync</b> across all your devices and the web - and in*/}
                    {/*    near realtime!*/}
                    {/*</p>*/}

                    {/*<p>*/}
                    {/*    Note that the web version is missing a few features*/}
                    {/*    including Anki sync and web page capture and only*/}
                    {/*    supports PDF documents at the moment.*/}
                    {/*</p>*/}

                </div>,
                image: "/web/assets/images/web.svg",
                placement: 'center',
                disabled: AppRuntime.isElectron()
            }),

            // JoyrideTours.createImageStep({
            //     target: '#nav-tab-document-repository',
            //     title: <Title>Document Repository</Title>,
            //     content: <div>
            //         <p>
            //             Your documents are kept here in
            //             the <Term>document repository</Term> and
            //             can be opened by <Term>double clicking</Term>.
            //         </p>
            //
            //         <p>
            //             We went ahead and added some <b>sample documents</b> so you can
            //             see what Polar looks like in action.  You can just
            //             delete them once the tour is finished.
            //         </p>
            //     </div>,
            //     image: "/web/assets/images/files.svg"
            // }),

            {
                target: '#add-tags-dropdown',
                title: <Title>Create Folders and Tags</Title>,
                disableBeacon: true,
                content: <div>
                    <p>
                        You can create folders or tags by selecting this
                        button or right clicking on the sidebar.
                    </p>
                </div>,

                // placement: "bottom",
            },
            JoyrideTours.createImageStep({
                target: '#enable-cloud-sync, #cloud-sync-dropdown',
                title: <Title>Cloud Sync</Title>,
                content: <div>
                    <p>
                        Polar supports <Term>cloud sync</Term> which keeps all your
                        documents securely backed up in the cloud.
                        Enabling <Term>cloud sync</Term> also allows you to keep all your
                        computers that run Polar fully synchronized.
                    </p>

                    <p>
                        This works transparently and realtime across MacOS,
                        Windows, and Linux.
                    </p>
                </div>,
                image:
                    <Icon className="fas fa-cloud-upload-alt"/>,
                disabled: ! AppRuntime.isElectron()

            }),
            //
            // JoyrideTours.createImageStep({
            //     target: '#links-dropdown',
            //     title: <Title>Links</Title>,
            //     content: <div>
            //         <p>
            //             We include direct links to additional tools including
            //             our <Term>Chrome Extension</Term> and <Term>chat</Term> to
            //             enable you to discuss Polar live with the developers and
            //             other users.
            //         </p>
            //
            //     </div>,
            //     image:
            //         <Icon className="fas fa-link"/>
            //
            // }),

            {
                target: '.doc-table-col-progress',
                title: <Title>Reading Progress</Title>,
                disableBeacon: true,
                content: <div>
                    <b>Track your reading progress</b> in each document
                    with pagemarks (manually now, soon to be automatic).
                </div>,

                // placement: "bottom",
            },

            // JoyrideTours.createImageStep({
            //     target: '.doc-table-col-tags',
            //     title: <Title>Tags</Title>,
            //     content: <div>
            //         <p>
            //             Each document can be tagged to enable
            //             filtering and allow you to easily manage your documents.
            //         </p>
            //
            //         <p>Tags for documents are also assigned to your annotations.</p>
            //
            //     </div>,
            //     image:
            //         <Icon className="fa fa-tag"/>
            //
            // }),


            {
                target: '.doc-dropdown',
                disableBeacon: true,
                content: <div>

                    Documents can be <b>tagged, flagged, archived or deleted</b>.

                    {/*<p>*/}
                    {/*    Documents can*/}
                    {/*    be <Term>tagged</Term>, <Term>flagged</Term>, <Term>archived</Term> and <Term>deleted</Term> by using*/}
                    {/*    these buttons to the right.*/}
                    {/*</p>*/}

                    {/*<p>*/}
                    {/*     The <Term>tag</Term> button allow you to assign new <b><i>tags</i></b> a document*/}
                    {/*</p>*/}

                    {/*<p>*/}
                    {/*     The <Term>flag</Term> button allow you to mark important*/}
                    {/*     documents.  Once flagged you can use the <Term>filter bar</Term> to*/}
                    {/*     show only flagged documents.*/}
                    {/*</p>*/}

                    {/*<p>*/}
                    {/*    The <Term>archive</Term> button allow you to*/}
                    {/*    hide a document once read.  It's usually best to*/}
                    {/*    archive a document once it's been read.*/}
                    {/*</p>*/}

                </div>,
                styles: {
                    tooltip: {
                        width: '650px'
                    }
                },
                // placement: "bottom",
            },
            //
            // {
            //     target: '#filter-bar',
            //     disableBeacon: true,
            //     content: <div>
            //
            //         <p>
            //             The <Term>filter bar</Term> allows you to configure
            //             which documents are visible.
            //         </p>
            //
            //         <p>
            //             You can hide/show documents that are flagged, archived and
            //             also filter by tags or search by title.
            //         </p>
            //
            //         <p>
            //             You can also sort by the columns to build queues to determine what you should read next.
            //             Flags can be used to manage your primary/active reading.
            //         </p>
            //
            //     </div>,
            //     styles: {
            //         tooltip: {
            //             width: '650px'
            //         }
            //     },
            // },

            // {
            //     title: <Title>Annotations</Title>,
            //     target: '#nav-tab-annotations',
            //     content: <div>
            //         The <Term>annotations view</Term> allows you to view all your annotations including highlights,
            //         comments, and flashcards.
            //     </div>,
            // },
            // JoyrideTours.createImageStep({
            //     target: '#nav-tab-statistics',
            //     title: <Title>Statistics View</Title>,
            //     content: <div>
            //         <p>
            //             The <Term>statistics view</Term> allows you
            //             to view important statistics regarding your reading,
            //             documents, and annotations including the rate of new
            //             documents and statistics on your tags.
            //         </p>
            //     </div>,
            //     image: "/web/assets/images/statistics.svg",
            // }),

            // JoyrideTours.createImageStep({
            //     target: 'header',
            //     content: <div>
            //
            //         <h2>Thanks for taking the Tour</h2>
            //
            //         <p>
            //             You next step needs to be adding documents.  Just click the <Term>add</Term> button or install
            //             the chrome extension to capture web pages.
            //         </p>
            //
            //     </div>,
            //     image: "/icon.png",
            //     placement: 'center'
            //
            // }),
            {
                target: '#add-content-dropdown',
                title: <Title>Add Documents</Title>,
                content: <div>
                    <p>
                        Get started now by <b>clicking here to upload your first document</b>.
                    </p>

                </div>,
            },

            // {
            //     target: 'header',
            //     content: <div>
            //
            //         <h2 className="text-center">Thanks for taking the tour!</h2>
            //
            //         <p>
            //             Now that you understand Polar your next steps are to
            //             add documents.
            //         </p>
            //
            //         <div className="text-center">
            //             <Feedback category="tour-feedback"
            //                       title="How likely are you to continue using Polar?"
            //                       description="We wanted to get your initial thoughts after taking the tour."
            //                       from="Not likely"
            //                       to="Very likely"
            //                       unsure={true}/>
            //         </div>
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

            //
            // {
            //     target: '.doc-table-col-added',
            //     title: <Title>Sorting</Title>,
            //     disableBeacon: true,
            //     content: <div>
            //         We keep track of the time a document
            //         was <Term>added</Term> and <Term>updated</Term> so
            //         you can sort by time to read the most recently added (or
            //         updated) documents first.
            //     </div>,
            //     // placement: "bottom",
            // },
            //
            // {
            //     target: '.doc-table-col-title',
            //     disableBeacon: true,
            //     content: <div>
            //         The title of the document is automatically set when it's
            //         added but you can change it at any time
            //     </div>,
            //     // placement: "bottom",
            // },
            //


            // {
            //     target: '.doc-dropdown',
            //     disableBeacon: true,
            //     content:  <div>
            //         The dropdown allow you perform other actions on a
            // document including changing the title and deleting documents.
            // </div>, // placement: "bottom", },   // // { //     // target:
            // '#doc-repo-table .rt-tbody > div:nth-child(-n+4)', //
            // target: '#doc-repo-table .rt-tbody > div:nth-child(-n+1)', //
            //  title: <Title>Open a document</Title>, //     disableBeacon:
            // true, //     spotlightClicks: true, //     content: <div> // //
            //        <i className="fas fa-book-open text-primary" //
            //  style={{fontSize: '150px'}}></i> // //         <p> //
            //   Let's open a document. //         </p> // //         <p> //
            //          Go ahead and <Term>double click</Term> on the //             highlighted document row and a new window will open. //         </p> // //     </div>, //     // placement: "bottom", // },

        ];

        return steps.filter(current => ! current.disabled);

    }

    private onCallback(callbackProps: CallBackProps): void {

        this.callback = callbackProps;

        // Analytics.event({category: 'tour', action: 'did-step-' + callbackProps.index});

        const step: EnhancedStep = callbackProps.step;

        if (callbackProps.action === 'update' && step.autoNext) {

            const nextStep = this.steps[callbackProps.index + 1];

            const nextHandler = (): boolean => {

                if (nextStep.target instanceof HTMLElement) {
                    return true;
                }

                const selector = nextStep.target;

                return document.querySelector(selector) != null;

            };

            let mutationObserver: MutationObserver;

            const mutationHandler = () => {

                if (nextHandler()) {
                    mutationObserver.disconnect();

                    const stepIndex = this.state.stepIndex + 1;

                    this.setState({
                        ...this.state,
                        stepIndex,
                        run: false
                    });

                }

            };

            mutationObserver = new MutationObserver(mutationHandler);

            mutationObserver.observe(document.body, {
                childList: true,
                attributes: true,
                subtree: true
            });

            // call it once manually after the event was registered as the
            // element might already be visible in the DOM at which point we're
            // already done.
            mutationHandler();

        }

        if (callbackProps.status === STATUS.SKIPPED || callbackProps.status === STATUS.FINISHED) {

            try {

                // this.setState({ run: false, stepIndex: 0 });

                switch (callbackProps.status) {
                    case STATUS.SKIPPED:
                        // Analytics.event({category: 'tour-result', action: 'skipped'});
                        // Analytics.event({category: 'tour-skip', action: 'skipped-at-step-' + callbackProps.index});

                        LifecycleToggle.mark(LifecycleEvents.TOUR_SKIPPED);
                        break;
                    case STATUS.FINISHED:
                        // Analytics.event({category: 'tour-result', action: 'finished'});

                        LifecycleToggle.mark(LifecycleEvents.TOUR_FINISHED);
                        break;
                }

            } finally {
                LifecycleToggle.mark(LifecycleEvents.TOUR_TERMINATED);
            }

        } else if (callbackProps.type === EVENTS.STEP_AFTER) {

            if ( ! this.state.run) {

                setTimeout(() => {

                    this.setState({
                        ...this.state,
                        run: true
                    });

                }, 250);

                return;

            }

            this.doStep(callbackProps);

        } else if (callbackProps.type === EVENTS.TARGET_NOT_FOUND) {

            // TODO: add a DOM event listener to wait for it to become
            // available???

            log.warn("Not found: ", callbackProps);

            this.doStep(callbackProps);
        }

    }

    private doStep(callBackProps: CallBackProps) {

        const stepIndex = callBackProps.index + (callBackProps.action === ACTIONS.PREV ? -1 : 1);

        this.setState({...this.state, stepIndex });

    }


}

export interface IProps {

}

export interface IState {
    readonly run: boolean;
    readonly stepIndex: number;
}
