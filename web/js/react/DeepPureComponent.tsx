import * as React from 'react';

const isEqual = require("react-fast-compare");

/**
 * Like PureComponent but does a deep comparison.
 */
export abstract class DeepPureComponent<P, S> extends React.Component<P, S> {

    protected constructor(props: P, context: any) {
        super(props, context);
    }

    public shouldComponentUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean {

        if (! isEqual(this.props, nextProps)) {
            return true;
        }

        if (! isEqual(this.state, nextState)) {
            return true;
        }

        return false;

    }

}

