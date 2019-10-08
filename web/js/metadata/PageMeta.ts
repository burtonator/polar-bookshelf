import {SerializedObject} from './SerializedObject';
import {ReadingProgress} from 'polar-shared/src/metadata/ReadingProgress';
import {IPageMeta} from "polar-shared/src/metadata/IPageMeta";
import {IPageInfo} from "polar-shared/src/metadata/IPageInfo";
import {IPagemark} from "polar-shared/src/metadata/IPagemark";
import {INote} from "polar-shared/src/metadata/INote";
import {IComment} from "polar-shared/src/metadata/IComment";
import {IQuestion} from "polar-shared/src/metadata/IQuestion";
import {IFlashcard} from "polar-shared/src/metadata/IFlashcard";
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";
import {IAreaHighlight} from "polar-shared/src/metadata/IAreaHighlight";
import {IScreenshot} from "polar-shared/src/metadata/IScreenshot";
import {IThumbnail} from "polar-shared/src/metadata/IThumbnail";

export class PageMeta extends SerializedObject implements IPageMeta {

    public readonly pageInfo: IPageInfo;

    public readonly pagemarks: {[id: string]: IPagemark} = {};

    public readonly notes: {[id: string]: INote} = {};

    public readonly comments: {[id: string]: IComment} = {};

    public readonly questions: {[id: string]: IQuestion} = {};

    public readonly flashcards: {[id: string]: IFlashcard} = {};

    public readonly textHighlights: {[id: string]: ITextHighlight} = {};

    public readonly areaHighlights: {[id: string]: IAreaHighlight} = {};

    public readonly screenshots: {[id: string]: IScreenshot} = {};

    public readonly thumbnails: {[id: string]: IThumbnail} = {};

    public readonly readingProgress: {[id: string]: ReadingProgress} = {};

    constructor(val: any) {

        super(val);

        this.pageInfo = val.pageInfo;

        this.init(val);

    }

    public setup() {

        super.setup();

        if (!this.pagemarks) {
            // this could happen when serializing from old file formats
            (<any> this).pagemarks = {};
        }

        if (!this.textHighlights) {
            // this could happen when serializing from old file formats
            (<any> this).textHighlights = {};
        }

        if (!this.areaHighlights) {
            // this could happen when serializing from old file formats
            (<any> this).areaHighlights = {};
        }

        if (!this.screenshots) {
            // this could happen when serializing from old file formats
            (<any> this).screenshots = {};
        }

        if (!this.thumbnails) {
            // this could happen when serializing from old file formats
            (<any> this).thumbnails = {};
        }

    }

    public validate() {

        super.validate();
        // Preconditions.assertInstanceOf(this.pageInfo, PageInfo, "pageInfo");

    }

}

