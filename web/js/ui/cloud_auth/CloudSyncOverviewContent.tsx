import * as React from 'react';
import {IStyleMap} from '../../react/IStyleMap';


const Styles: IStyleMap = {

    button: {
        paddingTop: '4px',
        color: 'red !important',
        fontSize: '15px'

        // minWidth: '350px',
        // width: '350px'
    },

    icon: {
        fontSize: '120px',
        margin: '20px',
        color: '#007bff'
        // minWidth: '350px',
        // width: '350px'
    },

    overview: {
        fontSize: '18px',
        textAlign: 'justify',
        margin: '25px'
    },

    features: {
        marginLeft: '25px'
    },

    price: {
        textAlign: 'center',
    },

    price_value: {
        fontSize: '40px',
        fontWeight: 'bold',
        lineHeight: '1em',
    },


    price_overview: {
        fontSize: '14px',
    },

    content: {
        maxWidth: '800px'
    }

};

export class CloudSyncOverviewContent extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

    }

    public render() {

        return (
            <div style={Styles.content}>

                <div className="text-center">

                    <i className="fas fa-cloud-upload-alt" style={Styles.icon}></i>

                    <h1>Polar Cloud Sync</h1>

                </div>

                <p className="intro" style={Styles.overview}>
                    <b>Polar Cloud Sync</b> enables synchronization between
                    multiple devices transparently running Polar.
                </p>

                <ul style={Styles.features}>

                    <li>
                        Full sync of your data in <b>realtime</b>. Your files are
                        immediately distributed to your other devices (MacOS,
                        Windows, and Linux).
                    </li>

                    <li>
                        Up to <b>10 GB</b> of storage for all your documents and
                        annotations.
                    </li>

                    <li>
                        Private access control. Your data is private
                        and only accessible to your account.
                    </li>

                    <li>
                        <b>Full offline access</b> with sync upon reconnect.
                    </li>

                    <li>
                        Your full document repository is still kept local which
                        enables you to stop using cloud sync at any time.
                    </li>

                </ul>

            </div>

        );
    }

}

interface IProps {
}

interface IState {

}


