import * as React from 'react';
import Moment from 'react-moment';
import {DocAnnotation} from '../../DocAnnotation';
import {FlashcardDropdown} from './FlashcardDropdown';
import {Logger} from 'polar-shared/src/logger/Logger';
import {IStyleMap} from '../../../react/IStyleMap';
import {Doc} from '../../../metadata/Doc';
import {DocAnnotationMoment} from "../../DocAnnotationMoment";
import {DocAuthor} from "../../DocAuthor";

const log = Logger.create();

const Styles: IStyleMap = {

    barBody: {
        display: 'flex'
    },

    barChild: {
        marginTop: 'auto',
        marginBottom: 'auto',
    }

};

/**
 * A generic wrapper that determines which sub-component to render.
 */
export class ViewFlashcard extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onDelete = this.onDelete.bind(this);
        this.state = {};

    }

    public render() {
        const { flashcard } = this.props;

        const key = 'comment-' + flashcard.id;

        const RenderFrontAndBackFields = () => {

            return (
                <div>

                    <div className="pb-2 pt-2">

                        <span dangerouslySetInnerHTML={{__html: flashcard.fields!.front}}>

                        </span>

                    </div>

                    <div className="pb-2 pt-2 border-top">

                        <span dangerouslySetInnerHTML={{__html: flashcard.fields!.back}}>

                        </span>

                    </div>

                </div>
            );

        };

        const RenderClozeFields = () => {

            return (
                <div>
                    <div className="pb-2 pt-2">
                        <span dangerouslySetInnerHTML={{__html: flashcard.fields!.text}}>
                        </span>
                    </div>
                </div>
            );

        };

        const RenderFields = () => {

            if (flashcard.fields!.text) {
                return (<RenderClozeFields/>);
            } else {
                return (<RenderFrontAndBackFields/>);
            }

        };

        return (

            <div key={key} className="mt-1">

                <div className="flashcard card shadow-sm mb-1">

                    <div className="card-body p-1">

                        <RenderFields/>

                    </div>

                </div>

                <div style={Styles.barBody}
                     className="flexbar comment-bar border-bottom pb-0 mb-2">

                    <DocAuthor author={flashcard.author}/>

                    <div style={Styles.barChild} className="text-muted">
                        <DocAnnotationMoment created={flashcard.created}/>
                    </div>

                    <div style={Styles.barChild} className="flexbar-right">

                        {this.props.editButton}

                        <FlashcardDropdown id={'flashcard-dropdown-' + flashcard.id}
                                           disabled={! this.props.doc.mutable}
                                           flashcard={flashcard}
                                           onDelete={() => this.onDelete(flashcard)}/>
                    </div>

                </div>

            </div>
        );
    }

    private onDelete(flashcard: DocAnnotation) {
        log.info("Flashcard deleted: ", flashcard);
        delete flashcard.pageMeta.flashcards[flashcard.id];
    }


}
interface IProps {
    readonly flashcard: DocAnnotation;
    readonly doc: Doc;
    readonly editButton: JSX.Element;
}

interface IState {

}


