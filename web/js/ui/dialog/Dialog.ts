import {Link} from '../link/Link';

declare var global: any;
global.$ = global.jQuery = require("jquery");
require("jquery-ui-bundle");

/**
 * Dialog box for entering data in the UI.
 * @Deprecated
 */
export class Dialog {

    private readonly target: any;

    public width: number = 250;
    public height: number = 250;

    /**
     *
     * @param target An HTML element or CSS selector.
     */
    constructor(target: any) {
        this.target = target;

        // FIXME: don't use the full URL here...
        // TODO: I'm sure there must be a fancier way to do and we should
        // consider using webpack for each component.
        let link = new Link("stylesheet",
                            "https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css",
                            "jquery-ui");
        link.present();

    }

    show(): void {

        $(() => {
            $(this.target)
                .dialog({
                    width: this.width,
                    height: this.height
                })
                .show();
        });

    }

    hide(): void {
        $(this.target).hide();
    }

}
