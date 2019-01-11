import * as React from 'react';
import {ListOptionType, ListSelector} from '../../js/ui/list_selector/ListSelector';
import {DocRepoTableDropdown} from '../../../apps/repository/js/doc_repo/DocRepoTableDropdown';
import {AnnotationSidebar} from '../../js/annotation_sidebar/AnnotationSidebar';
import {MockDocMetas} from '../../js/metadata/DocMetas';
import {Proxies} from '../../js/proxies/Proxies';
import {Rect} from '../../js/Rect';
import {TextRect} from '../../js/metadata/TextRect';
import {TextHighlightRecords} from '../../js/metadata/TextHighlightRecords';
import {CommentComponentExample} from './CommentComponentExample';
import {FlashcardComponentExample} from './FlashcardComponentExample';
import {WhatsNewContent} from '../../../apps/repository/js/splash/splashes/whats_new/WhatsNewContent';
import {CloudSyncOverviewContent} from '../../js/ui/cloud_auth/CloudSyncOverviewContent';
import {CloudSyncConfiguredContent} from '../../js/ui/cloud_auth/CloudSyncConfiguredContent';
import {HighlighterIcon} from '../../js/ui/standard_icons/HighlighterIcon';
import {ToggleButton} from '../../js/ui/ToggleButton';
import {TagInput} from '../../../apps/repository/js/TagInput';
import {Tag} from '../../../web/js/tags/Tag';
import {RelatedTags} from '../../js/tags/related/RelatedTags';
import {CommentIcon} from '../../js/ui/standard_icons/CommentIcon';
import {FlashcardIcon} from '../../js/ui/standard_icons/FlashcardIcon';
import {AnnotationFlashcardBox} from '../../js/annotation_sidebar/flashcard_input/AnnotationFlashcardBox';
import {FlashcardType} from '../../js/metadata/FlashcardType';
import {FlashcardInputForCloze} from '../../js/annotation_sidebar/flashcard_input/FlashcardInputForCloze';
import {FlashcardInputForFrontAndBack} from '../../js/annotation_sidebar/flashcard_input/FlashcardInputForFrontAndBack';
import {TopPDFExample} from './TopPDFExample';

class App<P> extends React.Component<{}, IAppState> {

    constructor(props: P, context: any) {
        super(props, context);

        this.toggleDropDown = this.toggleDropDown.bind(this);
        this.toggleSplit = this.toggleSplit.bind(this);
        this.state = {
            dropdownOpen: false,
            splitButtonOpen: false
        };
    }

