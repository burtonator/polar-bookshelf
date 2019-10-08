

export interface MousePosition {
    readonly clientX: number;
    readonly clientY: number;
}
/**
 * Keeps track of window mouse positions without having to add/remove event
 * listeners when components are updated.  This
 */
export class MousePositions {

    public static get(): MousePosition {
        return mousePosition;
    }

}

let mousePosition: MousePosition = {
    clientX: 0,
    clientY: 0
};

window.addEventListener('mousemove', event => {

    // update the mouse position
    mousePosition = {
        clientX: event.clientX,
        clientY: event.clientY
    };

});
