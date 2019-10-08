import * as React from 'react';
import Alert from 'reactstrap/lib/Alert';
import {RendererAnalytics} from '../../../web/js/ga/RendererAnalytics';
import {Arrays} from "polar-shared/src/util/Arrays";

// <i className="fab fa-github"></i>

// noinspection TsLint
export class MessageBanner extends React.Component<IProps, IState> {

    private message?: Message;

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
            visible: true
        };

        this.onDismiss = this.onDismiss.bind(this);
        this.onClick = this.onClick.bind(this);

    }

    public render() {

        if (this.message) {

            return (<div>

                <Alert color="info"
                       isOpen={this.state.visible}
                       toggle={this.onDismiss}
                       fade={false}
                       onClick={() => this.onClick(this.message!)}
                       className="mt-1 mb-1 pl-1 pr-1">

                    {this.message!.element}

                </Alert>

            </div>);

        } else {
            return (<div></div>);
        }

    }


    public componentWillMount(): void {

        if (MESSAGES.length > 0) {
            this.message = Arrays.shuffle(...MESSAGES)[0];
        }

    }

    private onDismiss() {
        this.setState({ visible: false });
    }

    private onClick(message: Message) {
        RendererAnalytics.event({category: 'message-banner-click', action: message.id});
    }

}

interface IState {
    visible: boolean;
}

export interface IProps {

}

interface Message {

    id: string;
    element: JSX.Element;

}

// noinspection TsLint
const MESSAGES: Message[] = [

    // TODO: put links to help and other technical docs.
    // TODO: Make some of these poll options I think.

    // {
    //     id: 'github-star',
    //     element: <div><b>Do you like POLAR?</b> Would you mind <a href="https://github.com/burtonator/polar-bookshelf">giving us a star on Github?</a></div>,
    // },
    // {
    //     id: 'alternativeto-vote',
    //     element: <div>Can you help other people discover POLAR by <a href="https://alternativeto.net/software/polar-1/">voting for us on alternativeTo?</a></div>
    // },
    // {
    //     id: 'free-polar-cloud-storage',
    //     element: <div>You can get a <b>free month of POLAR Cloud Storage</b> by inviting your colleagues. Go to <b><i>"Cloud Sync | Invite Users"</i></b></div>
    // },

    // {
    //     id: 'join-discord',
    //     element: <div><b>Want to discuss POLAR with other users? </b><a href="https://discord.gg/GT8MhA6">Join our live Discord chat group!</a></div>
    // },
    // {
    //     id: 'opencollective-donate',
    //     element: <div>Polar needs your help to continue future development! <a href="https://opencollective.com/polar-bookshelf/donate">Donate to Support Polar</a></div>
    // },
    // {
    //     id: 'polar-feedback-2018-12',
    //     element: <div>Could you take 1 minute and <a href="https://kevinburton1.typeform.com/to/u1zNWG">complete a survey</a> about your usage of Polar?</div>
    // },
    // {
    //     id: 'chrome-extension',
    //     element: <div>Make sure you have our <a href="https://chrome.google.com/webstore/detail/save-to-polar/jkfdkjomocoaljglgddnmhcbolldcafd/">Chrome Extension</a> to <b>capture web pages directly from your browser!</b></div>
    // },
    //
    // {
    //     id: 'polar-updates',
    //     element: <div><b>Polar is updated often</b> - at least twice a month and usually once a week.  <b>Always make sure you're on the latest version.</b></div>
    // },


    // {
    //     id: 'opencollective-donate-button',
    //     element: <div>
    //
    //         <div>
    //             <div style={{width: '100%', paddingRight: '40px'}}>
    //
    //                 <div className="flexbar ">
    //
    //                     <div style={{alignSelf: 'center'}}>
    //                         Polar needs your help to continue future development!
    //                     </div>
    //
    //                     <div className="flexbar-right">
    //
    //                         <a href="https://opencollective.com/polar-bookshelf/donate" target="_blank">
    //                             <img src="https://opencollective.com/polar-bookshelf/donate/button@2x.png?color=blue" width="250" />
    //                         </a>
    //
    //                     </div>
    //
    //
    //                 </div>
    //
    //
    //             </div>
    //
    //         </div>
    //
    //     </div>
    // }

];