    public render() {

        // ProgressBar.create();

        const options: ListOptionType[] = [
            {
                id: "title",
                label: "Title",
                selected: true
            },
            {
                id: "tags",
                label: "Tags",
                selected: false
            }
        ];

        const docMeta = Proxies.create(MockDocMetas.createWithinInitialPagemarks('0x001', 4));

        const rects: Rect[] = [ new Rect({top: 100, left: 100, right: 200, bottom: 200, width: 100, height: 100}) ];
        const textSelections: TextRect[] = [new TextRect({text: "hello world"})];
        const text = "hello world";

        const textHighlight = TextHighlightRecords.create(rects, textSelections, {TEXT: text});

        // const ref = Refs.createFromAnnotationType(textHighlight.id,
        // AnnotationType.TEXT_HIGHLIGHT);

        docMeta.pageMetas[1].textHighlights[textHighlight.id] = textHighlight.value;

        // let flashcard = Flashcards.createFrontBack(front, back, ref);
        //
        // // TODO: an idiosyncracie of the proxies system is that it mutates
        // the // object so if it's read only it won't work.  This is a bug
        // with // Proxies so I need to also fix that bug there in the future.
        // flashcard = Object.assign({}, flashcard);
        // annotation.pageMeta.flashcards[flashcard.id] = flashcard;


        // TODO: we have to create some flashcards and comments for this object
        // so that the annotation sidear renders.

        const relatedTags = new RelatedTags();

        relatedTags.update('0x01', 'set', 'linux');
        relatedTags.update('0x01', 'set', 'microsoft');

        relatedTags.update('0x02', 'set', 'linux');
        relatedTags.update('0x02', 'set', 'google');

        relatedTags.update('0x03', 'set', 'linux');
        relatedTags.update('0x03', 'set', 'microsoft');

        relatedTags.update('0x04', 'set', 'linux');
        relatedTags.update('0x04', 'set', 'microsoft');

        relatedTags.update('0x05', 'set', 'linux');
        relatedTags.update('0x05', 'set', 'google');

        const tags: Tag[] = [
            {id: 'microsoft', label: 'microsoft'},
            {id: 'google', label: 'google'}
        ];

        const existingTags: Tag[] = [
            {id: 'google', label: 'google'}
        ];

        return (

            <div>

                <h1 className="component">Top PDFs</h1>

                <TopPDFExample/>

                <h1 className="component">FlashcardInputForCloze</h1>

                <FlashcardInputForCloze
                    id={'FlashcardInputForCloze'}
                    onCancel={() => console.log("onCancel")}
                    onFlashcardCreated={(flashcardType, fields) => console.log("created: ", flashcardType, fields)}
                    onFlashcardChangeType={flashcardType => console.log("flashcardType: ", flashcardType)}/>

                <h1 className="component">FlashcardInputForFrontAndBack</h1>
                <FlashcardInputForFrontAndBack
                    id={'FlashcardInputForFrontAndBack'}
                    onCancel={() => console.log("onCancel")}
                    onFlashcardCreated={(flashcardType, fields) => console.log("created: ", flashcardType, fields)}
                    onFlashcardChangeType={flashcardType => console.log("flashcardType: ", flashcardType)}/>

                <h1 className="component">AnnotationFlashcardBox</h1>

                <AnnotationFlashcardBox id='flashcard-0'
                                        onCancel={() => console.log("onCancel")}
                                        onFlashcardCreated={(flashcardType, fields) => console.log("created: ", flashcardType, fields)}/>

                <h1 className="component">TagInput</h1>

                <TagInput availableTags={tags}
                          existingTags={existingTags}
                          relatedTags={relatedTags}
                          onChange={newTags => console.log('got tags', newTags)}/>

                <h1 className="component">Toggle Buttons</h1>

                <div className="p-2">
                    <ToggleButton label="flagged only" onChange={() => console.log('changed')}/>
                </div>

                <div className="p-2">
                    <ToggleButton label="toggle enabled" initialValue={true} onChange={() => console.log('changed')}/>
                </div>

                <h1 className="component">Standard Icons</h1>

                <p>
                    <b>highlighter: </b> <HighlighterIcon color={'yellow'}/>
                </p>

                <p>
                    <b>comment: </b> <CommentIcon/>
                </p>

                <p>
                    <b>flashcard: </b> <FlashcardIcon/>
                </p>


                {/*<InviteUsersContent onInvitedUserText={NULL_FUNCTION}/>*/}

                {/*<InviteUsersModal isOpen={true} onCancel={NULL_FUNCTION} onInvite={(emailAddresses) => console.log(emailAddresses)}/>*/}

                {/*<TableDropdown id={'table-dropdown'}></TableDropdown>*/}

                <h1 className="component">Typographic headings</h1>

                <h1>h1</h1>
                <h2>h2</h2>
                <h3>h3</h3>
                <h4>h4</h4>
                <h5>h5</h5>

                <h1 className="component">Intro classes</h1>

                <div className="intro">

                    <h1 className="title">This is the title</h1>

                    <h2 className="subtitle">This is the subtitle</h2>

                    <p>
                        This is just regular text.
                    </p>

                </div>

                <p>
                    List of important UI components in Polar.
                </p>

                <h1 className="component">ListSelector</h1>

                <ListSelector options={options}
                              id="list-options"
                              onChange={(value) => console.log(value)}>

                </ListSelector>

                <h1 className="component">TableDropdown</h1>

                <DocRepoTableDropdown id="table-dropdown"
                                      onSelectedColumns={(newOptions) => console.log("onSelectedColumns: ", newOptions)}
                />

                <h1 className="component">Annotation Sidebar</h1>

                <AnnotationSidebar docMeta={docMeta}/>

                <h1 className="component">Comment component</h1>

                <CommentComponentExample/>

                <h1 className="component">Flashcard component</h1>

                <FlashcardComponentExample/>

                <WhatsNewContent/>

                <CloudSyncOverviewContent/>

                <CloudSyncConfiguredContent/>

                {/*<CloudSyncConfiguredModal isOpen={true} onCancel={() => console.log('cancel')}/>*/}


                {/*<CloudSyncOverviewModal isOpen={true}*/}
                                        {/*onCancel={() => console.log('cancel')}*/}
                                        {/*onSignup={() => console.log('signup')}/>*/}

            </div>

        );
    }


    private toggleDropDown() {

        this.setState({
            splitButtonOpen: this.state.splitButtonOpen,
            dropdownOpen: !this.state.dropdownOpen
        });

    }

    private toggleSplit() {

        this.setState({
            splitButtonOpen: !this.state.splitButtonOpen
        });

    }



}

export default App;

interface IAppState {
    dropdownOpen: boolean;
    splitButtonOpen: boolean;

}


