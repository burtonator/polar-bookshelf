import * as React from 'react';
import {FeatureIntro} from '../ui/feature_intro/FeatureIntro';

export class RichTextFeatureIntro extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

    }

    public render() {

        return <FeatureIntro itemName='rich-text-input'>

            <div className="text-xs p-1">
                Styling with rich text is supported including <b>bold</b> and <i>italics</i> but also images and copy and pasting
                to and from local applications.
            </div>

        </FeatureIntro>;

    }

}

export interface IProps {
}

export interface IState {
}
