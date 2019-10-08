/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {Logger} from 'polar-shared/src/logger/Logger';
import Button from 'reactstrap/lib/Button';
import {DatastoreCapabilities} from '../../datastore/Datastore';
import Input from 'reactstrap/lib/Input';
import {SocialLinks} from '../../util/SocialLinks';
import {RendererAnalytics} from '../../ga/RendererAnalytics';
import {SplitLayout} from '../../ui/split_layout/SplitLayout';
import {SplitLayoutLeft} from '../../ui/split_layout/SplitLayout';
import {SplitLayoutRight} from '../../ui/split_layout/SplitLayoutRight';
import CreatableSelect from 'react-select/lib/Creatable';
import {Visibility} from "polar-shared/src/datastore/Visibility";

const log = Logger.create();

class Styles {

    public static ShareButton: React.CSSProperties = {
        fontSize: '35px',
        marginTop: 'auto',
        marginBottom: 'auto',
        marginRight: '10px',
    };

    public static ShareImage: React.CSSProperties = {
        maxHeight: '35px',
        maxWidth: '35px',
    };

}

export class ShareContentControl extends React.PureComponent<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.onVisibilityChanged = this.onVisibilityChanged.bind(this);
        this.onDone = this.onDone.bind(this);
        this.sharedVia = this.sharedVia.bind(this);

        this.state = {
            // the current visibility or private by default.
            visibility: this.props.visibility || Visibility.PRIVATE
        };

        this.props.createShareLink()
            .then((shareLink) => {
                log.info("Share link resolved to: " + shareLink);
                this.setState({...this.state, shareLink});
            })
            .catch(err => log.error("Unable to create share link: ", err));

    }

    public render() {

        const visibility = this.state.visibility;

        const shareLink = this.state.shareLink || "";

        // FIXME include the tags for the document too this way when people
        // search via Twitter or Facebook these tags show up and so will the
        // docs from Polar when they click through.

        // TODO: include a link back to the main Polar app?

        const VisibilityDescription = () => {

            if (visibility === 'private') {

                return <p>Documents that are <b>private</b> may only be seen or
                    edited by you and are not available to anyone else including
                    search engines.
                </p>;

            } else {
                return <div>

                    <p>
                        Documents that are <b>public</b> are <i>shared publicly
                        on the Internet</i> with anyone who has access to the
                        URL including search engines. Only you can add
                        annotations which appear on this URL. The user may add
                        the document to their own document repository to add
                        their own annotations.
                    </p>

                    <div className="mt-1 mb-1">
                        <b>Link to share:</b>
                    </div>

                    <div className="mb-1">
                        <Input type="text"
                               className="pl-1 pr-1"
                               style={{
                                   minWidth: '150px',
                                   maxWidth: '650px',
                                   fontSize: '14px'
                                }}
                               onFocus={(event) => event.target.select()}
                               defaultValue={shareLink}></Input>
                    </div>

                    <div className="mt-2"
                         style={{
                             display: 'flex'
                         }}>

                        <div className="text-muted mt-auto mb-auto mr-2 ">
                            Share link via:
                        </div>

                        <a target="_new"
                           style={Styles.ShareButton}
                           onClick={() => this.sharedVia('twitter')}
                           title="Twitter"
                           href={SocialLinks.createForTwitter(shareLink)}>

                            <img style={Styles.ShareImage}
                                 alt="twitter"
                                 src="/web/assets/logos/twitter.svg"/>

                        </a>

                        <a target="_new"
                           style={Styles.ShareButton}
                           onClick={() => this.sharedVia('gmail')}
                           title="GMail"
                           href={SocialLinks.createForGMail(shareLink)}>

                            <img style={Styles.ShareImage}
                                 alt="GMail"
                                 src="/web/assets/logos/gmail.svg"/>

                        </a>

                        <a target="_new"
                           style={Styles.ShareButton}
                           onClick={() => this.sharedVia('facebook')}
                           title="Facebook"
                           href={SocialLinks.createForFacebook(shareLink)}>

                            <img style={Styles.ShareImage}
                                 alt="Facebook"
                                 src="/web/assets/logos/facebook.svg"/>

                        </a>

                    </div>

                </div>;
            }

        };

        const WebSharing = () => {

            return <div className="twitter-bootstrap-content">

                <div style={{
                    display: 'flex',
                    verticalAlign: 'top'
                }}>

                    <div className="p-1">

                        <div style={{display: 'block', whiteSpace: 'nowrap'}}
                             className="mt-2 mb-2">

                            <Button id="sharing-button-private"
                                    color={colors.PRIVATE}
                                    outline={outlines.PRIVATE}
                                    size="md"
                                    onClick={() => this.onVisibilityChanged(Visibility.PRIVATE)}>

                                <span className="mr-1">
                                    <i className="fas fa-lock"></i>
                                </span>

                                Private

                            </Button>

                            <Button id="sharing-button-public"
                                    color={colors.PUBLIC}
                                    outline={outlines.PUBLIC}
                                    size="md"
                                    onClick={() => this.onVisibilityChanged(Visibility.PUBLIC)}
                                    className="ml-2">

                                <span className="mr-1">
                                    <i className="fas fa-lock-open"></i>
                                </span>

                                Public

                            </Button>

                        </div>

                        <p>
                            This document is currently <b>{visibility}</b>.
                        </p>

                        <VisibilityDescription/>

                        <div className="mt-1 mb-1">

                            TODO:
                                - only accept input that looks like an email address
                                -

                            <CreatableSelect
                                isMulti
                                isClearable
                                autoFocus
                                // onKeyDown={event => this.onKeyDown(event)}
                                // className="basic-multi-select"
                                classNamePrefix="select"
                                // onChange={(selectedOptions) => this.handleChange(selectedOptions as TagOption[])}
                                value={[]}
                                defaultValue={[]}
                                placeholder="Enter names or email addresses"
                                // options={availableTagOptions}>
                                >

                            </CreatableSelect>

                        </div>

                        <div className="text-right">

                            <Button id="sharing-button-ok"
                                    color="secondary"
                                    size="sm"
                                    onClick={() => this.onDone()}
                                    className="ml-1">

                                Done

                            </Button>

                        </div>

                    </div>

                </div>

            </div>;

        };

        const NoSharingEnabled = () => {
            return <div className="twitter-bootstrap-content p-2">

                <SplitLayout>

                    <SplitLayoutLeft>

                        <h3>Enable Cloud Sync</h3>

                        <p>
                            Cloud Sync must be enabled for the Polar desktop app to work
                            with sharing.
                        </p>

                    </SplitLayoutLeft>

                    <SplitLayoutRight>
                        <i className="fas fa-unlink text-danger" style={{fontSize: '75px'}}></i>
                    </SplitLayoutRight>

                </SplitLayout>

            </div>;
        };

        const outlines = {
            PRIVATE: visibility !== Visibility.PRIVATE,
            PUBLIC: visibility !== Visibility.PUBLIC,
        };

        const colors = {
            PRIVATE: visibility === Visibility.PRIVATE ? 'primary' : 'secondary',
            PUBLIC: visibility === Visibility.PUBLIC ? 'primary' : 'secondary'
        };

        if (this.props.datastoreCapabilities.networkLayers.has('web')) {
            return <WebSharing/>;
        } else {
            return <NoSharingEnabled/>;
        }

    }

    private onVisibilityChanged(visibility: Visibility) {

        if (visibility === this.state.visibility) {
            // already done...
            return;
        }

        this.props.onVisibilityChanged(visibility)
            .then(() => {
                this.setState({visibility});
            })
            .catch(err => log.error("Unable to change visibility: ", err));

    }

    private sharedVia(platform: SharePlatform) {
        RendererAnalytics.event({category: 'shared-via', action: platform});
    }

    private onDone() {
        RendererAnalytics.event({category: 'sharing', action: this.state.visibility});
        this.props.onDone();
    }

}

interface IProps {

    readonly datastoreCapabilities: DatastoreCapabilities;

    readonly visibility?: Visibility;

    /**
     * Function used to create the link when we're sharing the document
     * publicly.
     */
    readonly createShareLink: () => Promise<string | undefined>;

    /**
     * Called when the visibility for this content has changed.
     */
    readonly onVisibilityChanged: (visibility: Visibility) => Promise<void>;

    readonly onDone: () => void;

}

interface IState {

    readonly visibility: Visibility;

    // the resolved share link
    readonly shareLink?: string;

}

export type SharePlatform = 'twitter' | 'facebook' | 'gmail';
