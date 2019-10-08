import {isPresent, notNull} from 'polar-shared/src/Preconditions';
import {PHZMetadata} from '../../phz/PHZMetadata';
import {Logger} from 'polar-shared/src/logger/Logger';
import {ScrollBox} from '../../capture/renderer/Captured';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {Reducers} from 'polar-shared/src/util/Reducers';
import {IDimensions} from "../../util/IDimensions";

const log = Logger.create();

export class Descriptors {

    public static calculateDocDimensions(descriptor?: PHZMetadata): DocDimensions {

        // the default width
        let width = 800;
        let minHeight = 1100;

        if (!descriptor) {
            return {width, minHeight};
        }

        if (descriptor.browser) {

            // use the screen width from the emulated device
            width = descriptor.browser.deviceEmulation.screenSize.width;

            log.info("Setting width from device emulation: " + width);

        }

        const scrollBox = this.computeScrollBox(descriptor);

        if (scrollBox.isPresent() && scrollBox.get().width > width ) {

            // we have a document that isn't mobile aware and hard coded to a
            // specific width greater than our default width.  This is a new
            // setting so we have to make sure the key is in the descriptor.

            if (!isPresent(scrollBox.get().widthOverflow) ||
                scrollBox.get().widthOverflow === 'visible') {

                width = scrollBox.get().width;

            }

            log.info("Setting width from scroll settings: " + width);

        }

        // page height size should be a function of 8.5x11

        minHeight = (11 / 8.5) * width;

        return {width, minHeight};

    }

    public static computeScrollBox(descriptor: PHZMetadata): Optional<ScrollBox> {
        return this.computeScrollBoxFromBoxes(descriptor.scrollBox, descriptor.scroll);
    }

    public static computeScrollBoxFromBoxes(scrollBox?: ScrollBox, scroll?: ScrollBox): Optional<ScrollBox> {

        return [Optional.of(scrollBox), Optional.of(scroll)]
            .filter(current => current.isPresent())
            .filter(current => current.map(scrollBox => this.isScrollBox(scrollBox)).getOrElse(false))
            .reduce(Reducers.FIRST, Optional.empty());

    }

    public static isScrollBox(scrollBox: ScrollBox) {

        return typeof scrollBox.width === 'number' && typeof scrollBox.height === 'number';

    }


}

export interface DocDimensions {
    width: number;
    minHeight: number;

}
