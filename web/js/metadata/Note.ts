import {TextType} from './TextType';
import {VersionedObject} from './VersionedObject';
import {Text} from 'polar-shared/src/metadata/Text';
import {Texts} from './Texts';
import {INote} from "polar-shared/src/metadata/INote";

/**
 * Private note describing this object.  Meant to last a long time.
 */
export class Note extends VersionedObject implements INote {

    public content: Text;

    constructor(val: Note) {

        super(val);

        this.content = val.content;

        this.init(val);

    }

    public setup() {

        if (!this.content) {
            this.content = Texts.create("", TextType.HTML);
        }

    }

    public validate() {

        if(!this.created) {
            throw new Error("The field `created` is required.");
        }

    }

}

