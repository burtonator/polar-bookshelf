import * as React from 'react';
import {Link} from "react-router-dom";

export class Navbar extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (
            <div>

                <p>
                    Location: {document.location.href}
                </p>

                <p>
                    <Link
                        to={{
                            pathname: "/",
                            hash: "",
                        }}>

                        Link to #

                    </Link>
                </p>

                <p>
                    <Link
                        to={{
                            pathname: "/",
                            hash: "hello"
                        }}>

                        #hello

                    </Link>
                </p>


                <p>
                    <Link
                        to={{
                            pathname: "/user",
                            hash: ""
                        }}>

                        /user

                    </Link>
                </p>

            </div>
        );

    }

}

interface IProps {
}

interface IState {
}


