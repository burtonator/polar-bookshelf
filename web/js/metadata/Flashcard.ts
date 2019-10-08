import {FlashcardType} from 'polar-shared/src/metadata/FlashcardType';
import {VersionedObject} from './VersionedObject';
import {Text} from 'polar-shared/src/metadata/Text';
import {Preconditions} from 'polar-shared/src/Preconditions';
import {ISODateTimeString} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {Ref} from 'polar-shared/src/metadata/Refs';
import {IFlashcard} from "polar-shared/src/metadata/IFlashcard";

export class Flashcard extends VersionedObject implements IFlashcard {

    public type: FlashcardType;

    public fields: {[key: string]: Text} ;

    public archetype: string;

    // TODO: we don't have a way right now to attach these to specific
    // annotations

    public constructor(template: Flashcard) {

        super(template);

        this.type = template.type;
        this.fields = template.fields;
        this.archetype = template.archetype;
        this.guid = template.guid;

        this.init(template);

    }

    public validate(): void {

        super.validate();

        Preconditions.assertNotNull(this.id, "id");
        Preconditions.assertNotNull(this.type, "type");
        Preconditions.assertNotNull(this.guid, "guid");
        Preconditions.assertNotNull(this.fields, "fields");
        Preconditions.assertNotNull(this.archetype, "archetype");

        // TODO: assert that the guid is not null.

    }

    public static newInstance(id: string,
                              guid: string,
                              created: ISODateTimeString,
                              lastUpdated: ISODateTimeString,
                              type: FlashcardType,
                              fields: {[key: string]: Text},
                              archetype: string,
                              ref: Ref): Readonly<Flashcard> {

        const result = new Flashcard(<Flashcard> {
            id, guid, created, lastUpdated, type, fields, archetype, ref
        });

        return Object.freeze(result);

    }

}

