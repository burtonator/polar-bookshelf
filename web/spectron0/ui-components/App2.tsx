import * as React from 'react';
import {Tags} from 'polar-shared/src/tags/Tags';
import {Group} from "../../js/datastore/sharing/db/Groups";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {TasksCalculator} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";
import {Lorems} from "polar-shared/src/util/Lorems";
import {Task} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {Link} from "react-router-dom";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {AccountControl} from "../../js/ui/cloud_auth/AccountControl";
import {UserInfo} from "../../js/apps/repository/auth_handler/AuthHandler";
import {DockPanel} from "../../js/ui/doc_layout/DockLayout";

const styles = {
    swatch: {
        width: '30px',
        height: '30px',
        float: 'left',
        borderRadius: '4px',
        margin: '0 6px 6px 0',
    }
};

const Folders = () => {
    return <div style={{backgroundColor: 'red', overflow: 'auto'}}>
        these are the folders
    </div>;
};

const Preview = () => {
    return <div style={{backgroundColor: 'orange', overflow: 'auto'}}>
        This is the preview
    </div>;
};


const Main = () => {
    return <div style={{backgroundColor: 'blue'}}>this is the right</div>;
};

export class App<P> extends React.Component<{}, IAppState> {

    constructor(props: P, context: any) {
        super(props, context);

    }

