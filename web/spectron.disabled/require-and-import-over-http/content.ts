import {SpectronRenderer} from "../../js/test/SpectronRenderer";

SpectronRenderer.run(async (state) => {

    console.log("Running within SpectronRenderer now.");

    history.pushState({}, "Home", "http://localhost/");

    await state.testResultWriter.write(document.location!.href === "http://localhost/");

});


