export class ViewerScreenshots {

    public static doScreenshot() {

        // TODO: get the browser width, height + scrollX and scrollY before and
        // compare to after so that we can know that our screenshot was taken
        // properly.

        // TODO: must make sure that the element isn't obscured by the side
        // navigation or any navigation nor the head...

        // TODO: I don't have a good way to show that the sidebar has expanded
        // over it nor do I have a way to detect if we're at the top of the
        // browser or not.  Additionally, some of the UI elements DO obscure
        // it like the pagemarks so I don't konw of a reliable way to ensure
        // that we get a stable pagemark and this could be a source of bugs.
        //
        // TODO: one thing I could do is to see which elements obscure it ...
        //
        // page.parentElement.clientWidth vs page.parentElement.scrollWidth
        // will show that the width is not possible...


        // TODO: we just need to make sure we're at the 'top' and that there
        // is no horizontal scrolling.

        // TODO: now I need to determine how to detect that we're at the 'top' reliably.


        // use 250 px so that we can show it slightly larger in the sidebar
        // but also use 125px when showing it int the overview.
        const width = 250;

        const height = (11 / 8.5) * width;

        const captureOpts = {
            resize: {
                width
            },
            crop: {
                width, height, x: 0, y: 0
            }
        };

    }

    /**
     * Get the page positioning so that we can compare before/after and make
     * sure the user hasn't scrolled.
     */
    public static getElementPositioning(target: HTMLElement): ElementPosition {
        const rect = target.getBoundingClientRect();

        return {
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height
        };

    }

}

interface ElementPosition {
    readonly left: number;
    readonly top: number;
    readonly width: number;
    readonly height: number;
}
