let SEQUENCE = 0;

/**
 * Simple DOM ID creation without having to put guts like the sequence number in
 * the main class. Makes sure for a given prefix that the ID is always unique
 */
export class IDs {

    public static create(prefix: string) {
        const seq = SEQUENCE++;

        return `${prefix}${seq}`;
    }

}

