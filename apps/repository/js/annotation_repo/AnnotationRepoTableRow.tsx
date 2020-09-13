import * as React from "react";
import TableCell from "@material-ui/core/TableCell";
import Box from "@material-ui/core/Box";
import {AnnotationPreview} from "./AnnotationPreview";
import TableRow from "@material-ui/core/TableRow";
import {IDocAnnotation} from "../../../../web/js/annotation_sidebar/DocAnnotation";
import {useAnnotationRepoCallbacks} from "./AnnotationRepoStore";
import {IMouseEvent, useContextMenu} from "../doc_repo/MUIContextMenu";
import isEqual from "react-fast-compare";

interface IProps {
    readonly viewIndex: number;
    readonly rowSelected: boolean;
    readonly annotation: IDocAnnotation;
}

export const AnnotationRepoTableRow = React.memo(React.forwardRef((props: IProps, ref) => {
    const {viewIndex, annotation, rowSelected} = props;

    const callbacks = useAnnotationRepoCallbacks();
    const {onDragStart, onDragEnd, setPage, setRowsPerPage} = callbacks;

    const onClick = React.useCallback((event: React.MouseEvent) => {
        callbacks.selectRow(annotation.id, event, 'click');
    }, [callbacks]);

    const onContextMenu = React.useCallback((event: IMouseEvent) => {
        callbacks.selectRow(annotation.id, event, 'context');
    }, [callbacks]);

    const contextMenu = useContextMenu({onContextMenu});

    return (
        <TableRow {...contextMenu}
                  key={viewIndex}
                  hover
                  role="checkbox"
                  onClick={onClick}
                  draggable
                  onDragStart={onDragStart}
                  onDragEnd={onDragEnd}
                  selected={rowSelected}>

            <TableCell padding="checkbox">
                <AnnotationPreview id={annotation.id}
                                   text={annotation.text}
                                   img={annotation.img}
                                   color={annotation.color}
                                   lastUpdated={annotation.lastUpdated}
                                   created={annotation.created}/>
            </TableCell>
        </TableRow>
    );
}), isEqual);
