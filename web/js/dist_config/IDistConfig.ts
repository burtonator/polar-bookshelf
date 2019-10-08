export interface IDistConfig {

    /**
     * Enable updates but only if the underlying platform supports it.
     */
    readonly ENABLE_UPDATES: boolean;

    /**
     * Enable purchased but we might have to disable them from time to time
     * on various platforms until we can support their specific requirements.
     */
    readonly ENABLE_PURCHASES: boolean;

}
