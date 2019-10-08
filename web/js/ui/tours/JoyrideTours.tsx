import {placement, Step} from 'react-joyride';
import * as React from 'react';
import {SplitLayout, SplitLayoutLeft} from '../split_layout/SplitLayout';
import {Styles} from '../../apps/repository/RepositoryTour';
import {SplitLayoutRight} from '../split_layout/SplitLayoutRight';

export class JoyrideTours {

    public static createImageStep(step: ImageStep): EnhancedStep {

        const Image = () => {

            if (typeof step.image === 'string') {
                return <img src={step.image} style={Styles.SPLIT_BAR_IMG}/>;
            } else {
                return <div>{step.image}</div>;
            }
        };

        return {
            target: step.target,
            title: step.title,
            disableBeacon: true,
            styles: {
                tooltip: {
                    width: '700px'
                }
            },
            content: <div>

                <SplitLayout>

                    <SplitLayoutLeft>

                        {step.content}

                    </SplitLayoutLeft>

                    <SplitLayoutRight>

                        <Image/>

                    </SplitLayoutRight>

                </SplitLayout>

            </div>,
            placement: step.placement || 'bottom',
            hideBackButton: step.hideBackButton || false,
            spotlightClicks: step.spotlightClicks || false,
            autoNext: step.autoNext,
            disabled: step.disabled
        };

    }

}


/**
 * An enhanced step with a few more fields.
 */
export interface EnhancedStep extends Step {

    /**
     * True when we should go the next step as soon as its selector is
     * available.
     */
    readonly autoNext?: boolean;

    /**
     * True if we should disable this step of the tour.
     */
    readonly disabled?: boolean;

}

export interface ImageStep {
    readonly title?: React.ReactNode;
    readonly content: React.ReactNode;
    readonly image: string | React.ReactNode;
    readonly target: string | HTMLElement;
    readonly placement?: placement;
    readonly autoNext?: boolean;
    readonly hideBackButton?: boolean;
    readonly spotlightClicks?: boolean;
    readonly disabled?: boolean;
}
