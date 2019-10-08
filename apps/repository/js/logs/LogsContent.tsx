import * as React from 'react';
import {Logger} from 'polar-shared/src/logger/Logger';
import {LogMessage} from '../../../../web/js/logger/Logging';
import ReleasingReactComponent from '../framework/ReleasingReactComponent';
import {MemoryLogger} from '../../../../web/js/logger/MemoryLogger';
import ReactJson from 'react-json-view';

const log = Logger.create();

class Styles {

    public static LogMessage: React.CSSProperties = {
        display: 'flex',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
    };

    public static LogFieldTimestamp: React.CSSProperties = {
        fontWeight: 'bold',
        fontFamily: 'Courier New, monospace',
        marginRight: '5px',
        whiteSpace: 'nowrap',
    };

    public static LogFieldMsg: React.CSSProperties = {
        fontFamily: 'Courier New, monospace',
        whiteSpace: 'nowrap',
        overflow: 'none'
    };

    public static LogFieldArgs: React.CSSProperties = {
        marginLeft: '5px'
    };

}

export default class LogsContent extends ReleasingReactComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
            messages: MemoryLogger.toView()
        };

    }


    public componentWillMount(): void {

        this.releaser.register(
            MemoryLogger.addEventListener(() => {
                this.setState({messages: MemoryLogger.toView()});
            })
        );

    }

    public render() {

        const messages = [...this.state.messages];

        const argsRenderable = (args: any): boolean => {

            if (args) {

                if (Array.isArray(args)) {

                    if (args.length > 0) {
                        return true;
                    } else {
                        return false;
                    }

                }

                return true;

            }

            return false;

        };

        return messages.reverse()
                       .map(current => {

            let className = "";

            if (current.level === 'warn') {
                className = 'alert-warning';
            }

            if (current.level === 'error') {
                className = 'alert-danger';
            }

            const RenderJSON = () => {

                if (argsRenderable(current.args)) {

                    return (<div style={Styles.LogFieldArgs}>
                        <ReactJson src={current.args} name={'args'} shouldCollapse={() => true}/>
                    </div>);

                }

                return (<div></div>);

            };

            return <div style={Styles.LogMessage} className={className} key={current.idx}>

                <div style={Styles.LogFieldTimestamp}>{current.timestamp}</div>
                <div style={Styles.LogFieldMsg}>{current.msg}</div>


                <RenderJSON/>

            </div>;

        });

    }

}

export interface IProps {

}

export interface IState {
    messages: ReadonlyArray<LogMessage>;
}
