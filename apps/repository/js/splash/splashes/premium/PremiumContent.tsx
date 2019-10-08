/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {Splash} from '../../Splash';
import {SplitLayout, SplitLayoutLeft} from '../../../../../../web/js/ui/split_layout/SplitLayout';
import {SplitLayoutRight} from '../../../../../../web/js/ui/split_layout/SplitLayoutRight';
import {CallToActionLink} from '../components/CallToActionLink';

export class PremiumContent extends React.Component<IProps, IState> {

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

        return (
            <div>
                <SplitLayout>

                    <SplitLayoutLeft>

                        <h1 className="mb-4">Upgrade to <b>Polar Premium!</b></h1>

                        <p className="h5">
                            <b>Polar Premium</b> gives you extended <i>cloud
                            storage</i>, special benefits, and directly supports
                            future Polar development. The more Polar is
                            user-supported, the freer we are to make Polar the
                            best it can be.
                        </p>

                        <p className="h5">
                            All for less than the prices of a <b>cup of coffee!</b>
                        </p>

                    </SplitLayoutLeft>

                    <SplitLayoutRight>
                        <img style={{maxHeight: '175px'}} src="/icon.png"/>
                    </SplitLayoutRight>

                </SplitLayout>

                <h2 className="text-left mt-0 mb-1">
                    Here's what you get with Polar Premium:
                </h2>

                    {/*<ul style={{fontSize: '18px'}}>*/}
                    {/*<li>Prioritized feature requests</li>*/}
                    {/*<li>Support Polar development</li>*/}
                {/*</ul>*/}

                <div style={{
                    display: 'flex',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                }}>

                    <Feature>

                        <Icon className="fas fa-cloud-upload-alt"/>

                        <FeatureTitle>Cloud Storage</FeatureTitle>

                        <FeatureText>
                            Extended cloud storage.  Up to <b>2GB</b> with bronze and <b>5GB</b> with silver.
                            Your cloud storage will also work on the web
                            and mobile versions of Polar available in <i>Q2
                            2019</i>.
                        </FeatureText>

                    </Feature>

                    <Feature>

                        <Icon className="fas fa-handshake"/>

                        <FeatureTitle>Support Polar</FeatureTitle>

                        <FeatureText>
                            Support continued Polar development including
                            EPUB, web, tablet, and mobile versions including
                            Android and iOS.
                        </FeatureText>

                    </Feature>

                    <Feature>

                        <Icon className="fas fa-ribbon"/>

                        <FeatureTitle>Members-Only Lounge</FeatureTitle>

                        <FeatureText>
                            As a Premium member, you’ll gain access to an
                            exclusive Polar members-only community.  We will
                            prioritize features and feedback from this
                            community since it directly supports Polar.
                        </FeatureText>

                    </Feature>

                </div>

                <div className="mb-1 ml-auto mr-auto" style={{display: 'flex'}}>

                    <div>
                        <div className="mt-1 mb-2">
                            <h3>Additional Features Include:</h3>
                        </div>

                        <div className="h5" style={{marginLeft: '25px'}}>
                            <AdditionalFeature>Prioritized feature requests and support.</AdditionalFeature>
                            <AdditionalFeature>First dibs on Polar team and account names when they ship.</AdditionalFeature>
                            <AdditionalFeature>Support independent Open Source development.</AdditionalFeature>
                        </div>
                    </div>

                </div>

                <div className="mt-2 mb-2" style={{display: 'flex'}}>

                    <PurchaseLink href="https://opencollective.com/polar-bookshelf/contribute/tier/6659-bronze"
                                  eventCategory="splash-polar-premium-bronze">
                        Purchase Bronze $4.99 per month
                    </PurchaseLink>

                    <PurchaseLink href="https://opencollective.com/polar-bookshelf/contribute/tier/6661-silver"
                                  eventCategory="splash-polar-premium-silver">
                        Purchase Silver $9.99 per month
                    </PurchaseLink>

                </div>
            </div>
        );
    }

}

interface IProps {
}

interface IState {
}

