const UI_MODES: ReadonlyArray<string> = ['light', 'dark'];

export class UIModes {

    /**
     * Register myself so that we can enable dark mode when necessary.
     */
    public static register() {
        const uiMode = this.currentMode();
        this.toggleMode(uiMode);
    }

    private static currentMode(): UIMode {

        const uiMode = localStorage.getItem('ui-mode');

        if (uiMode && UI_MODES.includes(uiMode)) {
            return <UIMode> uiMode;
        }

        console.warn("FIXME: using default ui mode");
        return "light";

    }

    private static toggleMode(uiMode: UIMode) {

        const htmlElement = document.querySelector("html")!;
        htmlElement.classList.remove('ui-mode-light');
        htmlElement.classList.remove('ui-mode-dark');

        htmlElement.classList.add('ui-mode-' + uiMode);

    }

}

type UIMode = 'light' | 'dark';
