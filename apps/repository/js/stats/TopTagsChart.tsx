import * as React from 'react';
import {Logger} from 'polar-shared/src/logger/Logger';
import {Statistics} from '../../../../web/js/metadata/Statistics';
import {IDocInfo} from 'polar-shared/src/metadata/IDocInfo';
import {ResponsivePie} from '@nivo/pie';
import StatTitle from './StatTitle';

const log = Logger.create();

export default class TopTagsChart extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
        };

    }

    public render() {

        const topTags = Statistics.computeTopTags(this.props.docInfos, 10);

        const data = topTags.map(current => {
            return {
                id: current.key,
                label: current.key,
                value: current.value
            };
        });

        return (

            <div id="top-tags-chart" className="p-1">

                <StatTitle>Top Tags</StatTitle>

                <div style={{height: '600px', width: '100%'}}>

                    <ResponsivePie
                        data={data}
                        margin={{
                            "top": 40,
                            "right": 80,
                            "bottom": 80,
                            "left": 80
                        }}
                        innerRadius={0.5}
                        padAngle={0.7}
                        cornerRadius={3}
                        colors="category10"
                        colorBy="id"
                        borderWidth={1}
                        borderColor="inherit:darker(0.2)"
                        radialLabelsSkipAngle={10}
                        radialLabelsTextXOffset={6}
                        radialLabelsTextColor="#333333"
                        radialLabelsLinkOffset={0}
                        radialLabelsLinkDiagonalLength={16}
                        radialLabelsLinkHorizontalLength={24}
                        radialLabelsLinkStrokeWidth={1}
                        radialLabelsLinkColor="inherit"
                        slicesLabelsSkipAngle={10}
                        slicesLabelsTextColor="#333333"
                        animate={true}
                        motionStiffness={90}
                        motionDamping={15}

                    />
                </div>
            </div>

        );
    }

}

export interface IProps {
    readonly docInfos: ReadonlyArray<IDocInfo>;
}

export interface IState {

}

