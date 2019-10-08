import React from 'react';
import {DropdownItem, DropdownMenu, DropdownToggle, InputGroupButtonDropdown} from 'reactstrap';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {ToggleDropdownItem} from './ToggleDropdownItem';

export class BrowserConfigurationInputGroup extends React.Component<Props, State> {

    constructor(props: any) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.onClick = this.onClick.bind(this);
        this.state = {
            open: false
        };
    }

    public render() {

        // TODO: go through all browser and show them in the UI...

        return (
            <InputGroupButtonDropdown
                title="Configure browser settings for capture"
                addonType="append"
                isOpen={this.state.open}
                toggle={this.toggle}>
                <DropdownToggle caret>
                     <span className="fab fa-chrome fa-lg" aria-hidden="true"></span>
                </DropdownToggle>
                <DropdownMenu right>
                    <DropdownItem header>Browser:</DropdownItem>
                    {/*<DropdownItem divider />*/}

                    <DropdownItem data-browser-name="MOBILE_GALAXY_S8"
                                  onClick={(event: React.MouseEvent<HTMLElement>) => this.onClick(event)}>
                        Mobile Galaxy S8 (412x846)
                    </DropdownItem>

                    <DropdownItem data-browser-name="MOBILE_GALAXY_S8_WITH_CHROME_66_WIDTH_700"
                                  onClick={(event: React.MouseEvent<HTMLElement>) => this.onClick(event)}>
                        Mobile Galaxy S8 (700x970)
                    </DropdownItem>

                    <DropdownItem data-browser-name="MOBILE_GALAXY_S8_WITH_CHROME_66_WIDTH_750"
                                  onClick={(event: React.MouseEvent<HTMLElement>) => this.onClick(event)}>
                        Mobile Galaxy S8 (750x970)
                    </DropdownItem>

                    <DropdownItem data-browser-name="DESKTOP_850"
                                  onClick={(event: React.MouseEvent<HTMLElement>) => this.onClick(event)}>
                        Chrome on Desktop (850)
                    </DropdownItem>

                    <DropdownItem data-browser-name="DESKTOP_1024"
                                  onClick={(event: React.MouseEvent<HTMLElement>) => this.onClick(event)}>
                        Chrome on Desktop (1024)
                    </DropdownItem>

                    <DropdownItem data-browser-name="DESKTOP_1280"
                                  onClick={(event: React.MouseEvent<HTMLElement>) => this.onClick(event)}>
                        Chrome on Desktop (1280)
                    </DropdownItem>

                    <DropdownItem data-browser-name="DESKTOP_1920"
                                  onClick={(event: React.MouseEvent<HTMLElement>) => this.onClick(event)}>
                        Chrome on Desktop (1920)
                    </DropdownItem>


                    {/*<DropdownItem divider />*/}

                    {/*<DropdownItem header>Options:</DropdownItem>*/}

                    {/*<ToggleDropdownItem enabled={true}>*/}
                        {/*Accelerated Mobile Pages (AMP)*/}
                    {/*</ToggleDropdownItem>*/}

                </DropdownMenu>

            </InputGroupButtonDropdown>
        );
    }

    private onClick(event: React.MouseEvent<HTMLElement>): void {

        const target = event.target as HTMLElement;

        const browserName = target.getAttribute('data-browser-name')!;

        console.log("clicked: " + browserName);
        Optional.of(this.props.onBrowserChanged).map(callback => callback(browserName));


    }

    private toggle(): void {
        this.setState({
            open: !this.state.open
        });
    }

}

interface Props {
    onBrowserChanged?: (browserName: string) => void;
}

interface State {
    open: boolean;
}

