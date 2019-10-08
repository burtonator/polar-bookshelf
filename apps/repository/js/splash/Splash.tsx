import * as React from 'react';
import {Logger} from 'polar-shared/src/logger/Logger';
import {LargeModal} from '../../../../web/js/ui/large_modal/LargeModal';
import {LargeModalBody} from '../../../../web/js/ui/large_modal/LargeModalBody';
import {IStyleMap} from '../../../../web/js/react/IStyleMap';
import {ConditionalSetting} from '../../../../web/js/ui/util/ConditionalSetting';
import Button from 'reactstrap/lib/Button';
import Label from 'reactstrap/lib/Label';
import FormGroup from 'reactstrap/lib/FormGroup';
import Input from 'reactstrap/lib/Input';
import ModalFooter from 'reactstrap/lib/ModalFooter';

const log = Logger.create();

const Styles: IStyleMap = {
    label: {
        cursor: 'pointer',
        userSelect: 'none'
    }
};

export class Splash extends React.Component<IProps, IState> {

    private doNotShowAgain: boolean = false;

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
            open: true
        };

        this.onClose = this.onClose.bind(this);
        this.onLater = this.onLater.bind(this);
        this.onDoNotShowAgain = this.onDoNotShowAgain.bind(this);

    }

    public render() {

        const CloseButton = () => {

            if (this.props.disableClose) {
                return (<div/>);
            } else {
                return (<Button color="primary"
                                size="sm"
                                onClick={() => this.onClose()}>Close</Button>);
            }

        };

        const DontShowAgain = () => {

            if (this.props.disableDontShowAgain) {
                return (<div/>);
            } else {
                return (<FormGroup check>
                    <Label check style={Styles.label}>

                        <Input type="checkbox"
                               onChange={(event) => this.onDoNotShowAgain(!this.doNotShowAgain)}/>

                        Don't show again

                    </Label>
                </FormGroup>);
            }

        };

        return (

            <LargeModal isOpen={this.state.open}>

                <LargeModalBody>

                    {this.props.children}

                </LargeModalBody>

                <ModalFooter>

                    <DontShowAgain/>

                    {/*TODO: make later show up a week later...*/}
                    <Button color="secondary"
                            size="sm"
                            onClick={() => this.onLater()}>Later</Button>

                    <CloseButton/>

                </ModalFooter>

            </LargeModal>

        );

    }

    private onDoNotShowAgain(value: boolean) {
        this.doNotShowAgain = value;
    }

    private onLater() {

        // TODO migrate to Prefs.markDelayed

        const conditionalSetting
            = new ConditionalSetting(this.props.settingKey);

        const after = Date.now() + (24 * 60 * 60 * 1000);

        conditionalSetting.set(`${after}`);

        this.setState({open: false});

        document.location!.href = '#';

    }


    private onClose() {

        if (this.doNotShowAgain) {

            const conditionalSetting
                = new ConditionalSetting(this.props.settingKey);

            conditionalSetting.set('do-not-show-again');

        }

        this.setState({open: false});

    }

}

interface IProps {
    readonly settingKey: string;

    readonly disableDontShowAgain?: boolean;
    readonly disableClose?: boolean;
}

interface IState {
    readonly open: boolean;
}

