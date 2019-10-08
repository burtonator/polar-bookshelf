import {Pagemark} from './Pagemark';
import {PagemarkType} from 'polar-shared/src/metadata/PagemarkType';
import {PagemarkRect} from './PagemarkRect';
import {Preconditions} from 'polar-shared/src/Preconditions';
import {Rect} from '../Rect';
import {Rects} from '../Rects';

export class PagemarkRects {

    /**
     *
     * Create a default PagemarkRect from a Pagemark that might be legacy.
     *
     */
    static createDefault(pagemark: Pagemark) {

        if(pagemark.type === PagemarkType.SINGLE_COLUMN && "percentage" in pagemark) {

            return new PagemarkRect({
                left: 0,
                top: 0,
                width: 100,
                height: pagemark.percentage
            });

        }

        throw new Error("Can not create default");

    }

    /**
     *
     * @param percentage {number}
     * @return {PagemarkRect}
     */
    static createFromPercentage(percentage: number) {

        return new PagemarkRect({
            left: 0,
            top: 0,
            width: 100,
            height: percentage
        });
    }


    /**
     *
     *
     * @param rect {Rect}
     * @return {PagemarkRect}
     */
    public static createFromRect(rect: any) {

        return new PagemarkRect({
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height
        });

    }

    /**
     *
     * @deprecated Moving to AnnotationRects
     * @param xAxis {Line}
     * @param yAxis {Line}
     * @return {PagemarkRect}
     */
    static createFromLines(xAxis: any, yAxis: any) {
        return PagemarkRects.createFromRect(Rects.createFromLines(xAxis, yAxis));
    }

    /**
     * Create a new PagemarkRect from a positioned rect.  We use this to take
     * a dragged or resized rect / box on the screen then convert it to a
     * PagemarkRect with the correct coordinates.
     *
     * @deprecated Moving to AnnotationRects
     * @param boxRect {Rect}
     * @param containerRect {Rect}
     * @return {PagemarkRect}
     */
    static createFromPositionedRect(boxRect: any, containerRect: any) {

        Preconditions.assertInstanceOf(boxRect, Rect, "boxRect");

        let xAxis = boxRect.toLine("x").multiply(100 / containerRect.width).floor();
        let yAxis = boxRect.toLine("y").multiply(100 / containerRect.height).floor();

        return this.createFromLines(xAxis, yAxis);

    }

}
