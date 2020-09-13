import React from 'react';
import {HashURLs} from "polar-shared/src/util/HashURLs";
import {IDStr} from "polar-shared/src/util/Strings";
import {IListenable} from './UseLocationChangeHook';
import {useLocationChangeStore} from './UseLocationChangeStore';
import {useHistory, useLocation} from 'react-router-dom';
import {Optional} from 'polar-shared/src/util/ts/Optional';

export function scrollIntoView(scrollTarget: IScrollTarget, ref: HTMLElement) {

    // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
    const alignToTop = scrollTarget.pos === 'top';

    // TODO: this component should take scrollIntoView opts and
    // pass them here.
    ref.scrollIntoView(alignToTop);

}

export function useScrollIntoViewUsingLocation() {

    const ref = React.useRef<HTMLElement | null>(null);
    const {initialScrollLoader} = useLocationChangeStore(['initialScrollLoader'])
    const scrollTarget = useScrollTarget();

    // There are two times when this needs to be called:
    //
    // - when the ref is defined because we then might have a ref + scrollTarget
    //
    // - when the scrollTarget has changed due to a locatoin change.

    function handleRef() {
        if (scrollTarget && ref.current) {
            initialScrollLoader(scrollTarget, ref.current);
        }
    }

    handleRef();

    return (newRef: HTMLElement | null) => {

        if (ref.current !== newRef) {
            ref.current = newRef;
            handleRef();
        }

    }

}

export interface IScrollTarget {

    readonly target: IDStr;

    // where to align the target
    readonly pos: 'top' | 'bottom';

    readonly n: string;

    /**
     * Add some scroll buffer so that we scroll a bit more to better highlight
     * the item we scrolled to.
     */
    readonly b: number;

}

export namespace ScrollTargets {

    import QueryOrLocation = HashURLs.QueryOrLocation;

    export function parse(queryOrLocation: QueryOrLocation): IScrollTarget | undefined {

        const params = HashURLs.parse(queryOrLocation);
        const target = params.get('target') || undefined;
        const n = params.get('n');
        const b = Optional.of(params.get('b'))
                          .map(parseInt)
                          .getOrElse(0);

        const pos = params.get('pos') === 'bottom' ? 'bottom' : 'top';

        if (! n) {
            return undefined;
        }

        if (! target) {
            return undefined;
        }

        return {target, pos, n, b};

    }

}

export function useScrollTarget(): IScrollTarget | undefined {
    const location = useLocation();
    return ScrollTargets.parse(location);
}

/**
 *
 */
export function useScrollTargetUpdateListener(): IListenable<IScrollTarget> {

    const history = useHistory();

    function listen(listener: (scrollTarget: IScrollTarget) => void) {

        return history.listen(newLocation => {

            const scrollTarget = ScrollTargets.parse(newLocation);

            if (scrollTarget) {
                listener(scrollTarget);
            }

        });

    }

    return {listen};

}
