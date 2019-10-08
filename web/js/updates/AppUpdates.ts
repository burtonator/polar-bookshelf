import {Platform, Platforms} from '../util/Platforms';
import {DistConfig} from '../dist_config/DistConfig';

export class AppUpdates {

    public static platformSupportsUpdates() {

        return [Platform.MACOS, Platform.WINDOWS].includes(Platforms.get()) && DistConfig.ENABLE_UPDATES;

    }

}
