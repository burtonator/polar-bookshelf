import * as React from 'react';
import {AnnotationLinks} from "./AnnotationLinks";
import {useSideNavHistory} from "../sidenav/SideNavStore";
import {IAnnotationPtr} from "./AnnotationPtrs";

/**
 * This is the default jump to annotation button that's used in the document
 * repository
 */
export function useJumpToAnnotationHandler() {

    const history = useSideNavHistory();

    const nonceRef = React.useRef<string | undefined>(undefined);

    const doJump = React.useCallback((ptr: IAnnotationPtr) => {

        if (nonceRef.current !== ptr.n) {
                const url = AnnotationLinks.createRelativeURL(ptr);
                console.log("Jumping to annotation via history and doc viewer context: " + url);
                history.push(url);
        }

        nonceRef.current = ptr.n;

    }, [history]);

    return React.useCallback((ptr: IAnnotationPtr) => {

        doJump(ptr)

    }, [doJump]);

}
