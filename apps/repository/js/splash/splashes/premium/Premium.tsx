/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {Splash} from '../../Splash';
import {SplitLayout, SplitLayoutLeft} from '../../../../../../web/js/ui/split_layout/SplitLayout';
import {SplitLayoutRight} from '../../../../../../web/js/ui/split_layout/SplitLayoutRight';
import {CallToActionLink} from '../components/CallToActionLink';
import {PremiumContent} from './PremiumContent';

export class Premium extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
    }

    public render() {

        const Icon = (props: any) => {

            return (

                <div className="text-primary m-3">
                    <i style={{fontSize: '85px'}}
                       className={props.className}></i>
                </div>

            );

        };

        const FeatureTitle = (props: any) => {

            return (<h4>

                <b>{props.children}</b>

            </h4>);

        };

        const Feature = (props: any) => {

            return (<div className="text-center ml-auto mr-auto p-1" style={{maxWidth: '33%'}}>

                {props.children}

            </div>);

        };

        const FeatureText = (props: any) => {

            return (<p style={{fontSize: '16px'}}>

                {props.children}

            </p>);

        };

        interface PurchaseLinkProps {
            readonly eventCategory: string;
            readonly href: string;
            readonly children: any;
        }

        const PurchaseLink = (props: PurchaseLinkProps) => {

            return (<div className="ml-auto mr-auto">

                <CallToActionLink eventCategory={props.eventCategory}
                                  href={props.href}>

                    {props.children}

                </CallToActionLink>
            </div>);

        };

        const AdditionalFeature = (props: any) => {

            return (<div><i style={{color: '#FF851B'}} className="fas fa-check-circle"></i>
                    &nbsp;{props.children}
                </div>);

        };

        const settingKey = this.props.settingKey || 'premium';

        return (

            <Splash settingKey={settingKey}
                    disableClose={true}
                    disableDontShowAgain={true}>

                <PremiumContent/>

            </Splash>

        );
    }

}

interface IProps {
    readonly settingKey?: string;
}

interface IState {
}

