import * as React from 'react';
import Dropdown, {DropdownButton, DropdownMenu, DropdownMenuWrapper, DropdownToggle, MenuItem} from '@burtonator/react-dropdown';
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';
import Button from 'reactstrap/lib/Button';
import {RendererAnalytics} from '../../ga/RendererAnalytics';
import {NullCollapse} from '../null_collapse/NullCollapse';
import {SplitLayout} from '../split_layout/SplitLayout';
import {SplitBarLeft} from '../../../../apps/repository/js/SplitBarLeft';
import {SplitLayoutLeft} from '../split_layout/SplitLayout';
import {SplitLayoutRight} from '../split_layout/SplitLayoutRight';

export class FeatureIntro extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onDone = this.onDone.bind(this);

        this.state = {
            active: this.isActive()
        };

    }

    public render() {

        return <NullCollapse open={this.state.active}>

            <div className="border rounded text-muted mt-1 mb-1"
                 style={{backgroundColor: 'lightyellow', fontSize: 'smaller'}}>

                <SplitLayout>

                    <SplitLayoutLeft>
                        <div className="p-1">
                            <span className="text-muted text-xs"
                                  onClick={() => this.onDone()}
                                  style={{float: 'right', fontSize: '15px', cursor: 'pointer'}}>
                                <i className="fas fa-times-circle"></i>
                            </span>

                            {this.props.children}

                        </div>
                    </SplitLayoutLeft>

                    {/*<SplitLayoutRight verticalAlign='middle'>*/}
                        {/*<div className="p-1 text-right">*/}

                            {/*<Button size="sm"*/}
                                    {/*className="p-1 pl-2 pr-2"*/}
                                    {/*fontSize={{fontSize: 'smaller'}}*/}
                                    {/*onClick={() => this.onDone()}>OK</Button>*/}

                        {/*</div>*/}

                    {/*</SplitLayoutRight>*/}

                </SplitLayout>



            </div>

        </NullCollapse>;

    }

    private onDone() {

        this.setState({active: false});

        this.mark();

    }

    private isActive() {
        return localStorage.getItem(this.props.itemName) !== 'inactive';
    }

    private mark() {
        localStorage.setItem(this.props.itemName, 'inactive');
    }

}

export interface IProps {

    readonly itemName: string;

}

export interface IState {
    readonly active: boolean;
}
