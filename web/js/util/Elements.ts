import {Preconditions} from 'polar-shared/src/Preconditions';
import {Rects} from '../Rects';
import {Rect} from '../Rect';

const $ = require('jquery');

export class Elements {

    /**
     *
     * Compute the offset relative to another parent element.  This can be used
     * to compute the absolute position of an element on a page.
     *
     * @param element
     * @param [parentElement] {HTMLElement} relative to this parentElement.
     *        By default we are relative to the document root (documentElement).
     * @return {Rect}
     */

    // FIXME: this should be getPageOffsetRect and have a
    // relativeToParentElement which is optional.
    public static getRelativeOffsetRect(element: HTMLElement, parentElement?: HTMLElement): Rect {

        Preconditions.assertNotNull(element, "element");

        if (! parentElement) {
            parentElement = element.ownerDocument!.documentElement!;
        }

        const offsetRect = {left: 0, top: 0, width: 0, height: 0};

        function toInt(value: number) {
            if ( isNaN(value) ) {
                return 0;
            }
            return value;
        }

        offsetRect.width = toInt(element.offsetWidth);
        offsetRect.height = toInt(element.offsetHeight);

        while (element !== null) {

            if (element === parentElement) {
                break;
            }

            offsetRect.left += toInt(element.offsetLeft);
            offsetRect.top += toInt(element.offsetTop);

            // TO: Do I have to factor in scrollTop here.. this is insane.
            // I think this isn't true... I think the problem is that the page
            // position changes WRT scrolling.

            // offsetRect.left += toInt(element.scrollLeft);
            // offsetRect.top += toInt(element.scrollTop);

            element = <HTMLElement> element.offsetParent;

        }

        return Rects.createFromBasicRect(offsetRect);

    }

    /**
     * Create a div from the given innerHTML and return it with a wrapper.
     *
     * @param innerHTML
     * @return {HTMLDivElement}
     */
    public static createWrapperElementHTML(innerHTML: string) {

        const div = document.createElement("div");
        div.innerHTML = innerHTML;

        return div;

    }

    /**
     * Create an element for the given HTML and return the element instance
     *
     * @param html The HTML element to create
     */
    public static createElementHTML(html: string, tagName = 'div' ): HTMLElement {

        const div = document.createElement(tagName);
        div.innerHTML = html;

        return <HTMLElement> div.firstChild!;

    }

    public static offset(element: HTMLElement) {

        const result = {
            left: element.offsetLeft,
            top: element.offsetTop,
            width: element.offsetWidth,
            height: element.offsetHeight,
            right: 0,
            bottom: 0
        };

        result.right = result.left + result.width;
        result.bottom = result.top + result.height;

        return Rects.validate(Rects.createFromBasicRect(result));

    }

    /**
     * Require that the element have the given classname.
     */
    public static requireClass(element: HTMLElement, clazz: string) {

        const classValue = element.getAttribute("class");

        if ( ! classValue || classValue.indexOf(clazz) === -1) {

            // element isn't the proper class we're expecting.
            throw new Error("Element does not have the proper class: " + clazz);

        }

    }

    /**
     * Keep searching parent notes until we find an element matching the
     * selector, or return null when one was not found.
     *
     */
    public static untilRoot(element: HTMLElement, selector: string): any {

        // TODO: refactor this for typescript

        if (!element) {
            throw new Error("element required");
        }

        if (!selector) {
            throw new Error("selector required");
        }

        if (element.matches(selector)) {
            return element;
        }

        if (element.parentElement == null) {
            // we have hit the root.
            return null;
        }

        return Elements.untilRoot(element.parentElement, selector);

    }

    public static calculateVisibilityForDiv(div: HTMLElement): number {

        if (div == null) {
            throw Error("Not given a div");
        }

        const windowHeight = $(window).height();
        const docScroll = $(document).scrollTop();
        const divPosition = $(div).offset().top;
        const divHeight = $(div).height();

        const hiddenBefore = docScroll - divPosition;
        const hiddenAfter = (divPosition + divHeight) - (docScroll + windowHeight);

        if ((docScroll > divPosition + divHeight) || (divPosition > docScroll + windowHeight)) {
            return 0;
        } else {
            let result = 100;

            if (hiddenBefore > 0) {
                result -= (hiddenBefore * 100) / divHeight;
            }

            if (hiddenAfter > 0) {
                result -= (hiddenAfter * 100) / divHeight;
            }

            return result;
        }

    }

    public static getScrollParent(element: Element | null | undefined): Element | undefined {

        if (!element) {
            return undefined;
        }

        const scrollHeight = element.scrollHeight;
        const clientHeight = element.clientHeight;

        if (scrollHeight > clientHeight) {
            // console.log("scroll parent based on: ", {scrollHeight, clientHeight});
            return element;

        } else {
            return this.getScrollParent(element.parentElement);
        }

    }

}
