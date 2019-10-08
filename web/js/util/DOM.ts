export class DOM {

    public static removeChildNodes(element: HTMLElement) {

        for (const node of Array.from(element.childNodes)) {
            element.removeChild(node);
        }

    }

    public static appendChildNodes(source: HTMLElement, target: HTMLElement) {

        for (const sourceNode of Array.from(source.childNodes)) {
            // target.appendChild(sourceNode.cloneNode(true));
            target.appendChild(sourceNode);
        }

    }

}
