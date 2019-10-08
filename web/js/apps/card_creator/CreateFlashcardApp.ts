import $ from '../../ui/JQuery';

import {CreateFlashcardForm} from './elements/schemaform/CreateFlashcardForm';
import {Logger} from 'polar-shared/src/logger/Logger';
import {CreateFlashcardService} from './CreateFlashcardService';
import {DocumentReadyStates} from '../../util/dom/DocumentReadyStates';

const log = Logger.create();

export class CreateFlashcardApp {

    public async start() {

        return new Promise<void>( resolve => {

            // TODO: move this to DocumentReadyStates and not jquery.
            $(document).ready(async function() {

                log.info("Ready to create flash card!");

                const schemaFormElement = <HTMLElement> document.getElementById('schema-form');

                const createFlashcardForm = new CreateFlashcardForm(schemaFormElement);

                const createFlashcardService = new CreateFlashcardService(createFlashcardForm);

                await createFlashcardService.start();
                resolve();

                log.info("UI created.");

            });

        });
    }

}
