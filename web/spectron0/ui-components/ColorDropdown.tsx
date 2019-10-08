import * as React from 'react';
import {Button} from 'reactstrap';
import {PopoverBody} from 'reactstrap';
import {Popover} from 'reactstrap';
import {UncontrolledPopover} from 'reactstrap';
// import {TwitterPicker} from 'react-color';
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';


interface ColorButtonProps extends IProps {
    readonly color: string;
    readonly size?: string;
    readonly id?: string;
}

const Spacer = () => {
    return <div style={{width: '10px'}} className="ml-2"/>;
};

const ColorButton = (props: ColorButtonProps) => {

    const createBackgroundColor = () => {

        switch (props.color) {

            case 'yellow':
                return 'rgba(255,255,0)';
            case 'red':
                return 'rgba(255,0,0)';
            case 'green':
                return 'rgba(0,255,0)';
            default:
                return props.color;
        }

    };

    const backgroundColor = createBackgroundColor();

    const onSelected = props.onSelected || NULL_FUNCTION;

    const size = props.size || '30px';

    return <Button size="lg"
                   id={props.id}
                   type="button"
                   className="ml-1 mr-1 p-0"
                   title=""
                   aria-label=""
                   color="light"
                   onClick={() => onSelected(props.color)}
                   style={{
                       display: 'inline-block',
                       backgroundColor,
                       border: '1pt solid rgba(0, 0, 0, 0.1)',
                       width: size,
                       height: size
                   }}>

    </Button>;

};


interface ColorExampleProps {
    readonly color: string;
}

const ColorExample = (props: ColorExampleProps) => {

    return <div style={{
                    margin: '5px'
                }}>


        <div style={{position: 'relative', top: 0}}>

            this is some example text

            <div style={{position: 'absolute',
                         top: 0, backgroundColor: props.color,
                         opacity: 1.0,
                         width: '200px',
                         mixBlendMode: 'multiply',
                         height: '1.4em'}}/>

        </div>

    </div>;

};


const ColorExamples = () => {

    return <div style={{display: 'flex'}}>

        <ColorExample color="#FF6900"/>
        <ColorExample color="#FCB900"/>
        <ColorExample color="#7BDCB5"/>

    </div>;

};

interface ColorButtonsRowProps extends IProps {
    readonly colors: ReadonlyArray<string>;
}

const ColorButtonsRow = (props: ColorButtonsRowProps) => {

    return <div>
        {props.colors.map(color =>
               <ColorButton {...props} color={color}/>)}
    </div>;

};

const ColorButtonsRow0 = (props: IProps) => {


    // 3x colors added...
    // const colors = ['#FF6900', '#FCB900', '#7BDCB5', '#00D084', '#8ED1FC', '#0693E3', '#ABB8C3', '#EB144C', '#F78DA7', '#9900EF'];
    const colors = ['#FFFF00', '#F96676', '#8DFF76', '#00D084', '#8ED1FC', '#0693E3'];

    return <ColorButtonsRow {...props} colors={colors}/>;

};

const ColorButtonsRow1 = (props: IProps) => {

    const colors = [ '#EB144C', '#F78DA7', '#9900EF', '#FF6900', '#FCB900', '#7BDCB5'];

    return <ColorButtonsRow {...props} colors={colors}/>;

};


const ColorButtons = (props: IProps) => {

    return <div className="pt-1 pb-1"
                style={{
                    // justifyContent: 'space-evenly'
                }}>
        {/*<ColorButton {...props} color={'yellow'}/>*/}
        {/*<ColorButton {...props} color={'red'}/>*/}
        {/*<ColorButton {...props} color={'green'}/>*/}
        <ColorButtonsRow0 {...props}/>

        <div className="mt-2">
            <ColorButtonsRow1 {...props}/>
        </div>

    </div>;

};

export class ColorDropdown extends React.Component<IProps, IState> {

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

                <br/>

                <ColorButtons {...props}/>


                {/*<Button id="Popover1" type="button">*/}
                {/*    Launch Popover*/}
                {/*</Button>*/}

                {/*<Popover placement="bottom"*/}
                {/*         isOpen={this.state.open}*/}
                {/*         target="Popover1"*/}

                {/*         toggle={this.toggle}>*/}

                {/*    <PopoverBody className="shadow rounded p-2"*/}
                {/*                 style={{backgroundColor: '#ffffff'}}>*/}

                {/*        <ColorButtons {...this.props}/>*/}

                {/*    </PopoverBody>*/}

                {/*</Popover>*/}


                <ColorButton color="yellow" id="ColorButton1" onSelected={() => this.activate()}/>

                <Popover placement="bottom"
                         trigger="legacy"
                         fade={false}
                         delay={0}
                         isOpen={this.state.open}
                         target="ColorButton1"
                         toggle={this.deactivate}>

                    <PopoverBody className="shadow rounded p-2"
                                 style={{backgroundColor: '#ffffff'}}>

                        <ColorButtons {...props}
                                      onSelected={(color) => {
                                        this.deactivate();
                                        onSelected(color);
                                      }}/>

                    </PopoverBody>

                </Popover>

                <div style={{}}>
                    this is some example text that would be highlighted
                </div>

                <Button id="Popover2" type="button">
                    Launch Popover
                </Button>

                <ColorExamples/>

                <UncontrolledPopover placement="bottom"
                                     trigger="legacy"
                                     delay={0}
                                     hideArrow
                                     className="border-0"
                                     target="Popover2">

                    <PopoverBody>

                        {/*<ColorButton {...props} color={'yellow'}/>*/}
                        {/*<ColorButton {...props} color={'red'}/>*/}
                        {/*<ColorButton {...props} color={'green'}/>*/}

                        {/*<TwitterPicker triangle='hide'/>*/}

                    </PopoverBody>

                </UncontrolledPopover>

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


