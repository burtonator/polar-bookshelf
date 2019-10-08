import React from 'react';
import CreatableSelect from 'react-select/lib/Creatable';
import {ContactIDStr} from '../../datastore/sharing/db/Contacts';
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';
import {EmailAddresses} from '../../util/EmailAddresses';
import {UserRef} from '../../datastore/sharing/rpc/UserRefs';
import {ContactProfile} from './GroupSharingRecords';
import {ContactOptions} from './ContactOptions';
import {GroupNameStr} from "../../datastore/sharing/db/Groups";

/**
 * Allow the user to select from one or more of their contacts.
 */
export class GroupsSelector extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.onPaste = this.onPaste.bind(this);

        this.state = {
            selectedOptions: this.props.selectedOptions || []
        };

    }

    public render() {


        const options = [...this.props.options || []];
        const selectedOptions = [...this.state.selectedOptions];

        return <div onPaste={event => this.onPaste(event)}>

            <CreatableSelect
                isMulti
                isClearable
                // onKeyDown={event => this.onKeyDown(event)}
                // className="basic-multi-select"
                classNamePrefix="select"
                onChange={(selectedOptions) => this.handleChange(selectedOptions as ReadonlyArray<GroupOption>)}
                value={selectedOptions}
                defaultValue={selectedOptions}
                placeholder="Enter or select groups"
                options={options}>

            </CreatableSelect>

        </div>;

    }

    private onPaste(event: React.ClipboardEvent<HTMLDivElement>) {

        event.preventDefault();

        const text = event.clipboardData.getData('text/plain');

        const emailAddresses = EmailAddresses.parseList(text);

        const newContacts: GroupOption[] = emailAddresses.map(current => {

            return {
                value: current.address,
                label: EmailAddresses.format(current)
            };

        });

        this.setState({
            ...this.state,
            selectedOptions: [...this.state.selectedOptions, ...newContacts]
        });

    }

    private handleChange(selectedOptions: ReadonlyArray<GroupOption>) {
        this.setState({...this.state, selectedOptions});

        const onChange = this.props.onChange || NULL_FUNCTION;

        onChange(selectedOptions.map(current => current.value));

    }

}

interface IProps {
    readonly options?: ReadonlyArray<GroupOption>;
    readonly selectedOptions?: ReadonlyArray<GroupOption>;
    readonly onChange?: (groupSelections: ReadonlyArray<GroupNameStr>) => void;
}

interface IState {
    readonly selectedOptions: ReadonlyArray<GroupOption>;
}

export interface GroupOption {
    readonly value: GroupNameStr;
    readonly label: string;
}

