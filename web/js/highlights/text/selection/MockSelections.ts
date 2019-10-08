import {NodeTypes} from './NodeTypes';

export class MockSelections {

    /**
     *
     */
    public static createSyntheticSelection(start: NodeOffset, end: NodeOffset) {

        const selection = window.getSelection()!;

        selection.empty();

        const range = document.createRange();

        range.setStart(start.node, start.offset);

        console.log("end.node type is: " + NodeTypes.toSymbol(end.node.nodeType))

        range.setEnd(end.node, end.offset);

        selection.addRange(range);

        return selection;

    }

}

export interface NodeOffset {

    node: Node;
    offset: number;

}
