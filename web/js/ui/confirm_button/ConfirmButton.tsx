import React from 'react';

/**
 * Allow the user to select from one or more of their contacts.
 */
export class ConfirmButton extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

    }

    public render() {

        // TODO: this was the start of a button that would change states to a 'confirm' delete but:

        // 1. what if I hit the button twice in the same spot?
        //
        // 2. there is now way to cancel once I enter the second confirm and
        // I would have to replace it with TWO buttons.

        return <div style={{display: 'flex'}}>


        </div>;

    }

}

interface IProps {
    readonly transitions?: Transitions;
}

interface IState {
    readonly current: TransitionID;
}

export type TransitionID = 'initial' | 'confirm' | 'pending';

export interface Transitions {

    readonly initial: Transition;
    readonly confirm: Transition;
    readonly pending: Transition;

}

export interface Transition {
    readonly element: JSX.Element;
    readonly color: 'light' | 'danger' | 'primary' | 'secondary' | 'success';
}

export class DefaultTransitions {

}
