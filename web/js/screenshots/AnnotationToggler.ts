import {AnnotationStyle} from './electron/ElectronScreenshots';
import {StyleRestore} from './electron/ElectronScreenshots';
import {Promises} from '../util/Promises';

const MIN_PAINT_INTERVAL = 1000 / 60;

export class AnnotationToggler {

    private SELECTOR = ".page .pagemark, .page .text-highlight, .page .area-highlight";

    private annotationStyles: AnnotationStyle[] = [];

    private getAnnotationElements(): ReadonlyArray<HTMLElement> {
        return Array.from(document.querySelectorAll(this.SELECTOR));
    }

    public async hide() {

        // TODO: this should be the PROPER way to do this but on my machine
        // this still doesn't work.
        await Promises.requestAnimationFrame(() => this.hideAnnotations());

        // wait for at least 1/60th of a second which is the duration that most
        // machines target.  This is probably too long in practice though.
        await Promises.waitFor(MIN_PAINT_INTERVAL);

    }

    private hideAnnotations() {

        for (const annotationElement of this.getAnnotationElements()) {

            const styleRestore: StyleRestore = {
                visibility: annotationElement.style.visibility
            };

            annotationElement.style.visibility = 'hidden';

            this.annotationStyles.push({element: annotationElement, styleRestore});

        }

    }

    public show() {

        for (const annotationStyle of this.annotationStyles) {

            annotationStyle.element.style.visibility =
                annotationStyle.styleRestore.visibility;

        }

    }

}

