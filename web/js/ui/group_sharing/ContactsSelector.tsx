import React from 'react';
import CreatableSelect from 'react-select/lib/Creatable';
import {ContactIDStr} from '../../datastore/sharing/db/Contacts';
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';
import {EmailAddresses} from '../../util/EmailAddresses';
import {UserRef} from '../../datastore/sharing/rpc/UserRefs';
import {ContactProfile} from './GroupSharingRecords';
import {ContactOptions} from './ContactOptions';

/**
 * Allow the user to select from one or more of their contacts.
 */
export class ContactsSelector extends React.Component<IProps, IState> {

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
                autoFocus
                // onKeyDown={event => this.onKeyDown(event)}
                // className="basic-multi-select"
                classNamePrefix="select"
                onChange={(selectedOptions) => this.handleChange(selectedOptions as ReadonlyArray<ContactOption>)}
                value={selectedOptions}
                defaultValue={selectedOptions}
                placeholder="Enter names or email addresses"
                options={options}>

            </CreatableSelect>

        </div>;

    }

    private onPaste(event: React.ClipboardEvent<HTMLDivElement>) {

        event.preventDefault();

        const text = event.clipboardData.getData('text/plain');

        const emailAddresses = EmailAddresses.parseList(text);

        const newContacts: ContactOption[] = emailAddresses.map(current => {

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

    private handleChange(selectedOptions: ReadonlyArray<ContactOption>) {
        this.setState({...this.state, selectedOptions});

        const onChange = this.props.onChange || NULL_FUNCTION;

        onChange(ContactOptions.toUserRefs(selectedOptions));

    }

}

interface IProps {
    readonly options?: ReadonlyArray<ContactOption>;
    readonly selectedOptions?: ReadonlyArray<ContactOption>;
    readonly onChange?: (contactSelections: ReadonlyArray<UserRef>) => void;
}

interface IState {
    readonly selectedOptions: ReadonlyArray<ContactOption>;
}

export interface ContactOption {
    readonly value: ContactIDStr;
    readonly label: string;
}

