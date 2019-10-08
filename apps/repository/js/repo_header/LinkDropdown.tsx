import * as React from 'react';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import {LinkDropdownItem} from './LinkDropdownItem';
import {AppRuntime} from '../../../../web/js/AppRuntime';
import {UncontrolledDropdown} from 'reactstrap';
import DropdownItem from 'reactstrap/lib/DropdownItem';
import {Platforms} from '../../../../web/js/util/Platforms';

export class LinkDropdown extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (

            <UncontrolledDropdown className="ml-1"
                                  size="sm"
                                  id="links-dropdown">

                <DropdownToggle className="text-muted"
                                color="light"
                                caret>

                    <i className="fas fa-link" style={{fontSize: '17px'}}></i>

                </DropdownToggle>

                <DropdownMenu className="shadow" right>

                    <DropdownItem header>Extensions and Addons</DropdownItem>

                    <LinkDropdownItem id="chrome-extension"
                                      title="Chrome Extension"
                                      tooltip="Install the Polar Chrome extension for capturing web content directly in Chrome."
                                      link="https://chrome.google.com/webstore/detail/save-to-polar/jkfdkjomocoaljglgddnmhcbolldcafd/"
                                      icon="fab fa-chrome"/>

                    <LinkDropdownItem id="polar-connect"
                                      hidden={AppRuntime.isBrowser()}
                                      title="Polar Connect for Anki Sync"
                                      tooltip="Install the Polar Connect Anki add-on for syncing flashcards to Anki."
                                      link="https://ankiweb.net/shared/info/734898866"
                                      icon="fas fa-bolt"/>

                    <LinkDropdownItem id="download-desktop"
                                      hidden={! (AppRuntime.isBrowser() && Platforms.type() === 'desktop')}
                                      title="Download Polar Desktop"
                                      tooltip="Download Polar for the Desktop"
                                      link="https://getpolarized.io/download.html"
                                      icon="fas fa-file-download"/>

                    <LinkDropdownItem id="link-use-webapp"
                                      hidden={! AppRuntime.isElectron()}
                                      title="Use Polar Webapp"
                                      tooltip="Load the Polar webapp"
                                      link="https://app.getpolarized.io/"
                                      icon="fab fa-html5"/>

                    {/*<LinkDropdownItem id="reddit-link"*/}
                                      {/*title="Reddit"*/}
                                      {/*tooltip="Discuss Polar on the in the PolarBookshelf subreddit."*/}
                                      {/*link="https://www.reddit.com/r/PolarBookshelf/"*/}
                                      {/*icon="fab fa-reddit"/>*/}

                    <DropdownItem header>Social Media</DropdownItem>

                    <LinkDropdownItem id="discord-link"
                                      title="Discord"
                                      tooltip="Chat with other Polar users live on Discord."
                                      link="https://discord.gg/GT8MhA6"
                                      icon="fab fa-discord"/>

                    <LinkDropdownItem id="reddit-link"
                                      title="Reddit"
                                      tooltip="Discuss Polar on the in the PolarBookshelf subreddit."
                                      link="https://www.reddit.com/r/PolarBookshelf/"
                                      icon="fab fa-reddit"/>

                    <LinkDropdownItem id="twitter-link"
                                      title="Twitter"
                                      tooltip="View the Polar Twitter account"
                                      link="https://twitter.com/getpolarized"
                                      icon="fab fa-twitter"/>

                    <LinkDropdownItem id="github-link"
                                      title="Github"
                                      tooltip="View the Polar Github project. Create issues, view source code, etc."
                                      link="https://github.com/burtonator/polar-bookshelf"
                                      icon="fab fa-github"/>

                    {/*<DropdownItem header>Please Review Polar</DropdownItem>*/}

                    {/*<LinkDropdownItem id="discord-link"*/}
                                      {/*title="Discord"*/}
                                      {/*tooltip="Chat with other Polar users live on Discord."*/}
                                      {/*link="https://discord.gg/GT8MhA6"*/}
                                      {/*icon="fab fa-discord"/>*/}

                </DropdownMenu>

                {/*TODO: use the dropdown tooltip code*/}

                {/*<SimpleTooltip target="links-dropdown"*/}
                               {/*placement="bottom">*/}

                    {/*External links for additional information about Polar.*/}

                {/*</SimpleTooltip>*/}

            </UncontrolledDropdown>
        );

    }


}

interface IProps {
}

interface IState {

}
