import {Route, Switch} from "react-router-dom";
import * as React from "react";
import isEqual from "react-fast-compare";
import {
    useComponentDidMount,
    useComponentWillUnmount
} from "../../hooks/ReactLifecycleHooks";
import {deepMemo} from "../../react/ReactUtils";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import clsx from "clsx";


// There are 2-3 main problems with using display: none and potentially
// visibility: hidden here.
//
// - I KNOW that iframes lose scroll position in chrome when we set display: none
// - if we set width: 0 with PDFs they resize from smaller to larger when I switch to them
//
// - I can't set max-height: 0 and visibility: hidden as some of the inner stuff in the annotation sidebar
//   pushes it larger and won't accept min-height
//

const useDisplayStyles = makeStyles((theme) =>
    createStyles({

        active: {
            display: 'flex',
            minHeight: 0,
            flexDirection: 'column',
            flexGrow: 1
        },

        inactive: {
            display: 'none',
            minHeight: 0,
            overflow: 'hidden',
        }

    }),

);

const useVisibilityStyles = makeStyles((theme) =>
    createStyles({

        /**
         * The inactive styles can not use display 'none' because if they do the
         * iframe loses its scrolling position on chrome.
         */
        active: {
            display: 'flex',
            minHeight: 0,
            flexDirection: 'column',
            flexGrow: 1
        },

        inactive: {
            visibility: 'hidden',
            minHeight: "0px !important",
            maxHeight: "0px !important",
            height: "0px !important",
            lineHeight: 0,
            overflow: 'hidden',
            "& *": {
                minHeight: "0px !important",
                maxHeight: "0px !important",
                height: "0px !important",
                lineHeight: 0,
                overflow: 'hidden',
            }
        }

    }),

);


interface MountListenerProps {
    readonly onMounted: (mounted: boolean) => void;
}

const MountListener = React.memo(function MountListener(props: MountListenerProps) {

    useComponentDidMount(() => props.onMounted(true));
    useComponentWillUnmount(() => props.onMounted(false));

    return null;

}, isEqual);

export interface IPersistentRouteContext {
    readonly active: boolean;
}

const PersistentRouteContext = React.createContext<IPersistentRouteContext>({active: true});

export function usePersistentRouteContext() {
    return React.useContext(PersistentRouteContext);
}

type Strategy = 'display' | 'visibility';

interface IProps {
    readonly children: React.ReactElement;
    readonly path: string | string[];
    readonly exact?: boolean;
    readonly strategy: Strategy;
}

export const PersistentRoute = deepMemo(function PersistentRoute(props: IProps) {

    const displayClasses = useDisplayStyles();
    const visibilityClasses = useVisibilityStyles();

    const [active, setActive] = React.useState(false);

    const computeClassName = React.useCallback((active: boolean) => {

        switch(props.strategy) {

            case "display":
                return active ? displayClasses.active : displayClasses.inactive;
            case "visibility":
                return active ? visibilityClasses.active : visibilityClasses.inactive;

        }

    }, [displayClasses.active, displayClasses.inactive, props.strategy, visibilityClasses.active, visibilityClasses.inactive]);

    const className = computeClassName(active);

    return (

        <PersistentRouteContext.Provider value={{ active }}>
            <Switch>

                <Route path="/">
                    <div className={clsx('PersistentRoute', className)}>
                        {props.children}
                    </div>
                </Route>

            </Switch>

            <Switch>
                <Route exact path={props.path}>
                    <MountListener onMounted={setActive}/>
                </Route>
            </Switch>

       </PersistentRouteContext.Provider>
    );

});
