import {FlashcardArchetype} from './FlashcardArchetype';
import {Preconditions} from 'polar-shared/src/Preconditions';
import {FlashcardField} from './FlashcardField';
import {FlashcardFieldType} from './FlashcardFieldType';

/**
 * Creates a registry FlashcardArchetypes for use by the user.
 *
 * @type {FlashcardRegistry}
 */
export class FlashcardRegistry {

    private readonly registry: {[id: string]: FlashcardArchetype} = {};

    public register(flashcardArchetype: FlashcardArchetype) {
        Preconditions.assertNotNull(flashcardArchetype.id, "id");
        this.registry[flashcardArchetype.id] = flashcardArchetype;
    }

    public get(id: string) {

    }

    public hasKey(id: string) {
        return id in this.registry;
    }

    public keys() {
        return Object.keys(this.registry);
    }

    /**
     * Return the values in the registry.
     */
    public values() {
        return Object.values(this.registry);
    }

    /**
     * Create the default flashcard registry.
     */
    public static createDefault() {

        const flashcardRegistry = new FlashcardRegistry();

        flashcardRegistry.register(new FlashcardArchetype({
            id: "9d146db1-7c31-4bcf-866b-7b485c4e50ea",
            name: "Front and Back",
            description: "Standard front and back flashcard.",
            fields: {
                "front": new FlashcardField({
                    name: "front",
                    type: FlashcardFieldType.TEXT,
                    description: "The front of this card",
                    required: true
                }),
                "back": new FlashcardField({
                    name: "back",
                    type: FlashcardFieldType.TEXT,
                    description: "The back of this card",
                    required: true
                }),
                "extra": new FlashcardField({
                    name: "extra",
                    type: FlashcardFieldType.TEXT,
                    description: "Extra data shown after the card has been answered.",
                    required: false
                }),
                "source": new FlashcardField({
                    name: "source",
                    type: FlashcardFieldType.TEXT,
                    description: "The source of this card. Name of the webpage, book, whitepaper, etc.",
                    required: false
                }),
                "link": new FlashcardField({
                    name: "link",
                    type: FlashcardFieldType.URL,
                    description: "A link for more information regarding this flashcard. Usually the link to the source.",
                    required: false
                }),
                "image": new FlashcardField({
                    name: "image",
                    type: FlashcardFieldType.IMAGE_URL,
                    description: "A link to an image for this flashcard.",
                    required: false
                })
            }
        }));

        flashcardRegistry.register(new FlashcardArchetype({
            id: "e3d25ed4-cafd-4350-84e8-123a4258e576",
            name: "Front and Back and Reverse",
            description: "Standard front and back flashcard (plus reverse)",
            fields: {
                "front": new FlashcardField({
                    name: "front",
                    type: FlashcardFieldType.TEXT,
                    description: "The front of this card",
                    required: true
                }),
                "back": new FlashcardField({
                    name: "back",
                    type: FlashcardFieldType.TEXT,
                    description: "The back of this card",
                    required: true
                }),
                "extra": new FlashcardField({
                    name: "extra",
                    type: FlashcardFieldType.TEXT,
                    description: "Extra data shown after the card has been answered.",
                    required: false
                }),
                "source": new FlashcardField({
                    name: "source",
                    type: FlashcardFieldType.TEXT,
                    description: "The source of this card. Name of the webpage, book, whitepaper, etc.",
                    required: false
                }),
                "link": new FlashcardField({
                    name: "link",
                    type: FlashcardFieldType.URL,
                    description: "A link for more information regarding this flashcard. Usually the link to the source.",
                    required: false
                }),
                "image": new FlashcardField({
                    name: "image",
                    type: FlashcardFieldType.IMAGE_URL,
                    description: "A link to an image for this flashcard.",
                    required: false
                })
            }
        }));

        flashcardRegistry.register(new FlashcardArchetype({
            id: "76152976-d7ae-4348-9571-d65e48050c3f",
            name: "cloze",
            description: "Cloze flashcard with cloze text.",
            fields: {
                "text": new FlashcardField({
                    name: "text",
                    type: FlashcardFieldType.TEXT,
                    description: "The text of this card.",
                    required: true
                }),
                "extra": new FlashcardField({
                    name: "extra",
                    type: FlashcardFieldType.TEXT,
                    description: "Extra data shown after the card has been answered.",
                    required: false
                }),
                "source": new FlashcardField({
                    name: "source",
                    type: FlashcardFieldType.TEXT,
                    description: "The source of this card. Name of the webpage, book, whitepaper, etc.",
                    required: false
                }),
                "link": new FlashcardField({
                    name: "link",
                    type: FlashcardFieldType.URL,
                    description: "A link for more information regarding this flashcard. Usually the link to the source.",
                    required: false
                }),
                "image": new FlashcardField({
                    name: "image",
                    type: FlashcardFieldType.IMAGE_URL,
                    description: "A link to an image for this flashcard.",
                    required: false
                })
            }

        }));

        return flashcardRegistry;

    }

};
