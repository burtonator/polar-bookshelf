import React from 'react';

export class LoginRequired extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

    }

    public render() {
        return <div className="text-md">

            <p>
                Please login to <b>cloud sync</b> to use document sharing.
            </p>

        </div>;

    }

}

interface IProps {
}

interface IState {
}
