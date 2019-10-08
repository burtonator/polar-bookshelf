
import {ipcRenderer} from 'electron';
import {TriggerEvent} from '../TriggerEvent';

export class ElectronContextMenus {

    public static trigger(triggerEvent: TriggerEvent) {
        ipcRenderer.send('context-menu-trigger', triggerEvent);
    }

}
