import * as React from 'react';
import Button from 'reactstrap/lib/Button';
import {RendererAnalytics} from '../../ga/RendererAnalytics';
import {LeftRightSplit} from '../left_right_split/LeftRightSplit';
import {Nav} from './Nav';
import {SURVEY_LINK} from '../../../../apps/repository/js/splash/splashes/survey/Survey';

export class MessageBox extends React.Component<IProps, IState> {

    constructor(props: any, context: any) {
        super(props, context);

        this.state = {
        };

    }

    public render() {

        const width = this.props.width || 600;

        const position = this.props.position || 'bottom';

        const style: React.CSSProperties = {
            position: 'fixed',
            width: '100%'
        };

        switch (position) {
            case "bottom":
                style.bottom = '25px';
                break;
            case "top":
                style.top = '25px';
                break;
        }

        return <div style={style}>

            <div style={{
                     width:  width + 'px',
                     zIndex: 99999,
                     marginLeft: 'auto',
                     marginRight: 'auto',
                     backgroundColor: 'var(--white)'
                 }}
                 className="border rounded shadow bg-white p-3">

                {this.props.children}

            </div>

        </div>;

    }

}

interface IProps {
    readonly width?: number;
    readonly position?: 'bottom' | 'top';
}

interface IState {

}
