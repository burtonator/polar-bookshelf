/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {IStyleMap} from '../../react/IStyleMap';

const Styles: IStyleMap = {

    // TODO: this is used in other parts of the code so try to clean it up
    // and remove all references
    dropdownChevron: {

        display: 'inline-block',
        width: 0,
        height: 0,
        marginLeft: '.255em',
        verticalAlign: '.255em',
        borderTop: '.3em solid',
        borderRight: '.3em solid transparent',
        borderBottom: 0,
        borderLeft: '.3em solid transparent',
        // color: 'var(--secondary)'

    }

};

export class DropdownChevron extends React.PureComponent<IProps, IState> {

    constructor(props: IProps) {
        super(props);


    }

    public render() {

        return (

            <div style={Styles.dropdownChevron}></div>

        );

    }

}

interface IProps {

}

interface IState {
}
