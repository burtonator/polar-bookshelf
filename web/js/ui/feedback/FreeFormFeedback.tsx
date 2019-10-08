import * as React from 'react';
import Button from 'reactstrap/lib/Button';
import Input from 'reactstrap/lib/Input';
import {Rating} from './Feedback';
import {ISODateTimeStrings} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {UserFeedbacks} from '../../telemetry/UserFeedback';
import {MachineIDs} from '../../util/MachineIDs';

/**
 * @Deprecated this is duplicated with Suggestions.  Remove.
 */
export class FreeFormFeedback extends React.Component<IProps, IState> {

    private text: string = "";

    constructor(props: any, context: any) {
        super(props, context);

        this.onSendFeedback = this.onSendFeedback.bind(this);

        this.state = {
            completed: false
        };

    }

    public render() {

        return <div className="">

            <div>
                Thanks! How could we make Polar even better? We
                read <b>all</b> user
                feedback and your suggestions are very
                important to the future of Polar!
            </div>

            <Input type="textarea"
                   name="text"
                   onChange={value => this.text = value.target.value || ""}
                   style={{
                       width: '100%',
                       height: '100%'
                   }}/>

            <Button color="primary" onClick={() => this.onSendFeedback()}>Send Feedback</Button>

        </div>;

    }

    private onSendFeedback() {

        // UserFeedbacks.write({
        //     netPromoterScore: this.props.rating,
        //     text: this.text,
        //     created: ISODateTimeStrings.create(),
        //     machine: MachineIDs.get()
        // }).catch(err => console.error("got error: ", err));

    }

}

export interface IProps {
    readonly rating: Rating;
}

export interface IState {
}
