import * as React from 'react';
import {Button, InputGroupAddon} from 'reactstrap';
import {ISimpleReactor} from '../../../reactor/SimpleReactor';
import {NavigationEventType, NavigationEvent} from '../BrowserApp';

export class RefreshButton extends React.Component<IProps, State> {

    constructor(props: IProps, context: State) {
        super(props, context);

        this.state = {
            nav: 'none'
        };

    }

    public componentDidMount(): void {

        this.props.navigationReactor.addEventListener(event => {

            if (event.type === 'did-start-loading') {

                this.setState( {
                    nav: 'loading'
                });

            }

            if (event.type === 'did-stop-loading') {

                this.setState( {
                    nav: 'loaded'
                });

            }

        });

    }

    public render() {

        let navButtonClassName = '';
        let disabled = false;

        switch (this.state.nav) {
            case 'none':
                navButtonClassName = 'fas fa-sync fa-lg';
                disabled = true;
                break;
            case 'loading':
                navButtonClassName = 'fas fa-sync fa-lg fa-spin';
                disabled = false;
                break;
            case 'loaded':
                navButtonClassName = 'fas fa-sync fa-lg';
                disabled = false;
                break;
        };

        return (

            <InputGroupAddon addonType="prepend"
                             title="Refresh the current page">

                <Button type="button"
                        className="btn btn-outline-secondary"
                        aria-label=""
                        disabled={disabled}
                        onClick={this.props.onReload}>

                    <span className={navButtonClassName} aria-hidden="true"></span>

                </Button>

            </InputGroupAddon>

        );

    }

}

interface IProps {
    navigationReactor: ISimpleReactor<NavigationEvent>;
    onReload: () => void;
    disabled?: boolean;

}

interface State {
    // what's happening with the load status.
    nav: 'none' | 'loading' | 'loaded';
}
