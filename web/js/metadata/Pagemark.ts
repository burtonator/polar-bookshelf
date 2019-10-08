import {Annotation} from './Annotation';
import {Note} from './Note';
import {PagemarkType} from 'polar-shared/src/metadata/PagemarkType';
import {PagemarkRect} from './PagemarkRect';
import {MetadataSerializer} from './MetadataSerializer';
import {PagemarkMode} from 'polar-shared/src/metadata/PagemarkMode';
import {IPagemark} from "polar-shared/src/metadata/IPagemark";

export class Pagemark extends Annotation implements IPagemark {

    // TODO: should pagemarks support the full nesting model where we can
    // have comments, notes, flashcards, etc?  Probably not but notes might
    // make sense.

    public notes: {[id: string]: Note};

    public type: PagemarkType;

    public percentage: number;

    public column: number;

    public rect: PagemarkRect;

    public mode: PagemarkMode;

    public batch?: string;

    // TODO: add an 'inactive' field so that the user can toggle the pagemarks
    // active and inactive easily.

    constructor(val: any) {

        super(val);

        // TODO: should pagemarks support the full nesting model where we can
        // have comments, notes, flashcards, etc?  Probably not but notes might
        // make sense.

        this.notes = val.notes;
        this.type = val.type;
        this.percentage = val.percentage;
        this.column = val.percentage;
        this.rect = val.rect;
        this.mode = val.mode;

        // TODO: support 'range' in the future which is a PagemarkRange so that
        // we can start off reading within a smaller page.

        this.init(val);

    }

    public setup() {

        super.setup();

        if (!this.notes) {
            this.notes = {};
        }

        if (!this.type) {
            this.type = PagemarkType.SINGLE_COLUMN;
        }

        if (!this.mode) {
            this.mode = PagemarkMode.READ;
        }

        if (!this.percentage) {
            this.percentage = 100;
        }

        if (!this.column) {
            this.column = 0;
        }

    }

    public validate() {
        super.validate();
    }

    public toString() {
        return MetadataSerializer.serialize(this);
    }

}

export interface PagemarkRef {

    readonly pageNum: number;

    readonly pagemark: IPagemark;

}

export interface PagemarkIDRef {

    readonly pageNum: number;

    readonly id: string;

}

