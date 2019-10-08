import * as React from 'react';
import {IStyleMap} from '../../../../web/js/react/IStyleMap';
import {Link} from "react-router-dom";

const Styles: IStyleMap = {
    parent: {
        display: 'inline-block'
    },

    child: {
        display: 'inline-block',
        verticalAlign: 'middle',
        userSelect: 'none'
    },

    textLogo: {
        paddingLeft: '5px',
        fontWeight: 'bold',
        fontSize: '20px',
        userSelect: 'none',
        textDecoration: 'none'
    }

};

/**
 */
export class NavLogo extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (
            <div style={Styles.parent}>
                <div style={Styles.child}>
                    <Link to={{pathname: '/', hash: '#'}}>
                        <img src="/apps/repository/img/icon.svg" height="25" alt="Polar"/>
                    </Link>
                </div>

                <div style={Styles.child}>
                    <div className="d-none-mobile" style={Styles.textLogo}>POLAR</div>
                </div>
            </div>
        );

    }

}

interface IProps {

}

interface IState {

}
