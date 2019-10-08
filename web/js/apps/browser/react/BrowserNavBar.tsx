import * as React from 'react';
import {Button, InputGroup, InputGroupAddon} from 'reactstrap';
import Navbar from 'reactstrap/lib/Navbar';
import {BrowserConfigurationInputGroup} from './BrowserConfigurationInputGroup';
import {CaptureButton} from './CaptureButton';
import {URLBar} from './URLBar';
import {ISimpleReactor} from '../../../reactor/SimpleReactor';
import {NavigationEventType, NavigationEvent} from '../BrowserApp';
import {RefreshButton} from './RefreshButton';

export class BrowserNavBar extends React.Component<IProps, IState> {

    constructor(props: IProps, context: IState) {
        super(props, context);

        this.state = {
            loadedURL: false
        };

    }


    public componentDidMount(): void {

        this.props.navigationReactor.addEventListener(event => {

            if (event.type === 'did-start-loading') {
                this.setState({
                    loadedURL: true
                });
            }

        });

    }

    public render() {
        return (

            <div>

                <Navbar light expand="md" className="p-2 border-bottom link-navbar">

                    <InputGroup size="sm" className="">

                        <RefreshButton navigationReactor={this.props.navigationReactor}
                                       onReload={this.props.onReload}/>

                        <URLBar onLoadURL={url => this.onLoadURL(url)}/>

                        <CaptureButton disabled={! this.state.loadedURL}
                                       onTriggerCapture={this.props.onTriggerCapture}/>

                        <BrowserConfigurationInputGroup onBrowserChanged={this.props.onBrowserChanged} />

                    </InputGroup>

                </Navbar>

            </div>
        );
    }

    private onLoadURL(url: string): void {

        this.setState({
            loadedURL: true
        });

        if (this.props.onLoadURL) {
            this.props.onLoadURL(url);
        }

    }

}

interface IState {
    loadedURL: boolean;
}

interface IProps {

    /**
     * Called when need to load a URL that the navbar selected.
     */
    onLoadURL?: (url: string) => void;
    onTriggerCapture?: () => void;
    onBrowserChanged?: (browserName: string) => void;
    navigationReactor: ISimpleReactor<NavigationEvent>;

    /**
     * Called when the reload button was clicked.
     */
    onReload: () => void;

}
