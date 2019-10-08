import * as React from 'react';
import {SimpleTooltip} from '../../ui/tooltip/SimpleTooltip';
import Button from 'reactstrap/lib/Button';
import {SimpleTooltipEx} from '../../ui/tooltip/SimpleTooltipEx';

export class AddContentButtonOverlay  extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        // TODO: Add RendererAnalytics for when this is loaded ... and added...

        return (

            <div className=""
                 style={{
                     position: 'fixed',
                     top: '70px',
                     right: '60px',
                     zIndex: 100
                 }}>

                <SimpleTooltipEx text="Add document to your Polar repository."
                                 style={{
                                     fontSize: '14px'
                                 }}
                                 show={0}
                                 placement="left" >

                    <Button id="add-content-overlay"
                            direction="down"
                            style={{
                                fontWeight: 'bold',
                                fontSize: '16px',
                                fontFamily: 'sans-serif'
                            }}
                            color="success"
                            className="btn-lg shadow"
                            onClick={() => this.props.onClick()}
                            size="lg">

                        <i className="fas fa-plus" style={{marginRight: '5px'}}></i> Add to Polar

                    </Button>

                </SimpleTooltipEx>

            </div>

        );

    }

}

interface IProps {
    onClick: () => void;
}

interface IState {
}
