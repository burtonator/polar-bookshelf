import {Logger} from 'polar-shared/src/logger/Logger';

const log = Logger.create();
/**
 * Handles callbacks from JSON schema form as the form data is changed.
 */
export class FormHandler {

    onChange(data: any): boolean {
        log.info("onChange: ", data);
        return true;
    }


    onSubmit(data: any): boolean {
        log.info("onSubmit: ", data);
        return true;
    }


    onError(data: any): boolean {
        log.info("onError: ", data);
        return true;
    }

}
