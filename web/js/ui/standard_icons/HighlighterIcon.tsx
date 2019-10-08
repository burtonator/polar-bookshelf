import * as React from 'react';
import {HighlightColor} from "polar-shared/src/metadata/IBaseHighlight";

/**
 */
export class HighlighterIcon extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {
        const {  } = this.props;

        const rgbaColor = 'rgba(255,255,0)';

        return (

            <span className="fas fa-highlighter text-secondary"
                  aria-hidden="true"/>

        );
    }


}

interface IProps {
    color: HighlightColor;
}

interface IState {
}
