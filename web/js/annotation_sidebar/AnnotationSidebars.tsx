import {Splitter} from '../ui/splitter/Splitter';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {AnnotationSidebar} from './AnnotationSidebar';
import {DocMeta} from '../metadata/DocMeta';
import {Logger} from 'polar-shared/src/logger/Logger';
import {PersistenceLayer} from '../datastore/PersistenceLayer';
import {Docs} from '../metadata/Docs';
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";

const log = Logger.create();

export class AnnotationSidebars {

    public static create(docMeta: IDocMeta,
                         persistenceLayerProvider: () => PersistenceLayer): Splitter {

        const splitter = new Splitter('.polar-viewer', '.polar-sidebar');

        const polarSidebar = document.querySelector(".polar-sidebar")! as HTMLElement;
        polarSidebar.style.display = 'block';

        splitter.collapse();

        const doc = Docs.create(docMeta, persistenceLayerProvider().capabilities().permission);

        ReactDOM.render(
            <AnnotationSidebar doc={doc}
                               persistenceLayerProvider={persistenceLayerProvider} />,
            document.querySelector('.polar-sidebar') as HTMLElement
        );

        return splitter;

    }

    public static scrollToAnnotation(id: string, pageNum: number) {

        const selector = `.page div[data-annotation-id='${id}']`;

        const pageElements: HTMLElement[] = Array.from(document.querySelectorAll(".page"));
        const pageElement = pageElements[pageNum - 1];

        if (!pageElement) {
            log.error(`Could not find page ${pageNum} of N pages: ${pageElements.length}`);
            return;
        }

        this.scrollToElement(pageElement);

        const annotationElement = document.querySelector(selector);

        if (annotationElement) {
            this.scrollToElement(annotationElement as HTMLElement);
        } else {
            log.warn("Could not find annotation element: " + selector);
        }

        // TODO: disable this for now because with the pagemark the flash does
        // not actually work. Migrate to using some type of pointer showing the
        // place the annotation is marked.
        //
        // const flashClass = 'flash-background-color';
        //
        // document.querySelectorAll(selector).forEach(current => {
        //     current.classList.add(flashClass);
        //     setTimeout(() => current.classList.remove(flashClass), 1000);
        // });

    }

    private static scrollToElement(element: HTMLElement) {

        const options = {
            behavior: 'instant',
            block: 'center',
            inline: 'center'
        };

        // NOTE that 'instant' is apparently unsupported in the typescript type
        // but it's supported in Javascript.
        element.scrollIntoView(options as ScrollIntoViewOptions);

    }


}
