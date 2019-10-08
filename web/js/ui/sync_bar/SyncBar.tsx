/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {IStyleMap} from '../../react/IStyleMap';
import {Progress} from 'reactstrap';
import {Reactor} from '../../reactor/Reactor';
import Collapse from 'reactstrap/lib/Collapse';
import {IEventDispatcher} from '../../reactor/SimpleReactor';
import {EventListener} from '../../reactor/EventListener';
import {Logger} from 'polar-shared/src/logger/Logger';

const log = Logger.create();

const Styles: IStyleMap = {

    root: {

    },

    textBox: {
        position: 'fixed',
        left: '0',
        bottom: '5px',
        padding: '2px',
        fontSize: '12px',
        backgroundColor: '#F0F0EF',
        borderColor: '#D4D4D4',
        borderRadius: '0px 5px 0px 0px',
        minWidth: '250px',
        userSelect: 'none',
        zIndex: 99999999999,
    },

    progress: {

        position: 'fixed',
        left: '0',
        bottom: '0',
        minWidth: '100%',
        zIndex: 99999999999,
        height: '5px',

    }

};

/**
 * The sync bar is a bar in the bottom right of the page that displays sync
 * progress and can bring up a popup displaying what it is currently doing.
 */
export class SyncBar extends React.Component<IProps, IState> {

    private value: string = '';

    private listener?: EventListener<SyncBarProgress>;

    constructor(props: IProps) {
        super(props);

        this.onProgress = this.onProgress.bind(this);

        this.state = {
            progress: undefined
        };

    }

    public componentDidMount(): void {

        if (this.props.progress) {
            this.props.progress.addEventListener(progress => {

                log.info(`${progress.percentage}: ${progress.message}`);

                this.onProgress(progress);
            });
        }

    }


    public componentWillUnmount(): void {

        if (this.listener && this.props.progress) {
            this.props.progress.removeEventListener(this.listener);
        }

    }

    public render() {

        const progress = Math.floor(this.state.progress || 0);

        const isOpen = progress !== 0;

        return (

            <div style={Styles.root} className="">

                <Collapse timeout={0} isOpen={isOpen}>

                    <div style={Styles.textBox} className="border-top border-right">
                        {this.state.message}
                    </div>

                    {/*the title string doesn't render properly and looks horrible*/}
                    <Progress style={Styles.progress}
                              className="rounded-0 border-top border-left border-secondary progress-bar-striped"
                              value={progress}>
                        {/*{Math.floor(progress)}%*/}
                    </Progress>

                </Collapse>

            </div>

        );
    }

    private onProgress(progress: SyncBarProgress) {
        this.setState({
            progress: progress.percentage,
            message: progress.message
        });
    }

}

interface IProps {

    progress?: IEventDispatcher<SyncBarProgress>;

}

interface IState {

    // initially there is no progress to display
    progress?: number;

    // the message to dispaly in the box.  If any.
    message?: string;

}

export interface SyncBarProgress {

    readonly task: string;
    readonly message?: string;
    readonly percentage: number;

}
