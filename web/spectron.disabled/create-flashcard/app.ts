import assert from 'assert';
import {CreateFlashcardApp} from '../../js/apps/card_creator/CreateFlashcardApp';
import {SpectronRenderer} from '../../js/test/SpectronRenderer';

SpectronRenderer.run(async (state) => {

    await new CreateFlashcardApp().start();

    // now see if the UI is properly loaded...

    assert.equal(document.querySelector('#root__title')!.textContent, 'Flashcard');

    assert.ok(document.querySelector('#root_front'));
    assert.ok(document.querySelector('#root_back'));

    await state.testResultWriter.write(true);

});
