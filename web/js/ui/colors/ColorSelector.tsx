import * as React from 'react';
import {PopoverBody} from 'reactstrap';
import {Popover} from 'reactstrap';
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';
import {ColorButton} from './ColorButton';
import {RGBColor} from './ColorButton';
import {ColorSelectorBox} from './ColorSelectorBox';
import {IDs} from '../../util/IDs';

export class ColorSelector extends React.PureComponent<IProps, IState> {

    private id: string;

    constructor(props: IProps, context: any) {
        super(props, context);

        this.deactivate = this.deactivate.bind(this);

        this.state = {
            open: false
        };

        this.id = IDs.create('color-button');

    }

    private deactivate() {

        this.setState({
            open: false
        });
    }

    private activate() {

        this.setState({
            open: true
        });

    }

    public render() {

        const {id, props} = this;

        const onSelected = props.onSelected || NULL_FUNCTION;

        return (

            <div className={this.props.className || ''}
                 style={this.props.style}>

                <ColorButton color={this.props.color}
                             size={this.props.size}
                             id={id}
                             onSelected={() => this.activate()}/>

                <Popover placement="bottom"
                         trigger="legacy"
                         fade={false}
                         delay={0}
                         isOpen={this.state.open}
                         target={id}
                         toggle={this.deactivate}>

                    <PopoverBody className="shadow rounded p-2"
                                 style={{backgroundColor: '#ffffff'}}>

                        <ColorSelectorBox onSelected={(color) => {
                                              this.deactivate();
                                              onSelected(color);
                                          }}/>

                    </PopoverBody>

                </Popover>

            </div>
        );

    }

}

interface IProps {

    readonly className?: string;

    readonly style?: React.CSSProperties;

    readonly size?: string;

    /**
     * The current color
     */
    readonly color: RGBColor;

    readonly onSelected?: (color: string) => void;

}

interface IState {
    readonly open: boolean;
}
