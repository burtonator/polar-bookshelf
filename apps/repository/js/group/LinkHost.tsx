import * as React from 'react';
import {GroupDocInfo} from "../../../../web/js/datastore/sharing/GroupDocInfos";
import {NullCollapse} from "../../../../web/js/ui/null_collapse/NullCollapse";

export class LinkHost extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        const parseHost = () => {

            const {url} = this.props;

            if (! url) {
                return undefined;
            }

            const parsedURL = new URL(url);

            return parsedURL.host;

        };

        const host = parseHost();

        return (

            <div>
                <NullCollapse open={host !== undefined}>
                    <div className="mr-1">
                        {host}
                    </div>
                </NullCollapse>
            </div>

        );
    }

}

export interface IProps {
    readonly url?: string;

}

export interface IState {
}
