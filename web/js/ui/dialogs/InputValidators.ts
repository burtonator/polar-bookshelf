export interface InputValidation {
    readonly message: string;
}

export const NULL_INPUT_VALIDATOR = () => undefined;

/**
 * Return undefined if the input is valid or a InputValidation object if there
 * was an error.
 */
export type InputValidator = (value: string) => InputValidation | undefined;

