import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import {DialogWindowClient} from '../../js/ui/dialog_window/DialogWindowClient';
import {
    DialogWindowOptions,
    Resource,
    ResourceType
} from '../../js/ui/dialog_window/DialogWindow';

SpectronRenderer.run(async (state) => {

    console.log("Going to create dialog");

    const appPath = __dirname + "/dialog.html";
    const resource = new Resource(ResourceType.FILE, appPath);
    const dialogWindowOptions = new DialogWindowOptions(resource);

    const dialogWindowClient = await DialogWindowClient.create(dialogWindowOptions);

    await dialogWindowClient.hide();

    await dialogWindowClient.show();

    await dialogWindowClient.hide();

    await dialogWindowClient.show();

    state.testResultWriter.write(true);

});
