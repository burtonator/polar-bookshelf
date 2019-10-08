import * as React from 'react';
import {IStyleMap} from '../../react/IStyleMap';


const Styles: IStyleMap = {

    icon: {
        fontSize: '120px',
        margin: '20px',
        color: '#007bff'
        // minWidth: '350px',
        // width: '350px'
    },

};

export class InviteUsersContent extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

    }

    public render() {

        return (
            <div className="intro p-1">

                <div className="text-center">

                    <i className="fas fa-envelope-open" style={Styles.icon}></i>

                    <h1 className="title">Invite Your Colleagues to Polar</h1>

                </div>

                <p className="subtitle" style={Styles.overview}>
                    One month free of cloud storage for every user
                    you invite!
                </p>

                <p>
                    Get a <b>free</b> month of Polar cloud storage for every
                    user you invite. Once they purchase Polar cloud sync for
                    sixty days we'll credit your account.  Invite as many users
                    as you would like!
                </p>

                <p>
                    Just enter their emails below and we'll send them an
                    invitation.
                </p>

                <p>
                    We'll also give you the option to follow them once we enable
                    document sharing in a future release!
                </p>

                <label className="text-muted">Enter email addresses below:</label>

                <textarea autoFocus={true}
                          onChange={(element) => this.props.onInvitedUserText(element.currentTarget.value)}
                          style={{width: '100%', height: '100px'}}>

                </textarea>

            </div>

        );
    }

}

interface IProps {

    onInvitedUserText: (text: string) => void;

}

interface IState {

}


