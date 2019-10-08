import Split from 'split.js';
import {WindowEvents} from '../../util/dom/WindowEvents';

const INITIAL_SIZES: number[] = [68, 32];

/**
 * A simple splitter that takes to elements or selectors and makes them vertical
 * bars (one left, and one right).
 */
export class Splitter {

    private readonly left: CSSSelector | HTMLElement;
    private readonly right: CSSSelector | HTMLElement;

    private readonly split: Split.Instance;
    private readonly sidebarSide: Side;

    private sizes: number[];

    constructor(left: CSSSelector | HTMLElement,
                right: CSSSelector | HTMLElement,
                sidebarSide: Side = 'right') {

        this.left = left;
        this.right = right;
        this.sidebarSide = sidebarSide;

        this.split = Split([this.left, this.right], {
            sizes: INITIAL_SIZES,
            minSize: 0,
            gutterSize: 7,
            // TODO: this probably shouldn't be here as we added it for resizing
            // but this is only needed by the annotation sidebar for now..
            onDrag: () => this.onDrag()
        });

        this.sizes = INITIAL_SIZES;

    }

    /**
     * Toggle the splitter and return true if it's expanded and false if it's
     */
    public toggle(): SplitterState {

        const collapsed = this.isCollapsed();

        if (collapsed) {
            this.expand();
            return 'expanded';
        } else {
            this.collapse();
            return 'collapsed';
        }

    }

    public collapse() {

        // update the current sizes before we collapse.
        this.sizes = this.split.getSizes();

        if (this.sidebarSide === 'left') {
            this.split.collapse(0);
        }

        if (this.sidebarSide === 'right') {
            this.split.collapse(1);
        }

        this.forceResize();

    }

    public isCollapsed() {

        const size = this.split.getSizes()[1];
        const floorSize = Math.floor(size);

        return floorSize <= 0;
    }

    public expand() {
        this.split.setSizes(INITIAL_SIZES);
        this.forceResize();
    }

    private forceResize() {
        WindowEvents.sendResizeEvent();
    }

    private onDrag() {
        this.forceResize();
    }

}

export type SplitterState = 'expanded' | 'collapsed';

export type Side = 'left' | 'right';

type CSSSelector = string;
