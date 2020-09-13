import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import {DocRepoTableToolbar} from './DocRepoTableToolbar';
import {DocRepoTableHead} from "./DocRepoTableHead";
import {MUIDocContextMenu} from "./MUIDocContextMenu";
import {DocRepoTableRow} from "./DocRepoTableRow";
import {useDocRepoStore} from "./DocRepoStore2";
import {deepMemo} from "../../../../web/js/react/ReactUtils";

export const DocRepoTable2 = deepMemo(() => {

    const {page, rowsPerPage, viewPage, view, selected}
        = useDocRepoStore(['page', 'rowsPerPage', 'view', 'viewPage', 'selected']);

    return (
        <div style={{
                width: '100%',
                height: '100%'
             }}>

            {/*TODO: changing this to paper implements the proper Figma color we */}
            {/*want*/}
            <Paper square
                   elevation={0}
                   style={{
                       width: '100%',
                       height: '100%',
                       display: 'flex',
                       flexDirection: 'column'
                   }}>
                        <MUIDocContextMenu render={rawContextMenuHandler => {

                        return (
                            <>
                                <DocRepoTableToolbar />

                                <TableContainer style={{flexGrow: 1}}>
                                    <Table
                                        stickyHeader
                                        style={{
                                            minWidth: 0,
                                            maxWidth: '100%',
                                            tableLayout: 'fixed'
                                        }}
                                        aria-labelledby="tableTitle"
                                        size={'medium'}
                                        aria-label="enhanced table">

                                        <DocRepoTableHead/>

                                        <TableBody>
                                            {viewPage
                                                .map((row, index) => {

                                                    const viewIndex = (page * rowsPerPage) + index;

                                                    return (
                                                        <DocRepoTableRow
                                                            viewIndex={viewIndex}
                                                            key={viewIndex}
                                                            rawContextMenuHandler={rawContextMenuHandler}
                                                            selected={selected.includes(row.id)}
                                                            row={row}
                                                        />
                                                    );
                                                })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </>);
                        }}/>

            </Paper>
        </div>
    )

});
