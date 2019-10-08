import React from 'react';
import {Progress} from '../../util/ProgressTracker';
import Modal from 'reactstrap/lib/Modal';
import {LargeModal} from '../../ui/large_modal/LargeModal';
import {Button, ModalFooter, ModalHeader} from 'reactstrap';
import {LargeModalBody} from '../../ui/large_modal/LargeModalBody';
import {LifecycleEvents} from '../../ui/util/LifecycleEvents';
import {LocalPrefs} from '../../util/LocalPrefs';
import {Latch} from "polar-shared/src/util/Latch";

export class PreviewDisclaimer extends React.PureComponent<IProps, IState> {

    constructor(props: any) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.onOK = this.onOK.bind(this);

        this.state = {
            open: true
        };

    }

    public render() {

        return (

            <LargeModal isOpen={this.state.open}
                        toggle={() => this.toggle()}>


                <LargeModalBody>

                    <h2>Polar Web <b>Preview</b></h2>

                    <p>
                        This is a preview version of Polar for the web.
                    </p>

                    <p>
                        It works natively with <b>Polar Cloud Sync</b>.  If you
                        use the same account, your desktop files and annotations
                        will work on the web and be transparently synchronized.
                    </p>

                    <p>
                        It's <b>near real time!</b>  Any changes you make on the web
                        will instantly be reflected on your desktop and other
                        browser tabs.
                    </p>

                    <p>
                        It's mostly functional but has the following
                        limitations.
                    </p>

                    <ul>

                        <li>Only PDF documents work for now. Captured web content doesn't yet work.</li>
                        <li>Won't work on mobile just yet.  The UI doesn't adjust to a smaller display but we're working on reworking this.</li>
                        <li>The Chrome Extension doesn't yet work with the webapp.</li>
                        <li>Anki sync won't work and is desktop specific (won't ever work on the webapp).</li>

                    </ul>

                </LargeModalBody>

                <ModalFooter>

                    <Button color="secondary"
                            onClick={() => this.onOK()}>
                        OK
                    </Button>

                </ModalFooter>

            </LargeModal>

        );
    }

    private onOK(): void {
        LocalPrefs.mark(LifecycleEvents.WEBAPP_PREVIEW_WARNING_SHOWN);

        this.setState({open: false});

    }

    private toggle(): void {

        this.setState({...this.state, open: !this.state.open});

    }

}

export interface IProps {


}

export interface IState {
    readonly open: boolean;

}
