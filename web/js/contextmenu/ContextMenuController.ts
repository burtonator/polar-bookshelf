import {ipcRenderer} from 'electron';
import {Model} from '../model/Model';
import {Elements} from '../util/Elements';
import {ContextMenuType, ContextMenuTypes} from './ContextMenuType';
import {MatchingSelector} from './MatchingSelector';
import {AnnotationDescriptors} from '../metadata/AnnotationDescriptors';
import {Logger} from 'polar-shared/src/logger/Logger';
import {TriggerEvent} from './TriggerEvent';
import {DocDescriptor} from '../metadata/DocDescriptor';
import {DocFormatFactory} from '../docformat/DocFormatFactory';
import {forDict} from 'polar-shared/src/util/Functions';
import {ElectronContextMenus} from './electron/ElectronContextMenus';
import {BrowserContextMenus} from './browser/BrowserContextMenus';
import {BrowserContextMenu} from './browser/BrowserContextMenu';
import {Platforms} from "../util/Platforms";

const log = Logger.create();

/**
 * Handles listening for context menus and then calling back the proper handler.
 *
 * IPC messages:
 *
 * context-menu-create-flashcard: open the 'create flashcard' modal.
 */
export class ContextMenuController {

    private model: Model;

    constructor(model: Model) {
        this.model = model;

        if (ipcRenderer) {

            ipcRenderer.on('context-menu-command', (event: any, arg: any) => {

                // I don't think we need to listen to these here but rather in the
                // specific controllers.

            });

        }
    }

    public start() {

        // TODO: this should be refactored to make it testable with jsdom once
        // I get it working.

        log.info("Starting ContextMenuController");


        if (Platforms.isDesktop()) {

            BrowserContextMenus.create();

            document.querySelectorAll(".page").forEach((targetElement) => {
                this.registerPageContextMenuListener(<HTMLElement> targetElement);
            });

        } else {
            log.warn("Not running context menu on mobile device");
        }

    }

    private registerPageContextMenuListener(targetElement: HTMLElement) {

        targetElement.addEventListener('contextmenu', (event) => {

            this.onContextMenuHandler(event, [ ".text-highlight",
                                               ".area-highlight",
                                               ".pagemark",
                                               ".page"] );
            event.preventDefault();

        });

    }

    private registerDefaultContextMenuListener(targetElement: HTMLElement) {

        targetElement.addEventListener('contextmenu', (event) => {

            this.onContextMenuHandler(event, [ "*" ] );
            event.preventDefault();

        });

    }

    private onContextMenuHandler(event: MouseEvent, annotationSelectors: string[]) {

        const matchingSelectors
            = ContextMenuController.elementsFromEventMatchingSelectors(event, annotationSelectors );

        const contextMenuTypes: ContextMenuType[] = [];

        forDict(matchingSelectors, (selector: string, current: MatchingSelector) => {
            if (current.elements.length > 0) {
                contextMenuTypes.push(ContextMenuController.toContextMenuType(current.selector));
            }
        });

        const docDescriptor = new DocDescriptor({
            fingerprint: this.model.docMeta.docInfo.fingerprint
        });

        log.info("Creating context menu for contextMenuTypes: ", contextMenuTypes);

        const pageElement = Elements.untilRoot(<HTMLElement> event.target, ".page");

        const docFormat = DocFormatFactory.getInstance();

        const pageNum = docFormat.getPageNumFromPageElement(pageElement);

        const eventTargetOffset = Elements.getRelativeOffsetRect(<HTMLElement> event.target, pageElement);

        // compute the offset of the event relative to the page we're
        // viewing
        const pageOffset = {

            x: eventTargetOffset.left + event.offsetX,
            y: eventTargetOffset.top + event.offsetY

        };

        const triggerEvent = TriggerEvent.create({
            point: {
                x: event.pageX,
                y: event.pageY
            },
            points: {
                page: {
                    x: event.pageX,
                    y: event.pageY
                },
                client: {
                    x: event.clientX,
                    y: event.clientY
                },
                offset: {
                    x: event.offsetX,
                    y: event.offsetY
                },
                pageOffset
            },
            pageNum,
            contextMenuTypes,
            matchingSelectors,
            docDescriptor
        });

        // ElectronContextMenus.trigger(triggerEvent);

        BrowserContextMenus.trigger(triggerEvent, event);

    }

    /**
     * Pagemarks have pointer-events: none and they don't show up when using
     * elementsFromPoint so we have to temporarily enable them.
     */
    private static withActivePagemarks<T>(closure: () => T) {

        interface ElementStyleRestore {
            readonly element: HTMLElement;
            readonly pointerEvents: string | null;
        }

        const elements =
            <HTMLElement[]> Array.from(document.querySelectorAll(".pagemark"));

        const elementStyleRestores: ElementStyleRestore[] = [];

        for (const element of elements) {

            elementStyleRestores.push({
                element, pointerEvents: element.style.pointerEvents
            });

            element.style.pointerEvents = 'auto';

        }

        const result = closure();

        for (const restore of elementStyleRestores) {
            restore.element.style.pointerEvents = restore.pointerEvents;
        }

        return result;

    }


    public static elementsFromEvent(event: MouseEvent) {

        // https://stackoverflow.com/questions/14176988/why-is-document-elementfrompoint-affected-by-pointer-events-none

        if (event.target instanceof HTMLElement) {

            // the point must be relative to the viewport
            const point = {x: event.clientX, y: event.clientY};

            const doc = event.target.ownerDocument;

            if (doc) {

                return this.withActivePagemarks(() => {
                    return <HTMLElement[]> doc.elementsFromPoint(point.x, point.y);
                });

            }

        }

        return [];

    }

    public static toContextMenuType(selector: string): ContextMenuType {
        let result = selector.toUpperCase();
        result = result.replace(".", "");
        result = result.replace("-", "_");
        return ContextMenuTypes.fromString(result);
    }

    /**
     * Create a result by looking at all the events, and all the selectors,
     * building up an index of matching elements at the position.
     *
     * @param event
     * @param selectors
     */
     public static elementsFromEventMatchingSelectors(event: MouseEvent,
                                                      selectors: string[]): MatchingSelectorMap {

        const result: MatchingSelectorMap = {};

        selectors.forEach(selector => {
            result[selector] = new MatchingSelector(selector, [], []);
        });

        const elements = ContextMenuController.elementsFromEvent(event);

        elements.forEach((element: HTMLElement) => {

            selectors.forEach(selector => {

                if (element.matches(selector)) {

                    const matchingSelector = result[selector];

                    matchingSelector.elements.push(element);

                    const annotationDescriptor = AnnotationDescriptors.createFromElement(element);

                    if (annotationDescriptor) {
                        matchingSelector.annotationDescriptors.push(annotationDescriptor);
                    }
                }

            });

        });

        return result;

    }

}

// noinspection TsLint
export type MatchingSelectorMap = {[key: string]: MatchingSelector};
