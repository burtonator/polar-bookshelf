import * as React from 'react';
import {Logger} from 'polar-shared/src/logger/Logger';
import {Statistics} from '../../../../web/js/metadata/Statistics';
import {IDocInfo} from 'polar-shared/src/metadata/IDocInfo';
import {ResponsivePie} from '@nivo/pie';
import StatTitle from './StatTitle';
import Table from 'reactstrap/lib/Table';

const log = Logger.create();

export default class TopTagsTable extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
        };

    }

    public render() {

        const topTags = Statistics.computeTopTags(this.props.docInfos, 20);

        return <div id="top-tags-table">
            <StatTitle>Top Tags</StatTitle>
            <Table>
                <tbody>
                    {topTags.map(topTag =>
                         <tr key={topTag.key}>
                             <td className="pt-1 pb-1">{topTag.key}</td>
                             <td className="pt-1 pb-1">{topTag.value}</td>
                         </tr>)}

                </tbody>
            </Table>
        </div>;
    }

}

export interface IProps {
    readonly docInfos: ReadonlyArray<IDocInfo>;
}

export interface IState {

}
