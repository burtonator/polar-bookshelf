import * as React from 'react';
import {Logger} from 'polar-shared/src/logger/Logger';
import CardHeader from 'reactstrap/lib/CardHeader';
import CardBody from 'reactstrap/lib/CardBody';
import Card from 'reactstrap/lib/Card';

const log = Logger.create();

export default class GithubStarsCard extends React.Component<any, any> {

    constructor(props: any, context: any) {
        super(props, context);

    }

    public render() {

        return (

            <Card>
                <CardHeader><b>Github Stars</b></CardHeader>
                <CardBody>

                    <div className="mt-2 mb-2 intro">

                        <p>
                            Liking Polar?  Would you mind giving us a star on
                            Github?
                        </p>

                        <p className="text-center">
                            <a href="https://github.com/burtonator/polar-bookshelf">
                                <img height="100"
                                     src="https://img.shields.io/github/stars/burtonator/polar-bookshelf.svg?style=social&label=Star"/>
                            </a>
                        </p>

                    </div>

                </CardBody>
            </Card>

        );
    }

}

export interface IProps {

}

export interface IState {

}
