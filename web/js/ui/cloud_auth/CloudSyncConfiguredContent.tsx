import * as React from 'react';


class Styles {

    public static icon: React.CSSProperties = {
        fontSize: '120px',
        margin: '20px',
        // color: '007bff'
        // minWidth: '350px',
        // width: '350px'
    };

    public static overview: React.CSSProperties = {
        fontSize: '18px',
        textAlign: 'justify',
        margin: '25px'
    };

    public static content: React.CSSProperties = {
        maxWidth: '800px'
    };

}

export class CloudSyncConfiguredContent extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

    }

    public render() {

        return (

            <div style={Styles.content}>

                <div className="text-center">

                    <i className="fas fa-check-circle text-success" style={Styles.icon}></i>

                    <h1>Cloud Sync Configured</h1>

                </div>

                <h2 className="intro" style={Styles.overview}>
                    Polar Cloud Sync is now setup!  Your documents will now be
                    copied to the cloud in the background in realtime.
                </h2>

                <p className="intro" style={Styles.overview}>
                    Any new documents you add (or annotate) will also be updated
                    and synchronized in the background.
                </p>

                <p className="intro" style={Styles.overview}>
                    Please remember that Polar Sync is <b>not</b> a replacement
                    for a good backup strategy!  If you delete your files in
                    Polar Sync they're gone forever - just as though you deleted
                    them locally.
                </p>

            </div>

        );
    }

}

interface IProps {
}

interface IState {

}


