const ID = 'action-mutex-held';

/**
 * A mutex for user actions in the UI.  This can be used for preventing
 * two dialog boxes from opening if one is already running.
 */
export class ActionMutex {

    /**
     * Execute the code block but only if we're allowed to do so and no other
     * code is holding the exclusion.
     */
    public static withExclusion(block: () => void): boolean {

        try {

            // since JS is single threaded we don't have to worry about two
            // threads stepping on us here.

            if (this.isExcluded()) {
                return false;
            }

            this.markExcluded();

            block();

            return true;

        } finally {
            this.clearExcluded();
        }

    }

    public static isExcluded() {
        return window.sessionStorage.getItem(ID) === 'true';
    }

    public static markExcluded() {
        window.sessionStorage.setItem(ID, 'true');
    }

    public static clearExcluded() {
        window.sessionStorage.removeItem(ID);
    }

}
