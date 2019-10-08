import * as React from 'react';
import {Tags} from '../../js/tags/Tags';
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {Group} from "../../js/datastore/sharing/db/Groups";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {ManualDropdown} from "../../../apps/repository/js/doc_repo/ManaulDropdown";
import DropdownItem from 'reactstrap/lib/DropdownItem';
import {DropdownMenu, DropdownToggle} from "reactstrap";
import {FakePopup} from "./FakePopup";
import { BasicPopup } from './BasicPopup';
import { PDFViewer } from './PDFViewer';

const styles = {
    swatch: {
        width: '30px',
        height: '30px',
        float: 'left',
        borderRadius: '4px',
        margin: '0 6px 6px 0',
    }
};

const Folders = () => {
    return <div style={{backgroundColor: 'red', overflow: 'auto'}}>
        these are the folders
    </div>;
};

const Preview = () => {
    return <div style={{backgroundColor: 'orange', overflow: 'auto'}}>
        This is the preview
    </div>;
};


const Main = () => {
    return <div style={{backgroundColor: 'blue'}}>this is the right</div>;
};

export class App<P> extends React.Component<{}, IAppState> {

    constructor(props: P, context: any) {
        super(props, context);

    }

    public render() {


        //
        // const root: TNode<TagNode> = {
        //     id: 0,
        //     name: 'CompSci',
        //     children: [
        //         {
        //             id: 1,
        //             name: 'Linux',
        //             children: [],
        //             value: {
        //                 tag: "/CompSci/Linux"
        //             }
        //         },
        //         {
        //             id: 2,
        //             name: 'Google',
        //             children: [
        //                 {
        //                     id: 3,
        //                     name: 'Mountain View',
        //                     children: [],
        //                     value: {
        //                         tag: "/CompSci/Google/Mountain View"
        //                     }
        //                 },
        //                 {
        //                     id: 4,
        //                     name: 'San Francisco',
        //                     children: [],
        //                     value: {
        //                         tag: "/CompSci/Google/San Francisco"
        //                     }
        //                 },
        //             ],
        //             value: {
        //                 tag: "/CompSci/Google"
        //             }
        //
        //         }
        //
        //     ],
        //     value: {
        //         tag: "/CompSci"
        //     }
        // };

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

        // // const root: TNode<Tag> = TagNodes.create(...tags);
        // Dialogs.prompt({
        //                    title: "Enter the name of a new folder:",
        //                    validator: () => {
        //                        return {message: "it failed dude"};
        //                    },
        //                    onCancel: NULL_FUNCTION,
        //                    onDone: NULL_FUNCTION
        //
        //                });

        const group: Group = {
            nrMembers: 100,
            name: 'Linux',
            description: "A group about Linux, Ubuntu, Debian, and UNIX operating systems.",
            id: "101",
            visibility: 'public',
            created: ISODateTimeStrings.create()
        };

        return (

            <div style={{margin: '5px'}}>

                <PDFViewer src="foo"/>

                    {/*<LoadingProgress/>*/}

                {/*<MockFolderTree/>*/}

                {/*<AccountUpgradeBarView plan='free' accountUsage={{storageInBytes: 0}}/>*/}

                {/*<div>*/}

                {/*    /!*<LargeModal isOpen={true}*!/*/}
                {/*    /!*            centered={true}*!/*/}
                {/*    /!*            minWidth="20%">*!/*/}

                {/*    /!*    <LargeModalBody>*!/*/}

                {/*    /!*        this is some modal content.*!/*/}

                {/*    /!*        <GroupSearch/>*!/*/}

                {/*    /!*        <GroupHits>*!/*/}
                {/*    /!*            <GroupHit name="Linux" description="A group about Linux" nrMembers={10} onAdd={NULL_FUNCTION}/>*!/*/}
                {/*    /!*            <GroupHit name="Microsoft" description="A group about Microsoft" nrMembers={5} onAdd={NULL_FUNCTION}/>*!/*/}
                {/*    /!*        </GroupHits>*!/*/}

                {/*    /!*    </LargeModalBody>*!/*/}

                {/*    /!*    /!*<ModalFooter>*!/*!/*/}
                {/*    /!*    /!*    <Button color="primary" onClick={() => this.onDone()}>Close</Button>*!/*!/*/}
                {/*    /!*    /!*</ModalFooter>*!/*!/*/}


                {/*    /!*</LargeModal>*!/*/}


                {/*    <GroupCard group={group}/>*/}

                {/*</div>*/}

                {/*<TreeView root={root}*/}
                {/*          />*/}

                {/*<Dock side="left"*/}
                {/*      left={<Folders/>}*/}
                {/*      right={<Dock side="left"*/}
                {/*                   left={<Preview/>}*/}
                {/*                   right={<Main/>}/>}/>*/}


            </div>

        );
    }


}

interface IAppState {

}


