import * as React from 'react';
import Button from 'reactstrap/lib/Button';
import {Nav} from '../util/Nav';
import {CrowdfundingProgress} from './CrowdfundingProgress';

export class CrowdfundingCampaign extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (

            <div>

                <div className="mb-1 rounded p-2 text-justify"
                     style={{backgroundColor: '#F3CF32', fontWeight: 'bold'}}>

                    <h2 className="text-center">Help Keep Polar Open Source</h2>

                        {/*<i className="fas fa-info-circle" style={{color: 'blue', backgroundColor: 'white'}}></i>*/}
                        Polar needs your help to remain Open Source.
                        We're launching a crowdfunding campaign to keep Polar
                        Open Source and continue funding development for the
                        next six months.

                        Our core user base is large enough that we should be
                        able to raise enough money to continue funding Polar
                        development.


                    <div className="text-center mt-2 mb-1">

                        <div className="ml-auto mr-auto" style={{maxWidth: '450px'}}>
                            <CrowdfundingProgress/>
                        </div>

                    </div>

                    <div className="text-center p-2">

                        <Button color="secondary"
                                size="md"
                                onClick={() => Nav.openLinkWithNewTab("https://getpolarized.io/2019/04/11/Polar-Initial-Crowdfunding-Campaign.html")}
                                style={{fontWeight: 'bold'}}>More Info</Button>

                        <Button className="ml-2"
                                color="success"
                                size="md"
                                onClick={() => Nav.openLinkWithNewTab("https://opencollective.com/polar-bookshelf")}
                                style={{fontWeight: 'bold'}}>Donate Now</Button>

                    </div>

                    <div className="mb-2">

                        <div className="text-center"
                             style={{
                             }}>

                            <iframe width="560" height="315"
                                    src="https://www.youtube.com/embed/wfxmsXxod-g"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen></iframe>
                        </div>

                    </div>


                </div>


                {/*<div className="mb-2">*/}

                    {/*<progress className="w-100" value={0.5}/>*/}

                {/*</div>*/}

                {/*<div>*/}

                    {/*<LeftRightSplit*/}
                        {/*left={<div>*/}
                            {/*I'm donated directly.*/}
                        {/*</div>}*/}
                        {/*right={<ToggleButton label="" onChange={NULL_FUNCTION}/>}/>*/}

                    {/*<LeftRightSplit className="mt-1"*/}
                        {/*left={<div>*/}
                            {/*<b>I'm a monthly subscriber.</b>*/}

                            {/*<p>*/}
                                {/*Monthly subscribers... blah blah blah.*/}
                            {/*</p>*/}
                        {/*</div>}*/}
                        {/*right={*/}
                            {/*<UncontrolledDropdown size="sm">*/}
                                {/*<DropdownToggle caret>*/}
                                    {/*Select*/}
                                {/*</DropdownToggle>*/}
                                {/*<DropdownMenu right className="shadow">*/}
                                    {/*<DropdownItem>I'm a monthly subscriber</DropdownItem>*/}
                                {/*</DropdownMenu>*/}
                            {/*</UncontrolledDropdown>*/}

                        {/*}/>*/}


                {/*</div>*/}

            </div>
        );

    }

}


interface IProps {
}

interface IState {

    readonly progress: number;

}


