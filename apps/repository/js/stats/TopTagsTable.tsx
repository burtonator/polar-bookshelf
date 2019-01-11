import * as React from 'react';
import {Logger} from '../../../../web/js/logger/Logger';
import {Statistics} from '../../../../web/js/metadata/Statistics';
import {IDocInfo} from '../../../../web/js/metadata/DocInfo';
import {ResponsivePie} from '@nivo/pie';
import StatTitle from './StatTitle';
import {Table} from 'reactstrap';

const log = Logger.create();

export default class TopTagsTable extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
        };

    }

    public render() {

        const topTags = Statistics.computeTopTags(this.props.docInfos, 20);

        return <div>
            <StatTitle>Top Tags</StatTitle>
            <Table>
            {topTags.map(topTag =>
                 <tr key={topTag.key}>
                     <td className="pt-1 pb-1">{topTag.key}</td>
                     <td className="pt-1 pb-1">{topTag.value}</td>
                 </tr>)}
            </Table>
        </div>;
    }

}

export interface IProps {
    readonly docInfos: ReadonlyArray<IDocInfo>;
}

export interface IState {

}
