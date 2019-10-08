import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import {MockSelections} from '../../js/highlights/text/selection/MockSelections';
import {SelectedContents} from '../../js/highlights/text/selection/SelectedContents';
import {SimpleHighlightRenderer} from '../../js/highlights/text/view/SimpleHighlightRenderer';
import {DocumentReadyStates} from '../../js/util/dom/DocumentReadyStates';

SpectronRenderer.run(async (state) => {

    await DocumentReadyStates.waitFor(document, 'complete');

    console.log("Running within SpectronRenderer now.");

    MockSelections.createSyntheticSelection({ node: document.querySelector("#n4")!, offset: 0},
                                            { node: document.querySelector("#n7")!.firstChild!, offset: 35});

    const selectedContents = SelectedContents.compute(window);

    window.getSelection()!.empty();

    SimpleHighlightRenderer.renderSelectedContents(selectedContents);

    state.testResultWriter.write(selectedContents);

});
