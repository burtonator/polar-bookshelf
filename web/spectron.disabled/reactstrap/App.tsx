import * as React from '@types/react';
import {SyncBar, SyncBarProgress} from '../../js/ui/sync_bar/SyncBar';
import {IEventDispatcher, SimpleReactor} from '../../js/reactor/SimpleReactor';
import {Logger} from 'polar-shared/src/logger/Logger';
import {LogEventViewer} from './LogEventViewer';

const log = Logger.create();

class App<P> extends React.Component<{}, IAppState> {

    constructor(props: P, context: any) {
        super(props, context);

        this.toggleDropDown = this.toggleDropDown.bind(this);
        this.toggleSplit = this.toggleSplit.bind(this);
        this.state = {
            dropdownOpen: false,
            splitButtonOpen: false
        };
    }

    public render() {
        //
        // const options: ListOptionType[] = [
        //     {
        //         id: "title",
        //         label: "Title",
        //         selected: true
        //     },
        //     {
        //         id: "tags",
        //         label: "Tags",
        //         selected: false
        //     }
        // ];

        const data: any[] = [
            {message: 'hello world'},
            {message: 'hello world 2'},
            {message: 'hello world 3'},
            {message: 'hello world 4'},
            {message: 'hello world 5'},
        ];

        const progress: IEventDispatcher<SyncBarProgress> = new SimpleReactor();

        // create a fake progress bar here...

        const stages = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

        const remaining = Object.assign([], stages);

        function handleRemaining() {

            if (remaining.length === 0) {
                return;
            }

            setTimeout(() => {

                const percentage = remaining.shift()!;

                progress.dispatchEvent({
                    message: `Anki sync: ${percentage} of 100 tasks remaining...`,
                    percentage,
                    task: 'anki-sync'
                });

                handleRemaining();

            }, 250);

        }

        handleRemaining();

        progress.addEventListener((syncBarProgress) => {
            data.push({message: syncBarProgress.message});
        });

        return (

            <div>

                <LogEventViewer progress={progress}/>

                {/*<WhatsNewComponent/>*/}

                {/*<WhatsNewModal open={true} accept={() => { }}/>*/}


                {/*<ReactTable*/}
                    {/*data={data}*/}
                    {/*columns={*/}
                        {/*[*/}
                            {/*{*/}
                                {/*Header: 'Message',*/}
                                {/*accessor: 'message',*/}

                            {/*},*/}
                        {/*]}*/}

                    {/*defaultPageSize={25}*/}
                    {/*noDataText=""*/}
                    {/*className="-striped -highlight"*/}
                    {/*// defaultSorted={[*/}
                    {/*//     {*/}
                    {/*//         id: "progress",*/}
                    {/*//         desc: true*/}
                    {/*//     }*/}
                    {/*// ]}*/}
                    {/*// sorted={[{*/}
                    {/*//     id: 'added',*/}
                    {/*//     desc: true*/}
                    {/*// }]}*/}
                    {/*// getTrProps={(state: any, rowInfo: any) => {*/}
                    {/*//     return {*/}
                    {/*//*/}
                    {/*//         onClick: (e: any) => {*/}
                    {/*//             this.highlightRow(rowInfo.index as number);*/}
                    {/*//         },*/}
                    {/*//*/}
                    {/*//         style: {*/}
                    {/*//             background: rowInfo && rowInfo.index === this.state.selected ? '#00afec' : 'white',*/}
                    {/*//             color: rowInfo && rowInfo.index === this.state.selected ? 'white' : 'black',*/}
                    {/*//         }*/}
                    {/*//     };*/}
                    {/*// }}*/}
                    {/*// getTdProps={(state: any, rowInfo: any, column: any, instance: any) => {*/}
                    {/*//*/}
                    {/*//     const singleClickColumns = ['tag-input', 'flagged', 'archived', 'doc-dropdown'];*/}
                    {/*//*/}
                    {/*//     if (! singleClickColumns.includes(column.id)) {*/}
                    {/*//         return {*/}
                    {/*//             onDoubleClick: (e: any) => {*/}
                    {/*//                 this.onDocumentLoadRequested(rowInfo.original.fingerprint, rowInfo.original.filename);*/}
                    {/*//             }*/}
                    {/*//         };*/}
                    {/*//     }*/}
                    {/*//*/}
                    {/*//     if (singleClickColumns.includes(column.id)) {*/}
                    {/*//*/}
                    {/*//         return {*/}
                    {/*//*/}
                    {/*//             onClick: ((e: any, handleOriginal?: () => void) => {*/}
                    {/*//*/}
                    {/*//                 this.handleToggleField(rowInfo.original, column.id)*/}
                    {/*//                     .catch(err => log.error("Could not handle toggle: ", err));*/}
                    {/*//*/}
                    {/*//                 if (handleOriginal) {*/}
                    {/*//                     // needed for react table to function*/}
                    {/*//                     // properly.*/}
                    {/*//                     handleOriginal();*/}
                    {/*//                 }*/}
                    {/*//*/}
                    {/*//             })*/}
                    {/*//*/}
                    {/*//         };*/}
                    {/*//*/}
                    {/*//     }*/}
                    {/*//*/}
                    {/*//     return {};*/}
                    {/*//*/}
                    {/*// }}*/}

                {/*/>*/}


                <SyncBar progress={progress}/>

                {/*<div className="fa-4x">*/}
                    {/*<span className="fa-layers fa-fw" style={{background: 'MistyRose'}}>*/}
                        {/*<i className="fas fa-circle" style={{color: 'Tomato'}}></i>*/}
                        {/*<i className="fa-inverse fas fa-times" data-fa-transform="shrink-6"></i>*/}
                    {/*</span>*/}

                    {/*/!*https://fontawesome.com/how-to-use/on-the-web/styling/power-transforms*!/*/}

                    {/*<span className="fa-layers fa-fw">*/}
                        {/*<i className="fa fa-comment-alt" style={{color: 'grey'}} data-fa-transform="shrink-2 down-1"></i>*/}
                        {/*<i className="fa-inverse fas fa-plus" style={{color: 'white'}}  data-fa-transform="shrink-8 up-0"></i>*/}
                    {/*</span>*/}

                    {/*<span className="fa-layers fa-fw">*/}
                        {/*<i className="fas fa-bolt" style={{color: 'grey'}} data-fa-transform="shrink-2 down-1"></i>*/}
                        {/*<i className="fa-inverse fas fa-plus" style={{color: 'white'}}  data-fa-transform="shrink-8 up-0"></i>*/}
                    {/*</span>*/}

                    {/*<i className="fas fa-spider" data-fa-transform="shrink-8 up-6"></i>*/}



                {/*</div>*/}


                {/*<br/>*/}
                {/*<span className="fa-stack fa-lg" aria-hidden="true">*/}
                  {/*<i className="fa fa-comment fa-stack-2x"></i>*/}
                  {/*<i className="fa fa-plus fa-stack-1x fa-inverse"></i>*/}
                {/*</span>*/}
                {/*<br/>*/}

                {/*<span className="fa-stack fa-lg" aria-hidden="true">*/}
                  {/*<i className="fa fa-comment-alt fa-stack-2x"></i>*/}
                  {/*<i className="fa fa-plus fa-stack-1x fa-inverse"></i>*/}
                {/*</span>*/}
                {/*<br/>*/}


                {/*<i className="fa fa-comment fa-stack-2x"></i>*/}
                {/*<br/>*/}

                {/*<i className="fa fa-comment fa-2x"></i>*/}
                {/*<br/>*/}

                {/*<i className="fa fa-comment fa-lg"></i>*/}
                {/*<br/>*/}
                {/*<i className="fas fa-comment-plus"></i>*/}

                {/*<TableDropdown id={'table-dropdown'}></TableDropdown>*/}

                {/*<br/>*/}
                {/*<br/>*/}
                {/*<br/>*/}
                {/*<br/>*/}
                {/*<br/>*/}
                {/*<br/>*/}
                {/*<br/>*/}
                {/*<br/>*/}
                {/*<br/>*/}
                {/*<br/>*/}


                {/*<Dropdown isOpen={true} >*/}
                    {/*<DropdownToggle*/}
                        {/*tag="span"*/}
                        {/*data-toggle="dropdown"*/}
                        {/*aria-expanded={true}>*/}
                        {/*Custom Dropdown Content*/}
                    {/*</DropdownToggle>*/}
                    {/*<DropdownMenu>*/}
                        {/*<div >Custom dropdown item</div>*/}
                    {/*</DropdownMenu>*/}
                {/*</Dropdown>*/}

                {/*<ListSelector options={options}*/}
                              {/*id="list-options"*/}
                              {/*onChange={(value) => console.log(value)}>*/}

                {/*</ListSelector>*/}

                    {/*/!*<NavbarBrand href="/">reactstrap</NavbarBrand>*!/*/}
                    {/*/!*<NavbarToggler onClick={this.toggle} />*!/*/}
                    {/*/!*<Collapse isOpen={this.state.isOpen} navbar>*!/*/}
                        {/*/!*<Nav className="ml-auto" navbar>*!/*/}
                            {/*/!*<NavItem>*!/*/}
                                {/*/!*<NavLink href="/components/">Components</NavLink>*!/*/}
                            {/*/!*</NavItem>*!/*/}
                            {/*/!*<NavItem>*!/*/}
                                {/*/!*<NavLink href="https://github.com/reactstrap/reactstrap">GitHub</NavLink>*!/*/}
                            {/*/!*</NavItem>*!/*/}
                            {/*/!*<UncontrolledDropdown nav inNavbar>*!/*/}
                                {/*/!*<DropdownToggle nav caret>*!/*/}
                                    {/*/!*Options*!/*/}
                                {/*/!*</DropdownToggle>*!/*/}
                                {/*/!*<DropdownMenu right>*!/*/}
                                    {/*/!*<DropdownItem>*!/*/}
                                        {/*/!*Option 1*!/*/}
                                    {/*/!*</DropdownItem>*!/*/}
                                    {/*/!*<DropdownItem>*!/*/}
                                        {/*/!*Option 2*!/*/}
                                    {/*/!*</DropdownItem>*!/*/}
                                    {/*/!*<DropdownItem divider />*!/*/}
                                    {/*/!*<DropdownItem>*!/*/}
                                        {/*/!*Reset*!/*/}
                                    {/*/!*</DropdownItem>*!/*/}
                                {/*/!*</DropdownMenu>*!/*/}
                            {/*/!*</UncontrolledDropdown>*!/*/}
                        {/*/!*</Nav>*!/*/}
                    {/*/!*</Collapse>*!/*/}

                {/*<Navbar light expand="md" className="p-2 border-bottom link-navbar">*/}

                    {/*<InputGroup size="sm" className="">*/}

                        {/*<InputGroupAddon addonType="prepend"*/}
                                         {/*title="Refresh the current page">*/}
                            {/*/!*<i className="fa fa-close"></i>*!/*/}

                            {/*<Button type="button"*/}
                                    {/*className="btn btn-outline-secondary"*/}
                                    {/*aria-label="">*/}

                                {/*<span className="fa fa-refresh fa-lg" aria-hidden="true"></span>*/}

                            {/*</Button>*/}

                        {/*</InputGroupAddon>*/}
                        {/*<Input className="px-2 mx-1" />*/}
                        {/*<InputGroupAddon addonType="append">*/}
                            {/*/!*<i className="fa fa-close"></i>*!/*/}

                            {/*<Button type="button"*/}
                                    {/*className="btn btn-outline-secondary"*/}
                                    {/*title="Capture the HTML page and save locally"*/}
                                    {/*aria-label=""*/}
                                    {/*disabled>*/}

                                {/*<span className="fa fa-cloud-download fa-lg" aria-hidden="true"></span>*/}

                            {/*</Button>*/}

                        {/*</InputGroupAddon>*/}

                        {/*<BrowserConfigurationInputGroup/>*/}

                    {/*</InputGroup>*/}
                {/*</Navbar>*/}

                {/*<br/>*/}
                {/*<br/>*/}
                {/*<br/>*/}
                {/*<br/>*/}
                {/*<br/>*/}
                {/*<br/>*/}

                {/*<div className="components">*/}
                    {/*asdf : <Input type="checkbox" />*/}
                    {/*<InputGroup>*/}
                        {/*<InputGroupAddon addonType="prepend"><Button>I'm a button</Button></InputGroupAddon>*/}
                        {/*<Input />*/}
                    {/*</InputGroup>*/}
                    {/*<br />*/}
                    {/*<InputGroup>*/}
                        {/*<Input />*/}
                        {/*<InputGroupButtonDropdown addonType="append"*/}
                                                  {/*isOpen={this.state.dropdownOpen}*/}
                                                  {/*toggle={this.toggleDropDown}>*/}
                            {/*<DropdownToggle caret>*/}
                                {/*Button Dropdown*/}
                            {/*</DropdownToggle>*/}
                            {/*<DropdownMenu>*/}
                                {/*<DropdownItem header>Header</DropdownItem>*/}
                                {/*<DropdownItem disabled>Action</DropdownItem>*/}
                                {/*<DropdownItem>Another Action</DropdownItem>*/}


                                {/*<DropdownItem divider />*/}
                                {/*<DropdownItem><Input type="checkbox" /> asdf</DropdownItem>*/}
                                {/*<DropdownItem>Another Action</DropdownItem>*/}
                            {/*</DropdownMenu>*/}
                        {/*</InputGroupButtonDropdown>*/}
                    {/*</InputGroup>*/}
                    {/*<br />*/}
                    {/*<InputGroup>*/}
                        {/*<InputGroupButtonDropdown addonType="prepend"*/}
                                                  {/*isOpen={this.state.splitButtonOpen}*/}
                                                  {/*toggle={this.toggleSplit}>*/}
                            {/*<Button outline>Split Button</Button>*/}
                            {/*<DropdownToggle split outline />*/}
                            {/*<DropdownMenu>*/}
                                {/*<DropdownItem header>Header</DropdownItem>*/}
                                {/*<DropdownItem disabled>Action</DropdownItem>*/}
                                {/*<DropdownItem>Another Action</DropdownItem>*/}
                                {/*<DropdownItem divider />*/}
                                {/*<DropdownItem>Another Action</DropdownItem>*/}
                            {/*</DropdownMenu>*/}
                        {/*</InputGroupButtonDropdown>*/}
                        {/*<Input placeholder="and..." />*/}
                        {/*<InputGroupAddon addonType="append">*/}
                            {/*<Button color="secondary">I'm a button</Button>*/}
                        {/*</InputGroupAddon>*/}
                    {/*</InputGroup>*/}


                    {/*<br />*/}
                    {/*<br />*/}
                    {/*<br />*/}
                    {/*<br />*/}
                    {/*<br />*/}

                    {/*<div id="hoverbar" style={{width: '250px'}} className="shadow-lg p-1 m-1 bg-white rounded" >*/}

                        {/*<Button size="sm"*/}
                                {/*type="button"*/}
                                {/*className="btn btn-outline-secondary p-2 m-1 rounded-circle"*/}
                                {/*title="Capture HTML page"*/}
                                {/*aria-label=""*/}
                                {/*style={{backgroundColor: 'rgba(255,255,0,0.5)'}} >*/}

                        {/*</Button>*/}

                        {/*<Button size="sm"*/}
                                {/*type="button"*/}
                                {/*className="btn btn-outline-secondary p-2 m-1 rounded-circle"*/}
                                {/*title="Capture HTML page"*/}
                                {/*aria-label=""*/}
                                {/*style={{backgroundColor: 'rgba(255,0,0,0.5)'}} >*/}

                        {/*</Button>*/}

                        {/*<Button size="sm"*/}
                                {/*type="button"*/}
                                {/*className="btn btn-outline-secondary p-2 m-1 rounded-circle"*/}
                                {/*title="Capture HTML page"*/}
                                {/*aria-label=""*/}
                                {/*style={{backgroundColor: 'rgba(0,255,0,0.5)'}} >*/}

                        {/*</Button>*/}


                        {/*<Button size="sm"*/}
                                {/*type="button"*/}
                                {/*className="btn btn-outline-secondary p-2 m-1 rounded-circle"*/}
                                {/*title="Capture HTML page"*/}
                                {/*aria-label=""*/}
                                {/*style={{backgroundColor: 'rgba(0,0,255,0.5)'}} >*/}

                        {/*</Button>*/}

                        {/*<Button size="sm"*/}
                                {/*type="button"*/}
                                {/*className="btn btn-outline-secondary p-1 m-1 "*/}
                                {/*title="Capture HTML page"*/}
                                {/*aria-label=""*/}
                                {/*style={{backgroundColor: 'yellow'}} >*/}

                            {/*<span className="fa fa-tag" aria-hidden="true"></span>*/}

                        {/*</Button>*/}



                        {/*<Button size="sm"*/}
                                {/*type="button"*/}
                                {/*className="btn btn-outline-secondary p-1 m-1"*/}
                                {/*title="Capture HTML page"*/}
                                {/*aria-label=""*/}
                                {/*style={{backgroundColor: 'yellow'}} >*/}

                            {/*<span className="fa fa-tag" aria-hidden="true"></span>*/}

                        {/*</Button>*/}


                        {/*<InputGroup size="sm" style={{width: '100%'}} >*/}

                            {/*<InputGroupAddon addonType="prepend">*/}
                                {/*/!*<i className="fa fa-close"></i>*!/*/}

                                {/*<Button type="button"*/}
                                        {/*className="btn btn-outline-secondary"*/}
                                        {/*title="Capture HTML page"*/}
                                        {/*aria-label=""*/}
                                        {/*style={{backgroundColor: 'yellow'}} >*/}

                                    {/*<span className="fa fa-tag fa-lg" aria-hidden="true"></span>*/}

                                {/*</Button>*/}

                                {/*<Button type="button"*/}
                                        {/*className="btn btn-outline-secondary"*/}
                                        {/*title="Capture HTML page"*/}
                                        {/*aria-label=""*/}
                                        {/*style={{backgroundColor: 'red'}} >*/}

                                    {/*<span className="fa fa-tag fa-lg" aria-hidden="true"></span>*/}

                                {/*</Button>*/}


                                {/*<Button type="button"*/}
                                        {/*className="btn btn-outline-secondary"*/}
                                        {/*title="Capture HTML page"*/}
                                        {/*aria-label="" >*/}

                                    {/*<span className="fa fa-comment-o fa-lg" aria-hidden="true"></span>*/}

                                {/*</Button>*/}

                            {/*</InputGroupAddon>*/}
                            {/*<InputGroupAddon addonType="append">*/}
                                {/*<Button color="secondary">I'm a button</Button>*/}
                            {/*</InputGroupAddon>*/}
                        {/*</InputGroup>*/}
                    {/*</div>*/}


                    {/*<div style={{backgroundColor: 'rgba(0,0,255,0.5)'}}>*/}
                        {/*this is the first*/}
                    {/*</div>*/}


                    {/*<InputGroupButtonDropdown addonType="append"*/}
                                              {/*size="sm"*/}
                                              {/*isOpen={this.state.dropdownOpen}*/}
                                              {/*toggle={this.toggleDropDown}>*/}
                        {/*<DropdownToggle caret>*/}
                            {/*Button Dropdown*/}
                        {/*</DropdownToggle>*/}
                        {/*<DropdownMenu>*/}
                            {/*<DropdownItem header>Header</DropdownItem>*/}
                            {/*<DropdownItem disabled>Action</DropdownItem>*/}
                            {/*<DropdownItem>Another Action</DropdownItem>*/}
                            {/*<DropdownItem divider />*/}
                            {/*<DropdownItem>Another Action</DropdownItem>*/}
                        {/*</DropdownMenu>*/}
                    {/*</InputGroupButtonDropdown>*/}


                {/*</div>*/}
                {/*<Moment fromNow>1976-04-19T12:59-0500</Moment>*/}

                {/*<div>*/}
                    {/*<div className="text-right">asdf</div>*/}
                    {/*<div>asdf</div>*/}
                {/*</div>*/}

                {/*<nav className="navbar navbar-expand-lg navbar-light">*/}
                    {/*<a className="navbar-brand" href="#">Navbar</a>*/}

                    {/*<div className=""*/}
                         {/*id="navbarSupportedContent">*/}
                        {/*<ul className="navbar-nav mr-auto">*/}
                            {/*<li className="nav-item active">*/}
                                {/*<a className="nav-link" href="#">Home <span*/}
                                    {/*className="sr-only">(current)</span></a>*/}
                            {/*</li>*/}
                            {/*<li className="nav-item">*/}
                                {/*<a className="nav-link" href="#">Link</a>*/}
                            {/*</li>*/}
                            {/*<li className="nav-item dropdown">*/}
                                {/*<a className="nav-link dropdown-toggle" href="#"*/}
                                   {/*id="navbarDropdown" role="button"*/}
                                   {/*data-toggle="dropdown" aria-haspopup="true"*/}
                                   {/*aria-expanded="false">*/}
                                    {/*Dropdown*/}
                                {/*</a>*/}
                                {/*<div className="dropdown-menu"*/}
                                     {/*aria-labelledby="navbarDropdown">*/}
                                    {/*<a className="dropdown-item"*/}
                                       {/*href="#">Action</a>*/}
                                    {/*<a className="dropdown-item" href="#">Another*/}
                                        {/*action</a>*/}
                                    {/*<div className="dropdown-divider"></div>*/}
                                    {/*<a className="dropdown-item" href="#">Something*/}
                                        {/*else here</a>*/}
                                {/*</div>*/}
                            {/*</li>*/}
                            {/*<li className="nav-item">*/}
                                {/*<a className="nav-link disabled"*/}
                                   {/*href="#">Disabled</a>*/}
                            {/*</li>*/}
                        {/*</ul>*/}
                        {/*<form className="form-inline my-2 my-lg-0">*/}
                            {/*right*/}
                        {/*</form>*/}
                    {/*</div>*/}
                {/*</nav>*/}

                {/*<br/>*/}
                {/*<br/>*/}
                {/*<br/>*/}
                {/*<br/>*/}
                {/*<br/>*/}

                {/*<div className="column-selector m-2">*/}

                    {/*<ListGroup>*/}
                        {/*<ListGroupItem>*/}
                            {/*<Input type="checkbox" />*/}
                            {/*Cras justo odio*/}
                        {/*</ListGroupItem>*/}
                        {/*<ListGroupItem>*/}
                            {/*<div className="ml-2">*/}
                                {/*<Input type="checkbox" />*/}
                                {/*Dapibus ac facilisis in*/}
                            {/*</div>*/}
                        {/*</ListGroupItem>*/}
                        {/*<ListGroupItem>Morbi leo risus</ListGroupItem>*/}
                        {/*<ListGroupItem>Porta ac consectetur ac</ListGroupItem>*/}
                        {/*<ListGroupItem>Vestibulum at eros</ListGroupItem>*/}
                    {/*</ListGroup>*/}

                {/*</div>*/}

            </div>
        );
    }


    private toggleDropDown() {

        this.setState({
            splitButtonOpen: this.state.splitButtonOpen,
            dropdownOpen: !this.state.dropdownOpen
        });

    }

    private toggleSplit() {

        this.setState({
            splitButtonOpen: !this.state.splitButtonOpen
        });

    }



}

export default App;

interface IAppState {
    dropdownOpen: boolean;
    splitButtonOpen: boolean;

}


