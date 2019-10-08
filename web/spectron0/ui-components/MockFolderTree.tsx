import * as React from 'react';
import {TagTree} from '../../js/ui/tree/TagTree';
import {Tags, TagStr} from '../../js/tags/Tags';
import {TagDescriptor} from '../../js/tags/TagNode';

export class MockFolderTree extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);


        const tags = [
            '/CompSci/Google',
            '/CompSci/Linux',
            '/CompSci/Microsoft',
            '/CompSci/Programming Languages/C++',
            '/CompSci/Programming Languages/Java',
            '/History/WWII',
            '/History/United States/WWII',
        ].map(current => Tags.create(current))
            .map(current => {
                const count = Math.floor(Math.random() * 100);
                return {...current, count};
            });


        this.state = {
            tags, selected: []
        };

    }

    public render() {

        const props = this.props;

        return (

            <div>

                {/*<TagTree tags={this.state.tags}*/}
                {/*         selected={this.state.selected}*/}
                {/*         onSelected={(values) => console.log("selected: ", values)}/>*/}

            </div>

        );

    }

}

interface IProps {

}

interface IState {
    readonly tags: ReadonlyArray<TagDescriptor>;
    readonly selected: ReadonlyArray<TagStr>;
}


