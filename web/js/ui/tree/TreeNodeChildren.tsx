import * as React from 'react';
import {TreeNode} from './TreeNode';
import {TNode} from './TreeView';
import {TreeState} from './TreeView';

class Styles {

    public static NODE_CHILDREN: React.CSSProperties = {
        display: 'block',
        paddingLeft: '10px',
        marginLeft: '10px',
        borderLeft: '1px solid #c6c6c6'
    };

}


export class TreeNodeChildren<V> extends React.Component<IProps<V>, IState> {

    constructor(props: IProps<V>, context: any) {
        super(props, context);

    }

    public render() {

        let idx = 0;
        const children = this.props.children || [];

        if (this.props.closed) {
            return <div/>;
        } else {
            return <div style={Styles.NODE_CHILDREN}>
                        {children.map(child =>
                            <TreeNode key={idx++}
                                      node={child}
                                      treeState={this.props.treeState} />)}
            </div>;
        }

    }

}

interface IProps<V> {
    readonly closed?: boolean;
    readonly children?: ReadonlyArray<TNode<V>>;
    readonly treeState: TreeState<V>;
}


interface IState {
}


