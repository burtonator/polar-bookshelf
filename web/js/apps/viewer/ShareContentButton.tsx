/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import Button from 'reactstrap/lib/Button';
import PopoverBody from 'reactstrap/lib/PopoverBody';
import {Popover} from 'reactstrap';
import {DatastoreCapabilities} from '../../datastore/Datastore';
import {ShareContentControl} from './ShareContentControl';
import {Visibility} from "polar-shared/src/datastore/Visibility";

class Styles {

    public static dropdownChevron: React.CSSProperties = {

        display: 'inline-block',
        width: 0,
        height: 0,
        marginLeft: '.255em',
        verticalAlign: '.255em',
        borderTop: '.3em solid',
        borderRight: '.3em solid transparent',
        borderBottom: 0,
        borderLeft: '.3em solid transparent',
        color: 'var(--secondary)'

    };

    public static shareControlButtonParent: React.CSSProperties = {

        // position: 'absolute',
        // top: '90px',
        // right: '50px',
        // zIndex: 10,

        // marginLeft: '5px'

    };

}

export class ShareContentButton extends React.PureComponent<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.onDone = this.onDone.bind(this);

        this.state = {
            open: false,
            visibility: this.props.visibility || Visibility.PRIVATE
        };

    }

    public render() {

        const buttonIconClass = this.state.visibility === Visibility.PRIVATE ? "fas fa-lock" : "fas fa-lock-open";

        return (

            <div style={Styles.shareControlButtonParent}
                 className="mr-1 ml-1">

                <Button color="primary"
                        id="share-control-button"
                        size="sm"
                        disabled={this.props.disabled}
                        hidden={this.props.hidden}
                        onClick={() => this.toggle(true)}
                        style={{fontSize: '15px'}}
                        className="pl-2 pr-2 p-1">

                    <div style={{display: 'flex',
                                marginTop: 'auto',
                                marginBottom: 'auto'}}>

                        <div className="mt-auto mb-auto">
                            <i className={buttonIconClass}
                               style={{marginRight: '5px'}}></i>
                        </div>

                        <div className="mt-auto mb-auto">
                            Share
                        </div>

                        <div className="mt-auto mb-auto">
                            <span className="text-white" style={Styles.dropdownChevron}></span>
                        </div>

                    </div>

                </Button>

                <Popover trigger="legacy"
                         placement="bottom"
                         fade={false}
                         delay={0}
                         isOpen={this.state.open}
                         toggle={() => this.toggle(false)}
                         target="share-control-button"
                         className=""
                         style={{maxWidth: '600px'}}>

                    <PopoverBody className="shadow">

                        <ShareContentControl datastoreCapabilities={this.props.datastoreCapabilities}
                                             createShareLink={this.props.createShareLink}
                                             visibility={this.state.visibility}
                                             onVisibilityChanged={async visibility => this.onVisibilityChanged(visibility)}
                                             onDone={() => this.onDone()}/>

                    </PopoverBody>

                </Popover>

            </div>

        );

    }

    private toggle(open: boolean) {
        this.setState({...this.state, open});
    }

    private async onVisibilityChanged(visibility: Visibility) {

        await this.props.onVisibilityChanged(visibility);

        this.setState({...this.state, visibility});

    }

    private onDone() {
        this.toggle(false);
        this.props.onDone();
    }

}

interface IProps {

    readonly datastoreCapabilities: DatastoreCapabilities;

    readonly createShareLink: () => Promise<string | undefined>;

    readonly visibility?: Visibility;

    readonly onVisibilityChanged: (visibility: Visibility) => Promise<void>;

    readonly onDone: () => void;

    readonly disabled?: boolean;

    readonly hidden?: boolean;

}

interface IState {
    readonly open: boolean;
    readonly visibility: Visibility;
}
