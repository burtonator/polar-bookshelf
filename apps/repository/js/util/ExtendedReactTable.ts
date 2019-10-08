import ReleasingReactComponent from '../framework/ReleasingReactComponent';

export class ExtendedReactTable<P, S extends IReactTableState> extends ReleasingReactComponent<P, S> {

    constructor(props: any, context: any) {
        super(props, context);

        const keyboardHandler = (event: KeyboardEvent) => {

            // TODO: only do this if the current react component has focus but
            // I'm not sure if I can figure this out...

            const state: IReactTableState = this.state;

            if (state.selected === undefined) {
                return;
            }

            if (event.key === "ArrowUp") {
                const selected = Math.max(state.selected - 1, 0);
                this.onSelectedRow(selected);
            }

            if (event.key === "ArrowDown") {
                const selected = state.selected + 1;
                this.onSelectedRow(selected);
            }

        };

       //  window.addEventListener('keyup', keyboardHandler);
       //
       //  this.releaser.register({
       //      release: () => {
       //          window.removeEventListener('keyup', keyboardHandler);
       //      }
       // });

    }

    /**
     * Called when someone clicks a row in the table.
     *
     * @param selected
     */
    protected onSelectedRow(selected: number) {
        const state: IReactTableState = this.state;
        this.setState({...state, selected });
    }

}

export interface IReactTableState {
    selected?: number;
}

