/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {IStyleMap} from '../../react/IStyleMap';
import {Progress} from 'reactstrap';
import {Reactor} from '../../reactor/Reactor';
import Collapse from 'reactstrap/lib/Collapse';
import {IEventDispatcher} from '../../reactor/SimpleReactor';
import {EventListener} from '../../reactor/EventListener';
import {Logger} from 'polar-shared/src/logger/Logger';
import Button from 'reactstrap/lib/Button';

const log = Logger.create();

class Styles {

    public static notice: React.CSSProperties = {

        position: 'fixed',
        width: '450px',
        bottom: '10px',
        right: '15px',
        zIndex: 999999,
        backgroundColor: '#ced4da',
        whiteSpace: 'initial'

    };

    public static intro: React.CSSProperties = {

        fontWeight: 'bold',
        fontSize: '22px',
        margin: '5px 0px 10px 0px'

    };

}

export class GDPRNotice extends React.Component<any, IState> {

    constructor(props: any) {
        super(props);

        this.onAccept = this.onAccept.bind(this);

        this.state = {
            disabled: window.localStorage.getItem('gdpr-accepted') === 'true'
        };

    }

    public render() {

        const display = this.state.disabled ? 'none' : 'block';

        return (

            <div id="gdpr-notice" style={{display}}>

                <div className="p-3 m-2 rounded" style={Styles.notice}>

                    <div className="pt-1 pb-1">

                        <div style={Styles.intro}>
                            We use cookies to track your usage.
                        </div>

                        <p>
                            We use cookies to track your usage and to determine
                            which features are used to improve the quality of Polar.
                        </p>

                        <p>
                            Additionally, we track application errors which helps us
                            find bugs and to prioritize which issues to fix.
                        </p>

                        <p>
                            This data is sent to 3rd parties which provide the
                            infrastructure necessary to provide the analytics
                            services needed to analyze and store the data.
                        </p>

                        <p>
                            We avoid sending personally identifiable information
                            at all times.
                        </p>

                        <div style={Styles.intro}>
                            Cloud storage and privacy.
                        </div>

                        <p>
                            When using Polar cloud sync we store your data in the
                            cloud and authentication / authorization is controlled
                            by the auth provider you select.
                        </p>

                        <p>
                            We do not sell your private data.  Your private data is
                            your and we're not interested in selling, monetizing, or
                            distributing it to 3rd parties except when necessary to
                            provide data storage services.
                        </p>

                    </div>

                    <div className="text-right">

                        <Button color="primary" onClick={() => this.onAccept()}>Accept</Button>

                    </div>

                </div>

            </div>

        );
    }

    private onAccept() {

        window.localStorage.setItem('gdpr-accepted', 'true');

        this.setState({
            disabled: true
        });

    }

}

export interface IState {
    readonly disabled: boolean;
}
