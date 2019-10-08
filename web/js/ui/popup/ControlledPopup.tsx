import * as React from 'react';
import {IEventDispatcher} from '../../reactor/SimpleReactor';
import {TriggerPopupEvent} from './TriggerPopupEvent';
import Popover from 'reactstrap/lib/Popover';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {Point} from '../../Point';
import {Points} from '../../Points';
import {DocFormat} from '../../docformat/DocFormat';
import {DocFormatFactory} from '../../docformat/DocFormatFactory';
import {PopupStateEvent} from './PopupStateEvent';
import {Logger} from 'polar-shared/src/logger/Logger';
import {getSourceFile} from 'tslint';
import {ISODateTimeString, ISODateTimeStrings} from 'polar-shared/src/metadata/ISODateTimeStrings';

const log = Logger.create();

export class ControlledPopup extends React.Component<ControlledPopupProps, IState> {

    private selection?: Selection;

    private docFormat: DocFormat;

    constructor(props: any) {
        super(props);

        this.docFormat = DocFormatFactory.getInstance();

        this.toggle = this.toggle.bind(this);
        this.onTriggerPopupEvent = this.onTriggerPopupEvent.bind(this);

        this.state = {
            active: false,
        };

    }

    public componentWillMount(): void {

        this.props.popupStateEventDispatcher.addEventListener(event => {
            this.setState(event);
        });

        this.props.triggerPopupEventDispatcher.addEventListener(event => {
            this.onTriggerPopupEvent(event);
        });

    }


    public componentWillUnmount(): void {
        this.moveElementToBody();
    }

    public render() {

        return (

            <div id="comment-popup-box">

                <div id={this.props.id + '-anchor'}/>

                <Popover placement={this.props.placement}
                         id={this.props.id + '-popover'}
                         isOpen={this.state.active}
                         target={this.props.id + '-anchor'}
                         toggle={this.toggle}
                         style={{}}>

                    {this.props.children}

                </Popover>

            </div>

        );
    }

    private toggle() {

        // TODO: we keep the dialog open too long as we aren't really told when
        // the active selection goes away so we should update ActiveSelections
        // to send an updated event when selection is destroyed, not just
        // created.  We should have an event type of 'created' and 'destroyed'

        if (this.selection) {

            const active = ! this.selection.isCollapsed;

            this.setState({
                active,
                activated: ISODateTimeStrings.create()
            });

            if (! active) {
                this.moveElementToBody();
            }

        }

        //
        //
        // if (this.state.initial) {
        //    // keep the active state but set initial to false
        //
        //     this.setState({
        //         active: this.state.active,
        //         initial: false
        //     });
        //
        // } else {
        //
        //     this.setState({
        //         active: ! this.state.active,
        //         initial: false
        //     });
        //
        // }

    }

    private moveElementToBody() {

        const id = `${this.props.id}-anchor`;
        const anchorElement = document.getElementById(id);

        if (! anchorElement) {
            // already missing and not on the page.
            return;
        }

        const doc = anchorElement!.ownerDocument;
        anchorElement!.parentElement!.removeChild(anchorElement!);
        doc!.body.appendChild(anchorElement!);

    }

    private onTriggerPopupEvent(event: TriggerPopupEvent) {

        // we need to place the anchor element properly on the page and the
        // popup id displayed relative to the anchor.

        const pageElements = document.querySelectorAll(".page");

        const pageElement = pageElements[event.pageNum - 1];

        this.selection = event.selection;

        let origin: Point =
            Optional.of(pageElement.getBoundingClientRect())
                    .map(rect => {
                        return {'x': rect.left, 'y': rect.top};
                    })
                    .get();

        // one off for the html viewer... I hope we can unify these one day.
        if (this.docFormat.name === 'html') {
            origin = {x: 0, y: 0};
        }

        const point = event.point;

        const relativePoint: Point =
            Points.relativeTo(origin, point);

        const offset = event.offset || {x: 0, y: 0};

        const top = relativePoint.y + offset.y;
        const left = relativePoint.x + offset.x;

        const id = `${this.props.id}-anchor`;
        const cssText = `position: absolute; top: ${top}px; left: ${left}px;`;

        const anchorElement = document.getElementById(id);

        if (anchorElement) {

            anchorElement.style.cssText = cssText;

            // now move the element to the proper page.

            anchorElement.parentElement!.removeChild(anchorElement);

            pageElement.insertBefore(anchorElement, pageElement.firstChild);

            this.setState({
                active: true,
            });

        } else {
            log.warn("Could not find anchor element for id: " + id);
        }

    }

}

export interface ControlledPopupProps {

    readonly id: string;

    readonly placement: ControlledPopupPlacement;

    readonly popupStateEventDispatcher: IEventDispatcher<PopupStateEvent>;

    readonly triggerPopupEventDispatcher: IEventDispatcher<TriggerPopupEvent>;

}

interface IState {

    active: boolean;

    // timestamp so that we can force reactivation
    activated?: ISODateTimeString;

}

export type ControlledPopupPlacement = 'top' | 'bottom';
