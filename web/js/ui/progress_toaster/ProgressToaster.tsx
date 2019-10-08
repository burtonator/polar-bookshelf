import React from 'react';
import {Button, Popover, PopoverBody} from 'reactstrap';
import Popper from 'popper.js';
import {ipcRenderer} from "electron";
import {Progress} from '../../util/ProgressTracker';
import {Latch} from "polar-shared/src/util/Latch";

export class ProgressToaster extends React.Component<IProps, IState> {

    constructor(props: any) {
        super(props);

        this.state = {
            progressUpdate: {
                title: ""
            }
        };

        const doUpdate = (progressUpdate: ProgressUpdate) => {
            this.setState({progressUpdate});
        };

        const progressUpdater = {

            update(progressUpdate: ProgressUpdate) {
                doUpdate(progressUpdate);
            }

        };

        this.props.progressUpdaterLatch.resolve(progressUpdater);

    }

    public render() {

        return (

            <div style={{
                width: '500px',
                position: 'fixed',
                right: 10,
                bottom: 10,
                zIndex: 9999,
            }}
                 className="bg-white border rounded shadow p-2 m-2">

                <div style={{
                    display: 'flex',
                    verticalAlign: 'middle'
                }}
                     className="">

                    <div className="mr-2 text-dark mt-auto mb-auto"
                         style={{
                             whiteSpace: 'nowrap'
                         }}>

                        <b>
                            {this.state.progressUpdate.title || ""}
                        </b>

                    </div>

                    <div className="mt-1 mb-1 p-1"
                        style={{
                            textOverflow: 'ellipsis',
                            direction: 'rtl',
                            textAlign: 'left',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap'
                        }}>
                        {this.state.progressUpdate.status || ""}
                    </div>

                </div>

            </div>

        );
    }

}

export interface IProps {

    readonly progressUpdaterLatch: Latch<ProgressUpdater>;

}

export interface IState {

    readonly progressUpdate: ProgressUpdate;

}

export interface ProgressUpdater {
    update(progressUpdate: ProgressUpdate): void;
}

export interface ProgressUpdate {

    /**
     * The title to display
     */
    readonly title?: string;

    readonly status?: string | JSX.Element;

    readonly progress?: Progress;

}
