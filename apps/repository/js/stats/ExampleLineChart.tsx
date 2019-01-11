import * as React from 'react';
import {Logger} from '../../../../web/js/logger/Logger';
import {RepoSidebar} from '../RepoSidebar';
import {MessageBanner} from '../MessageBanner';
import {RepoDocMetaManager} from '../RepoDocMetaManager';
import {Statistics} from '../../../../web/js/metadata/Statistics';
import {DocInfo, IDocInfo} from '../../../../web/js/metadata/DocInfo';
import { ResponsiveBar } from '@nivo/bar';

const log = Logger.create();

export default class ExampleLineChart extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
        };

    }

    public render() {

        const data = [
            {
                "country": "AD",
                "hot dog": 163,
                "hot dogColor": "hsl(249, 70%, 50%)",
                "burger": 131,
                "burgerColor": "hsl(57, 70%, 50%)",
                "sandwich": 16,
                "sandwichColor": "hsl(244, 70%, 50%)",
                "kebab": 22,
                "kebabColor": "hsl(258, 70%, 50%)",
                "fries": 71,
                "friesColor": "hsl(354, 70%, 50%)",
                "donut": 146,
                "donutColor": "hsl(254, 70%, 50%)"
            },
            {
                "country": "AE",
                "hot dog": 0,
                "hot dogColor": "hsl(346, 70%, 50%)",
                "burger": 32,
                "burgerColor": "hsl(162, 70%, 50%)",
                "sandwich": 193,
                "sandwichColor": "hsl(314, 70%, 50%)",
                "kebab": 193,
                "kebabColor": "hsl(57, 70%, 50%)",
                "fries": 172,
                "friesColor": "hsl(52, 70%, 50%)",
                "donut": 1,
                "donutColor": "hsl(152, 70%, 50%)"
            },
            {
                "country": "AF",
                "hot dog": 53,
                "hot dogColor": "hsl(288, 70%, 50%)",
                "burger": 168,
                "burgerColor": "hsl(328, 70%, 50%)",
                "sandwich": 93,
                "sandwichColor": "hsl(317, 70%, 50%)",
                "kebab": 17,
                "kebabColor": "hsl(51, 70%, 50%)",
                "fries": 32,
                "friesColor": "hsl(338, 70%, 50%)",
                "donut": 176,
                "donutColor": "hsl(24, 70%, 50%)"
            },
            {
                "country": "AG",
                "hot dog": 196,
                "hot dogColor": "hsl(18, 70%, 50%)",
                "burger": 199,
                "burgerColor": "hsl(166, 70%, 50%)",
                "sandwich": 95,
                "sandwichColor": "hsl(94, 70%, 50%)",
                "kebab": 140,
                "kebabColor": "hsl(155, 70%, 50%)",
                "fries": 30,
                "friesColor": "hsl(167, 70%, 50%)",
                "donut": 51,
                "donutColor": "hsl(186, 70%, 50%)"
            },
            {
                "country": "AI",
                "hot dog": 153,
                "hot dogColor": "hsl(115, 70%, 50%)",
                "burger": 132,
                "burgerColor": "hsl(88, 70%, 50%)",
                "sandwich": 27,
                "sandwichColor": "hsl(331, 70%, 50%)",
                "kebab": 154,
                "kebabColor": "hsl(162, 70%, 50%)",
                "fries": 83,
                "friesColor": "hsl(222, 70%, 50%)",
                "donut": 163,
                "donutColor": "hsl(332, 70%, 50%)"
            },
            {
                "country": "AL",
                "hot dog": 43,
                "hot dogColor": "hsl(153, 70%, 50%)",
                "burger": 40,
                "burgerColor": "hsl(143, 70%, 50%)",
                "sandwich": 91,
                "sandwichColor": "hsl(162, 70%, 50%)",
                "kebab": 86,
                "kebabColor": "hsl(333, 70%, 50%)",
                "fries": 199,
                "friesColor": "hsl(290, 70%, 50%)",
                "donut": 142,
                "donutColor": "hsl(40, 70%, 50%)"
            },
            {
                "country": "AM",
                "hot dog": 172,
                "hot dogColor": "hsl(248, 70%, 50%)",
                "burger": 167,
                "burgerColor": "hsl(238, 70%, 50%)",
                "sandwich": 63,
                "sandwichColor": "hsl(126, 70%, 50%)",
                "kebab": 112,
                "kebabColor": "hsl(235, 70%, 50%)",
                "fries": 145,
                "friesColor": "hsl(51, 70%, 50%)",
                "donut": 72,
                "donutColor": "hsl(82, 70%, 50%)"
            }
        ];

        return (

            <div className="p-1" style={{height: '600px', width: '100%'}}>

                <ResponsiveBar
                    data={data}
                    keys={[
                        "hot dog",
                        "burger",
                        "sandwich",
                        "kebab",
                        "fries",
                        "donut"
                    ]}
                    indexBy="country"
                    margin={{
                        "top": 50,
                        "right": 130,
                        "bottom": 50,
                        "left": 60
                    }}
                    padding={0.3}
                    colors="nivo"
                    colorBy="id"
                    defs={[
                        {
                            "id": "dots",
                            "type": "patternDots",
                            "background": "inherit",
                            "color": "#38bcb2",
                            "size": 4,
                            "padding": 1,
                            "stagger": true
                        },
                        {
                            "id": "lines",
                            "type": "patternLines",
                            "background": "inherit",
                            "color": "#eed312",
                            "rotation": -45,
                            "lineWidth": 6,
                            "spacing": 10
                        }
                    ]}
                    fill={[
                        {
                            "match": {
                                "id": "fries"
                            },
                            "id": "dots"
                        },
                        {
                            "match": {
                                "id": "sandwich"
                            },
                            "id": "lines"
                        }
                    ]}
                    // borderColor="inherit:darker(1.6)"
                    // axisTop=null
                    // axisRight=null
                    // axisBottom={{
                    //     "tickSize": 5,
                    //     "tickPadding": 5,
                    //     "tickRotation": 0,
                    //     "legend": "country",
                    //     "legendPosition": "middle",
                    //     "legendOffset": 32
                    // }}
                    // axisLeft={{
                    //     "tickSize": 5,
                    //     "tickPadding": 5,
                    //     "tickRotation": 0,
                    //     "legend": "food",
                    //     "legendPosition": "middle",
                    //     "legendOffset": -40
                    // }}
                    labelSkipWidth={12}
                    labelSkipHeight={12}
                    labelTextColor="inherit:darker(1.6)"
                    animate={true}
                    motionStiffness={90}
                    motionDamping={15}
                    legends={[
                        {
                            "dataFrom": "keys",
                            "anchor": "bottom-right",
                            "direction": "column",
                            "justify": false,
                            "translateX": 120,
                            "translateY": 0,
                            "itemsSpacing": 2,
                            "itemWidth": 100,
                            "itemHeight": 20,
                            "itemDirection": "left-to-right",
                            "itemOpacity": 0.85,
                            "symbolSize": 20,
                            "effects": [
                                {
                                    "on": "hover",
                                    "style": {
                                        "itemOpacity": 1
                                    }
                                }
                            ]
                        }
                    ]}
                />

            </div>

        );
    }

}

export interface IProps {
}

export interface IState {

}


