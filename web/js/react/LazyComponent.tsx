import * as React from 'react';
import {LazyProps} from './LazyComponents';
import {LazyState} from './LazyComponents';
import {lazyObjEquals} from './LazyComponents';

/**
 * Component that has a smart implementation of shouldComponentUpdate that
 * supports primitiveTypes
 */
export abstract class LazyComponent<L extends LazyProps, S extends LazyState> extends React.Component<L, S> {

    // TODO: one design flaw here is that we're comparing on the object and
    // assuming that it has NO additional properties which might not be correct.
    //
    // I might want to refactor this to include just the keys of a specific
    // object but I need to figure out how to make this OO so that I can just
    // specify keysOf using Typescript.
    //
    // implementing a equals function should just be as simple as a loop over the
    // keys and then do an objectEquals for each one.  We just have to handle
    // the null and undefined values properly.
    //
    // this is going to be necessary so that I can pass sub sub-properties via JSX
    // rest operators like:
    //
    // <Foo {...this.props}/>
    //
    // This is going to be much easier than passing the values around directly
    // for constrained types.

    protected constructor(props: L, context: any) {
        super(props, context);
    }

    public shouldComponentUpdate(nextProps: Readonly<LazyProps>, nextState: Readonly<LazyState>, nextContext: any): boolean {

        if (! lazyObjEquals(this.props, nextProps)) {
            return true;
        }

        if (! lazyObjEquals(this.state, nextState)) {
            return true;
        }

        return false;

    }

}

