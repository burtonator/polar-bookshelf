import * as React from 'react';
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';
import {ColorButton} from './ColorButton';

interface ColorButtonsRowProps extends IProps {
    readonly colors: ReadonlyArray<string>;
}

const ColorButtonsRow = (props: ColorButtonsRowProps) => {

    return <div>
        {props.colors.map(color =>
          <ColorButton key={color} {...props} color={color}/>)}
    </div>;

};

const ColorButtonsRow0 = (props: IProps) => {

    const colors = ['yellow', 'red', 'green', '#FFFF00', '#F96676'];

    return <ColorButtonsRow {...props} colors={colors}/>;

};

const ColorButtonsRow1 = (props: IProps) => {

    const colors = ['#8DFF76', '#00D084', '#8ED1FC', '#0693E3', '#EB144C'];

    return <ColorButtonsRow {...props} colors={colors}/>;

};

const ColorButtonsRow2 = (props: IProps) => {

    const colors = ['#F78DA7', '#9900EF', '#FF6900', '#FCB900', '#7BDCB5'];

    return <ColorButtonsRow {...props} colors={colors}/>;

};

const ColorButtons = (props: IProps) => {

    return <div className="pt-1 pb-1"
                style={{
                }}>

        <ColorButtonsRow0 {...props}/>

        <div className="mt-2">
            <ColorButtonsRow1 {...props}/>
        </div>

        <div className="mt-2">
            <ColorButtonsRow2 {...props}/>
        </div>

    </div>;

};

export class ColorSelectorBox extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.deactivate = this.deactivate.bind(this);

        this.state = {
            open: false
        };

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

        const props = this.props;

        const onSelected = props.onSelected || NULL_FUNCTION;

        return (
            <div>

                <ColorButtons {...props}/>

            </div>
        );

    }
}


interface IProps {
    readonly onSelected?: (color: string) => void;
}

interface IState {
    readonly open: boolean;
}
