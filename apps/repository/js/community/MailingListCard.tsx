import * as React from 'react';
import {Logger} from 'polar-shared/src/logger/Logger';
import Card from 'reactstrap/lib/Card';
import CardHeader from 'reactstrap/lib/CardHeader';
import CardBody from 'reactstrap/lib/CardBody';

const log = Logger.create();

export default class MailingListCard extends React.Component<any, any> {

    constructor(props: any, context: any) {
        super(props, context);

    }

    public render() {

        return (

            <Card>
                <CardHeader><b>Mailing List</b></CardHeader>
                <CardBody>

                    <div className="text-center">

                        <form action="https://spinn3r.us10.list-manage.com/subscribe/post?u=0b1739813ebf118e92faf8fc3&amp;id=ad3d53e837" method="post"
                              id="mc-embedded-subscribe-form"
                              name="mc-embedded-subscribe-form"
                              className="validate"
                              target="_blank"
                              noValidate>

                            <div id="mc_embed_signup" className="input-group mt-4 mb-4">

                                    <input name="EMAIL"
                                           type="text"
                                           className="required email form-control mce_inline_error"
                                           placeholder="Enter your email address"
                                           aria-required="true" aria-invalid="true"/>

                                    <div style={{position: 'absolute', left: '-5000px'}} aria-hidden="true">
                                        <input type="text"
                                               name="b_0b1739813ebf118e92faf8fc3_ad3d53e837"
                                               tabIndex={-1} value=""/>
                                    </div>

                                    <span className="input-group-btn">
                                        <button name="subscribe"
                                                type="submit"
                                                id="mc-embedded-subscribe"
                                                className="btn">Join Newsletter</button>
                                    </span>

                            </div>

                            <p id="mce-responses" className="clear">
                            </p>

                            <div className="response" id="mce-error-response" style={{display: 'none'}}></div>
                            <div className="response" id="mce-success-response" style={{display: 'none'}}></div>
                            <p></p>

                            <p className="text-h5 text-muted">
                                <em>
                                    * Your email address is safe with us. We never share your email address.
                                </em>
                            </p>

                        </form>
                    </div>

                </CardBody>
            </Card>

        );
    }

}

export interface IProps {

}

export interface IState {

}


