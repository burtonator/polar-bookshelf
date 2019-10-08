import {AnnotationType} from 'polar-shared/src/metadata/AnnotationType';
import {TextHighlight} from './TextHighlight';
import {AreaHighlight} from './AreaHighlight';
import {Comment} from './Comment';
import {Flashcard} from './Flashcard';
import {PageInfo} from './PageInfo';
import {DocInfo} from './DocInfo';
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {IPageInfo} from "polar-shared/src/metadata/IPageInfo";
import {IComment} from "polar-shared/src/metadata/IComment";
import {IFlashcard} from "polar-shared/src/metadata/IFlashcard";
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";
import {IAreaHighlight} from "polar-shared/src/metadata/IAreaHighlight";

/**
 * Represents a detached annotation which can be passed across the system and
 * doesn't have associated
 */
export interface AnnotationHolder {

    readonly type: AnnotationType;

    readonly annotation: ITextHighlight | IAreaHighlight | IComment | IFlashcard;

    /**
     * Optional because in the future it might be nice to have annotations
     * which aren't strictly bound to documents.
     */
    readonly pageInfo?: IPageInfo;

    /**
     * Optional because in the future it might be nice to have annotations
     * which aren't strictly bound to documents.
     */
    readonly docInfo?: IDocInfo;

}
