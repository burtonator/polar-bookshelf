import React from 'react';
import {MemberRecord} from './GroupSharingRecords';

/**
 * Allow the user to select from one or more of their contacts.
 */
export class SharingDisclaimer extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

    }

    public render() {

        return <div className="text-grey700 text-sm mt-1">
            <p>
                Sharing a document grants full access to the document but you
                may revoke their permissions to view your annotations at any
                time.
            </p>

            <p>
                <b>Please only share documents for which you have a license and for which
                    the copyright license allows sharing.</b>
            </p>
        </div>;

    }


}

interface IProps {
}

interface IState {
}
