import * as React from 'react';
import {BrowserRouter, HashRouter, Link, Route, Switch} from "react-router-dom";
import {SimpleTooltipEx} from "../../js/ui/tooltip/SimpleTooltipEx";
import {Navbar} from "./Navbar";
import {ReactRouters} from "../../js/ui/ReactRouters";

class App<P> extends React.Component<{}, IAppState> {

    constructor(props: P, context: any) {
        super(props, context);

    }

    public render() {

        return (

            <div style={{margin: '5px'}}>

                <BrowserRouter>

                    <Switch location={ReactRouters.createLocationWithPathnameHash()}>

                        <Route exact path='/#hello'>

                            <div>
                                <Navbar/>

                                this is the HELLO page :)
                            </div>

                        </Route>

                        <Route exact path='/user'>

                            <div>
                                <Navbar/>
                                this is the USER page
                            </div>

                        </Route>

                        <Route exact path='/'>

                            <div>
                                <div>
                                    <Navbar/>

                                    this is the DEFAULT page.
                                </div>
                            </div>

                        </Route>

                    </Switch>

                </BrowserRouter>

            </div>

        );
    }


}

export default App;

interface IAppState {

}


