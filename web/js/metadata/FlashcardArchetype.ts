import {Objects} from "../util/Objects";
import {Preconditions} from 'polar-shared/src/Preconditions';

/**
 * A defined archetype for creating a flashcard.  These provide a collection of
 * defined fields that can get mapped to your card system.
 *
 * @type {FlashcardArchetype}
 */
export class FlashcardArchetype {

    /**
     * The unique ID of this archetype.
     */
    public readonly id: string;

    /**
     * The name of this archetype for displaying to a user.
     */
    public readonly name: string;

    /**
     * Brief description of this archetype.
     */
    public readonly description: string;

    public readonly fields: {[key: string]: string};

    constructor(opts: any) {

        opts = Objects.defaults(opts, {
            description: "",
        });

        this.id = Preconditions.assertNotNull(opts.id, "id");

        this.name = Preconditions.assertNotNull(opts.name, "name");

        this.description = opts.description;

        this.fields = opts.fields;

    }

}
