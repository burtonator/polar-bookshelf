import * as React from '@types/react';

class App<P> extends React.Component<{}, IAppState> {

    constructor(props: P, context: any) {
        super(props, context);

        // console.log("FIXME: ", styles.dec);

    }

    public render() {
        return (<div className="progress-indeterminate-slider">
            <div className="progress-indeterminate-line"></div>
            <div className="progress-indeterminate-subline progress-indeterminate-inc"></div>
            <div className="progress-indeterminate-subline progress-indeterminate-dec"></div>
        </div>);
    }

}

export default App;

interface IAppState {
    dropdownOpen: boolean;
    splitButtonOpen: boolean;

}


