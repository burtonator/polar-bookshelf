import * as ReactDOM from 'react-dom';
import * as React from 'react';

/**
 * Ability to inject a small react app on a page without much hassle.
 */
export class ReactInjector {


    /**
     * Inject a component.  When the ID is given we use the ID and ensure
     * that only one component with that ID is created.
     *
     */
    public static inject(element: JSX.Element,
                         id?: string) {

        let container = document.createElement('div');

        if (id) {

            const existingContainer = document.getElementById(id);

            if (existingContainer) {
                return new InjectedComponent(existingContainer);
            } else {

                container = document.createElement('div');
                container.setAttribute('id', id);

            }

        }

        document.body.appendChild(container);

        return this.create(element, container);

    }

    public static create(element: JSX.Element, container: HTMLElement) {

        ReactDOM.render(

            element,
            container

        );

        return new InjectedComponent(container);

    }

}

/**
 * Allows us to destroy the component.
 */
export class InjectedComponent {

    private container: HTMLElement;

    constructor(container: HTMLElement) {
        this.container = container;
    }

    public destroy() {

        if (this.container) {
            this.container.innerHTML = '';
            this.container.parentElement!.removeChild(this.container);
            this.container = null!;
        } else {
            // noop, already destroyed
        }

    }

}
