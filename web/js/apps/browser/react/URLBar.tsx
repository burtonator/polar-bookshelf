import * as React from 'react';
import {Input} from 'reactstrap';
import {Logger} from 'polar-shared/src/logger/Logger';

const log = Logger.create();

export class URLBar extends React.Component<Props, State> {

    constructor(props: any, context: any) {
        super(props, context);
        this.onKeyPress = this.onKeyPress.bind(this);
    }

    public render() {

        return (

            <Input autoFocus
                   id="url-bar"
                   className="px-2 mx-1"
                   name="url"
                   onKeyPress={(event) => this.onKeyPress(event)} />

        );

    }

    private onKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {

        if (event.which === 13) {
            const url = (event.target as HTMLInputElement).value;
            log.info("Loading URL" + url);
            this.onLoadURL(url);

        }

    }

    private onLoadURL(url: string) {

        if (this.props.onLoadURL) {
            this.props.onLoadURL(url);
        }

    }

}

interface State {

}

interface Props {

    /**
     * Called when need to load a URL that the navbar selected.
     */
    onLoadURL?: (url: string) => void;

}
