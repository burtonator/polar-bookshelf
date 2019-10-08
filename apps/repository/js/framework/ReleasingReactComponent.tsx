import * as React from 'react';
import {Logger} from 'polar-shared/src/logger/Logger';
import {Releaser} from '../../../../web/js/reactor/EventListener';

const log = Logger.create();

export default class ReleasingReactComponent<P, S> extends React.Component<P, S> {

    protected readonly releaser = new Releaser();

    constructor(props: P, context: any) {
        super(props, context);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
    }

    public componentWillUnmount(): void {
        log.info("Releasing resources with releaser");
        this.releaser.release();
    }

}

