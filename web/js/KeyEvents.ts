export class KeyEvents {

    /**
     * Return true if the 'meta' keys are active.
     */
    public static isKeyMetaActive(event: KeyboardEvent) {

        if (this.isMacOS()) {
            return event.metaKey && event.altKey;
        } else {
            return event.ctrlKey && event.altKey;
        }

    }

    public static isMacOS() {
        return navigator.platform === "MacIntel";
    }

}
