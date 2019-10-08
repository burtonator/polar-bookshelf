import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import {WebContentsNotifiers} from '../../js/electron/web_contents_notifier/WebContentsNotifiers';

SpectronRenderer.run(async () => {
    WebContentsNotifiers.dispatchEvent('hello', 'world');
});