    public render() {


        //
        // const root: TNode<TagNode> = {
        //     id: 0,
        //     name: 'CompSci',
        //     children: [
        //         {
        //             id: 1,
        //             name: 'Linux',
        //             children: [],
        //             value: {
        //                 tag: "/CompSci/Linux"
        //             }
        //         },
        //         {
        //             id: 2,
        //             name: 'Google',
        //             children: [
        //                 {
        //                     id: 3,
        //                     name: 'Mountain View',
        //                     children: [],
        //                     value: {
        //                         tag: "/CompSci/Google/Mountain View"
        //                     }
        //                 },
        //                 {
        //                     id: 4,
        //                     name: 'San Francisco',
        //                     children: [],
        //                     value: {
        //                         tag: "/CompSci/Google/San Francisco"
        //                     }
        //                 },
        //             ],
        //             value: {
        //                 tag: "/CompSci/Google"
        //             }
        //
        //         }
        //
        //     ],
        //     value: {
        //         tag: "/CompSci"
        //     }
        // };

        // Dialogs.confirm({title: 'hello world',
        //                  subtitle: 'Some really bad stuff is happening right now which you should probably look into.',
        //                  onConfirm: NULL_FUNCTION,
        //                  type: 'danger'});
        //
        // Dialogs.prompt({title: 'New folder: ',
        //                 onCancel: NULL_FUNCTION,
        //                 onDone: NULL_FUNCTION});
        //
        // PreviewWarnings.createDialog(NULL_FUNCTION);

        const tags = [
            '/CompSci/Google',
            '/CompSci/Linux',
            '/CompSci/Microsoft',
            '/CompSci/Programming Languages/C++',
            '/CompSci/Programming Languages/Java',
            '/History/WWII',
            '/History/United States/WWII',
        ].map(current => Tags.create(current))
            .map(current => {
                const count = Math.floor(Math.random() * 100);
                return {...current, count};
            });

        // // const root: TNode<Tag> = TagNodes.create(...tags);
        // Dialogs.prompt({
        //                    title: "Enter the name of a new folder:",
        //                    validator: () => {
        //                        return {message: "it failed dude"};
        //                    },
        //                    onCancel: NULL_FUNCTION,
        //                    onDone: NULL_FUNCTION
        //
        //                });

        const group: Group = {
            nrMembers: 100,
            name: 'Linux',
            description: "A group about Linux, Ubuntu, Debian, and UNIX operating systems.",
            id: "101",
            visibility: 'public',
            created: ISODateTimeStrings.create()
        };

        const keyBindingHandler = (event: React.KeyboardEvent) => {

            if (event.key === 'F') {
                console.log("YUP!");
            }

        };


        const createReadingTaskReps = () => {

            const lorem = Lorems.mediumLength();

            const tasks: ReadonlyArray<Task<string>> = [
                {
                    id: "10102",
                    action: lorem,
                    created: ISODateTimeStrings.create(),
                    color: 'red',
                    mode: 'reading'
                },
                {
                    id: "10101",
                    action: "this is the first one",
                    created: ISODateTimeStrings.create(),
                    color: 'yellow',
                    mode: 'reading'
                },
                {
                    id: "10102",
                    action: "this is the second one",
                    created: ISODateTimeStrings.create(),
                    color: 'yellow',
                    mode: 'reading'
                },
            ];

            return tasks.map(task => TasksCalculator.createInitialLearningState(task));

        };

        // const createFlashcardTaskReps = async (): Promise<ReadonlyArray<TaskRep<FlashcardTaskAction>>> => {
        //
        //     const ref = Refs.create('1234', 'text-highlight');
        //
        //     const flashcard = Flashcards.createFrontBack('What is the capital of California? ', 'Sacramento', ref);
        //
        //     const docInfo = DocInfos.create('0x0001', 1);
        //     const repoAnnotation = RepoAnnotations.toRepoAnnotation(null!, flashcard, AnnotationType.FLASHCARD, docInfo);
        //     const repoAnnotations = [repoAnnotation];
        //
        //     return ReviewerTasks.createFlashcardTasks(repoAnnotations, 10);
        //
        // };
        //
        // const createFlashcardTaskReps = (): ReadonlyArray<TaskRep<FlashcardTaskAction>> => {
        //     const ref = Refs.create('1234', 'text-highlight');
        //
        //     const createFrontAndBackAction = () => {
        //         const flashcard = Flashcards.createFrontBack('What is the capital of California? ', 'Sacramento', ref);
        //         const flashcardTaskActions = FlashcardTaskActions.create(flashcard, docAnnotation);
        //         return flashcardTaskActions[0];
        //     };
        //
        //     const createClozeAction = () => {
        //         const flashcard = Flashcards.createCloze('The capital of california is {{c1::Sacramento}}.', ref);
        //         const flashcardTaskActions = FlashcardTaskActions.create(flashcard, docAnnotation);
        //         return flashcardTaskActions[0];
        //     };
        //
        //     const clozeAction = createClozeAction();
        //
        //     Preconditions.assertPresent(clozeAction, 'clozeAction');
        //
        //     const tasks: ReadonlyArray<Task<FlashcardTaskAction>> = [
        //         {
        //             id: "10102",
        //             action: clozeAction,
        //             created: ISODateTimeStrings.create(),
        //             color: 'red',
        //             mode: 'flashcard'
        //         },
        //         {
        //             id: "10102",
        //             action: createFrontAndBackAction(),
        //             created: ISODateTimeStrings.create(),
        //             color: 'red',
        //             mode: 'flashcard'
        //         }
        //     ];
        //
        //     return tasks.map(task => TasksCalculator.createInitialLearningState(task));
        //
        // };


        // const taskReps = createReadingTaskReps();
        // const taskReps = createFlashcardTaskReps();

        const MockTag = (props: any) => {
            return <div className="bg-grey100 p-1 rounded mr-1"
                        style={{
                        display: 'inline-block'
                   }}>
                {props.children}

                <span className="text-sm">
                    {/*<FontAwesomeIcon name="fas fa-close"/>*/}
                </span>

            </div>;
        };

        const StartReview = () => <div>start review</div>;

        const DefaultContent = () => <div>
            <Link to={{hash: '#start-review'}}>
                start review with router
            </Link>

        </div>;

        const userInfo: UserInfo = {
            displayName: "Kevin Burton",
            email: "burton@example.com",
            emailVerified: true,
            photoURL: 'https://lh5.googleusercontent.com/-BldJH1bae3o/AAAAAAAAAAI/AAAAAAAAADY/Di36-YNrKqk/photo.jpg',
            uid: "12345",
            creationTime: ISODateTimeStrings.create(),
            subscription: {
                plan: 'bronze',
                interval: 'month'
            }
        };

        const defaultComponent = () => {
            return (
                <div style={{
                         maxWidth: 400
                     }}
                     className="border p-1 shadow">
                    <AccountControl userInfo={userInfo}/>
                </div>
            );
        };

        const Joiner = () => (
            <div style={{
                     display: 'flex',
                     flexDirection: 'column',
                     width: '50px',
                     borderWidth: '2px'
                 }}>

                <div className="ml-2 mr-2"
                     style={{
                         borderBottom: '2px solid var(--secondary)',
                         height: '35px'
                     }}
                    />
                <div className="border-secondary border-top mb-auto"/>

            </div>
        );

        const dockPanels: ReadonlyArray<DockPanel> = [
            {
                id: "left-sidebar",
                type: 'fixed',
                component: <div>left</div>,
                width: 350
            },
            {
                id: "main",
                type: 'grow',
                component: <div>main</div>,
                grow: 1
            },
            {
                id: "right-sidebar",
                type: 'fixed',
                component: <div>right</div>,
                width: 350
            }

        ];

        return (

            <div className="p-1">


            {/*<UpgradePromotionButton/>*/}

            {/*<div style={{width: '500px'}} className="border p-1">*/}
            {/*    <HolidayPromotionCopy onClick={NULL_FUNCTION}/>*/}
            {/*</div>*/}

            {/*<div className=""*/}
            {/*     style={{*/}
            {/*         display: 'flex',*/}
            {/*         flexDirection: 'column'*/}
            {/*     }}>*/}

            {/*    <div className="text-center">*/}
            {/*        <i className="fas fa-certificate" style={{fontSize: '50px', color: 'silver'}}/>*/}
            {/*    </div>*/}

            {/*    <div className="text-center">*/}
            {/*        Bronze*/}
            {/*    </div>*/}

            {/*</div>*/}

            {/*<BrowserRouter>*/}

            {/*    <Switch location={ReactRouters.createLocationWithPathnameHash()}>*/}
            {/*        <Route path='/' component={defaultComponent}/>*/}
            {/*    </Switch>*/}
            {/*</BrowserRouter>*/}



            {/*<AccountOverview plan='silver'/>*/}


            {/*<Lightbox>*/}
            {/*    asdf*/}
            {/*</Lightbox>*/}

            {/*<div style={{*/}
            {/*    position: 'absolute',*/}
            {/*    top: 0,*/}
            {/*    left: 0,*/}
            {/*    width: '100%',*/}
            {/*    height: '100%',*/}
            {/*    opacity: 1.0,*/}
            {/*    zIndex: 10000*/}
            {/*}}>*/}
            {/*    asdfasdfasdf*/}

            {/*</div>*/}

            {/*<div style={{*/}
            {/*        position: 'absolute',*/}
            {/*        top: 0,*/}
            {/*        left: 0,*/}
            {/*        width: '100%',*/}
            {/*        height: '100%',*/}
            {/*        backgroundColor: 'rgba(0, 0, 0, 0.7)',*/}
            {/*        zIndex: 9999*/}
            {/*    }}>*/}
            {/*</div>*/}

            {/*<div style={{*/}
            {/*    position: 'absolute',*/}
            {/*    top: 0,*/}
            {/*    left: 0,*/}
            {/*    width: '100%',*/}
            {/*    height: '100%',*/}
            {/*    backgroundColor: 'var(--primary-background-color)',*/}
            {/*    opacity: 1.0,*/}
            {/*    zIndex: 10000*/}
            {/*}}>*/}
            {/*    asdfasdfasdf*/}

            {/*</div>*/}


            {/*<IndeterminateProgressBar/>*/}

            {/*<LoadingSplash/>*/}

            {/*<BrowserRouter>*/}

            {/*    <Switch location={ReactRouters.createLocationWithPathnameHash()}>*/}

            {/*        <Route path='.*#start-review' component={StartReview}/>*/}
            {/*        /!*<Route component={DefaultContent}/>*!/*/}

            {/*    </Switch>*/}

            {/*</BrowserRouter>*/}

            {/*<ActionButton icon="fas fa-graduation-cap" onClick={NULL_FUNCTION}/>*/}
            {/*<ActionButton icon="fas fa-graduation-cap" onClick={NULL_FUNCTION}/>*/}

            {/*<FloatingActionButton icon="fas fa-graduation-cap" onClick={NULL_FUNCTION}/>*/}

            {/*<div className="border"*/}
            {/*     style={{*/}
            {/*         width: 150,*/}
            {/*         height: 150,*/}
            {/*         display: 'table-cell',*/}
            {/*         borderRadius: '50%',*/}
            {/*         textAlign: 'center',*/}
            {/*         verticalAlign: 'middle'*/}
            {/*     }}>*/}

            {/*    asdfasdf*/}

            {/*</div>*/}

            {/*<hr/>*/}

            {/*<div className="text-center">*/}

            {/*    <Button color="clear"*/}
            {/*            style={{*/}
            {/*                padding: 0,*/}
            {/*                alignItems: 'center'*/}
            {/*            }}*/}
            {/*            className="btn-no-outline">*/}

            {/*        <CircularIcon icon="fas fa-graduation-cap" />*/}

            {/*    </Button>*/}

            {/*    <div className="mt-1 text-md">*/}
            {/*        Reading*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/*<hr/>*/}
            {/*<div style={{*/}
            {/*        display: 'flex',*/}
            {/*        flexDirection: 'column',*/}
            {/*        alignItems: 'center'*/}
            {/*     }}>*/}

            {/*    <CircularIcon icon="fas fa-graduation-cap" />*/}

            {/*    <div className="mt-1">*/}
            {/*        Start Reading*/}
            {/*    </div>*/}

            {/*</div>*/}
            {/*<hr/>*/}

            {/*<StartReviewBottomSheet onReading={NULL_FUNCTION} onFlashcards={NULL_FUNCTION}/>*/}

            {/*<Button className="mt-auto mb-auto text-secondary p-0 no-focus"*/}
            {/*        style={{outline: 'none', boxShadow: 'none'}}*/}
            {/*        onClick={() => console.log("FIXME clear")}*/}
            {/*        color="clear">*/}

            {/*    <TimesIcon/>*/}

            {/*</Button>*/}

            {/*<InputFilter placeholder="Filter by title"/>*/}

            {/*<FloatingActionButton onClick={NULL_FUNCTION} style={{paddingBottom: '4.5em'}}/>*/}

            {/*    <h4>Normal Circle Buttons</h4>*/}
            {/*    <button type="button" className="btn btn-default btn-circle"><i className="fa fa-check"></i>*/}
            {/*    </button>*/}
            {/*    <button type="button" className="btn btn-primary btn-circle"><i className="fa fa-list"></i>*/}
            {/*    </button>*/}
            {/*    <button type="button" className="btn btn-success btn-circle"><i className="fa fa-link"></i>*/}
            {/*    </button>*/}
            {/*    <button type="button" className="btn btn-info btn-circle"><i className="fa fa-check"></i>*/}
            {/*    </button>*/}
            {/*    <button type="button" className="btn btn-warning btn-circle"><i className="fa fa-times"></i>*/}
            {/*    </button>*/}
            {/*    <button type="button" className="btn btn-danger btn-circle"><i className="fa fa-heart"></i>*/}
            {/*    </button>*/}


            {/*<h4>Large Circle Buttons</h4>*/}
            {/*            <button type="button" className="btn btn-default btn-circle btn-lg"><i*/}
            {/*                className="fa fa-check"></i>*/}
            {/*            </button>*/}
            {/*            <button type="button" className="btn btn-primary btn-circle btn-lg"><i*/}
            {/*                className="fa fa-list"></i>*/}
            {/*            </button>*/}
            {/*            <button type="button" className="btn btn-success btn-circle btn-lg"><i*/}
            {/*                className="fa fa-link"></i>*/}
            {/*            </button>*/}
            {/*            <button type="button" className="btn btn-info btn-circle btn-lg"><i*/}
            {/*                className="fa fa-check"></i>*/}
            {/*            </button>*/}
            {/*            <button type="button" className="btn btn-warning btn-circle btn-lg"><i*/}
            {/*                className="fa fa-times"></i>*/}
            {/*            </button>*/}
            {/*            <button type="button" className="btn btn-danger btn-circle btn-lg"><i*/}
            {/*                className="fa fa-heart"></i>*/}
            {/*            </button>*/}
            {/*                    <h4>Extra Large Circle Buttons</h4>*/}
            {/*                    <button type="button" className="btn btn-default btn-circle btn-xl"><i*/}
            {/*                        className="fa fa-check"></i>*/}
            {/*                    </button>*/}
            {/*                    <button type="button" className="btn btn-primary btn-circle btn-xl"><i*/}
            {/*                        className="fa fa-list"></i>*/}
            {/*                    </button>*/}
            {/*                    <button type="button" className="btn btn-success btn-circle btn-xl"><i*/}
            {/*                        className="fa fa-link"></i>*/}
            {/*                    </button>*/}
            {/*                    <button type="button" className="btn btn-info btn-circle btn-xl"><i*/}
            {/*                        className="fa fa-check"></i>*/}
            {/*                    </button>*/}
            {/*                    <button type="button" className="btn btn-warning btn-circle btn-xl"><i*/}
            {/*                        className="fa fa-times"></i>*/}
            {/*                    </button>*/}
            {/*                    <button type="button" className="btn btn-danger btn-circle btn-xl"><i*/}
            {/*                        className="fa fa-heart"></i>*/}
            {/*                    </button>*/}


            {/*<Tracer id="1"/>*/}
            {/*<Tracer id="2"/>*/}

            {/*<WhatsNewModal/>*/}

            {/*<FolderContextMenu toggle={false}*/}
            {/*                   onCreateFolder={NULL_FUNCTION}>*/}
            {/*    <div>*/}
            {/*        Fake folder*/}
            {/*    </div>*/}
            {/*</FolderContextMenu>*/}

            {/*<div className="p-1">*/}

            {/*    <div className="item">*/}

            {/*        <div className="title text-xxl font-weight-bold text-grey900" style={{fontSize: '33px'}}>*/}
            {/*            Something amazing has happened in science and the community is excited.*/}
            {/*        </div>*/}

            {/*        <div className="title text-lg text-grey800">*/}
            {/*            <span className="text-primary">Martin Smith</span>, <span className="text-primary">Carson Weishaus</span>*/}
            {/*        </div>*/}

            {/*        <div className="title text-lg text-grey800 mt-1 mb-2"  style={{fontSize: '22px'}}>*/}
            {/*            This is a longer overview or abstract of the current document we're reading.*/}
            {/*        </div>*/}

            {/*        <div className="metadata" style={{fontSize: '14px'}}>*/}
            {/*            <MockTag>linux</MockTag> <MockTag>microsoft</MockTag>*/}
            {/*        </div>*/}

            {/*        <div className="metadata mt-1">*/}
            {/*            <b>Added: </b> 1 month ago <b>Updated: </b> 1 day ago*/}
            {/*        </div>*/}

            {/*    </div>*/}

            {/*</div>*/}

            {/*<AnnotationTypeSelector selected={[AnnotationType.FLASHCARD]} onSelected={selected => console.log('selected: ', selected)}/>*/}

            {/*<ColorSelectorBox/>*/}

            {/*<StartReviewButton onClick={NULL_FUNCTION}/>*/}

            {/*<div className="p-1">*/}

            {/*    <Button size='sm' color="light" className="border">*/}
            {/*        <i className="fas fa-gem"/> Upgrade to bronze to unlock related tags*/}
            {/*    </Button>*/}

            {/*</div>*/}

            {/*<div style={{width: '500px', height: '700px', display: 'flex'}}*/}
            {/*     className="border">*/}

            {/*    <Flashcard front={<div>front</div>}*/}
            {/*               back={<div>back</div>}*/}
            {/*               answers={<div>answers</div>}/>*/}

            {/*</div>*/}

            {/*<div className="border border-dark m-1" style={{width: '450px'}}>*/}
            {/*    <DocSidebar meta={{*/}
            {/*        fingerprint: "0x01",*/}
            {/*        title: 'Bitcoin - A distributed currency system.',*/}
            {/*        description: "Some stuff about bitcoin and what it does.",*/}
            {/*        authors: [*/}
            {/*            {*/}
            {/*                displayName: "Alice Smith",*/}
            {/*            }*/}
            {/*        ],*/}
            {/*        doi: '12345'*/}
            {/*    }}/>*/}
            {/*</div>*/}

            {/*this should be editable:*/}

            {/*<EditableText value="hello world" onCancel={NULL_FUNCTION} onDone={NULL_FUNCTION}/>*/}



            {/*<div className="border border-dark m-1" style={{width: '450px'}}>*/}
            {/*    <DocSidebar fingerprint="0x01"*/}
            {/*                title="Bitcoin: A Peer-to-Peer Electronic Cash System"*/}
            {/*                subtitle="A purely peer-to-peer version of electronic cash would allow online payments to be sent directly from one party to another without going through a financial institution."*/}
            {/*                authors={authors}*/}
            {/*                updated={ISODateTimeStrings.create()}*/}
            {/*                url='http://www.example.com/this/is/a/long-path/00000000000000000000000000000000000000000000000000.pdf'*/}
            {/*                published="2017"/>*/}
            {/*</div>*/}

            {/*<PDFViewer src="foo"/>*/}

                {/*<LoadingProgress/>*/}

            {/*<MockFolderTree/>*/}

            {/*<AccountUpgradeBarView plan='free' accountUsage={{storageInBytes: 0}}/>*/}

            {/*<div>*/}

            {/*    /!*<LargeModal isOpen={true}*!/*/}
            {/*    /!*            centered={true}*!/*/}
            {/*    /!*            minWidth="20%">*!/*/}

            {/*    /!*    <LargeModalBody>*!/*/}

            {/*    /!*        this is some modal content.*!/*/}

            {/*    /!*        <GroupSearch/>*!/*/}

            {/*    /!*        <GroupHits>*!/*/}
            {/*    /!*            <GroupHit name="Linux" description="A group about Linux" nrMembers={10} onAdd={NULL_FUNCTION}/>*!/*/}
            {/*    /!*            <GroupHit name="Microsoft" description="A group about Microsoft" nrMembers={5} onAdd={NULL_FUNCTION}/>*!/*/}
            {/*    /!*        </GroupHits>*!/*/}

            {/*    /!*    </LargeModalBody>*!/*/}

            {/*    /!*    /!*<ModalFooter>*!/*!/*/}
            {/*    /!*    /!*    <Button color="primary" onClick={() => this.onDone()}>Close</Button>*!/*!/*/}
            {/*    /!*    /!*</ModalFooter>*!/*!/*/}


            {/*    /!*</LargeModal>*!/*/}


            {/*    <GroupCard group={group}/>*/}

            {/*</div>*/}

            {/*<TreeView root={root}*/}
            {/*          />*/}

            {/*<Dock side="left"*/}
            {/*      left={<Folders/>}*/}
            {/*      right={<Dock side="left"*/}
            {/*                   left={<Preview/>}*/}
            {/*                   right={<Main/>}/>}/>*/}

            </div>

        );
    }


}

interface IAppState {

}


