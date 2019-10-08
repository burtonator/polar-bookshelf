import {FlashcardFieldType} from "./FlashcardFieldType";
import {Preconditions} from 'polar-shared/src/Preconditions';
import {Objects} from "../util/Objects";


export class FlashcardField {


    /**
     * The name of this field.
     */
    private readonly name: string;

    private readonly type: FlashcardFieldType;

    /**
     * A description for the field in the UI
     */
    private readonly description: string;

    /**
     * When entering data for this flashcard, remember the last field.
     */
    private readonly rememberLastInput: boolean;

    /**
     * True if this field is required by the user.
     */
    private readonly required: boolean;


    constructor(opts: any) {

        opts = Objects.defaults(opts, {
            description: "",
            rememberLastInput: false,
            required: false

        });

        this.name = Preconditions.assertNotNull(opts.name, "name");
        this.type = Preconditions.assertNotNull(opts.type, "type");
        this.description = opts.description;
        this.rememberLastInput = opts.rememberLastInput;
        this.required = opts.required;

    }

};
