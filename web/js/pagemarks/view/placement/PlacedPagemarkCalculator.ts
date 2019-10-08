
import {Axis, Rect} from '../../../Rect';
import {Pagemark} from '../../../metadata/Pagemark';
import {PagemarkRects} from '../../../metadata/PagemarkRects';
import {Preconditions} from 'polar-shared/src/Preconditions';
import {Rects} from '../../../Rects';
import {PlacedPagemark} from './PlacedPagemark';
import {Line} from '../../../util/Line';

export class PlacedPagemarkCalculator {

    /**
     * Compute a Rect for rendering the pagemarkRect onto the parentRect.
     *
     */
    calculate(parentRect: Rect, pagemark: Pagemark) {

        let pagemarkRect = pagemark.rect;

        if(! pagemarkRect) {
            pagemarkRect = PagemarkRects.createDefault(pagemark);
        }

        Preconditions.assertNotNull(parentRect, "parentRect");
        Preconditions.assertNotNull(pagemarkRect, "pagemarkRect");

        let fractionalRect = pagemarkRect.toFractionalRect();

        let resultX = this._scaleAxis(parentRect, fractionalRect, "x");
        let resultY = this._scaleAxis(parentRect, fractionalRect, "y");

        let rect = Rects.createFromLines(resultX, resultY);

        return new PlacedPagemark({rect});

    }

    /**
     *
     */
    _scaleAxis(parentRect: Rect, fractionalRect: Rect, axis: Axis) {
        return this._scaleLine(parentRect.toLine(axis), fractionalRect.toLine(axis))
    }

    /**
     *
     */
    _scaleLine(parentLine: Line, fractionalLine: Line) {
        let start = parentLine.start * fractionalLine.start;
        let end = parentLine.end * fractionalLine.end;
        return new Line(start, end, parentLine.axis);
    }

}
