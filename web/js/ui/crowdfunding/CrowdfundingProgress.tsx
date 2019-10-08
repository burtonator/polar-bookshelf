import * as React from 'react';
import Progress from 'reactstrap/lib/Progress';
import {Firebase} from '../../firebase/Firebase';
import {Firestore} from '../../firebase/Firestore';
import {Percentages} from '../../util/Percentages';

export class CrowdfundingProgress extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
        this.init = this.init.bind(this);

        this.init().catch(err => console.error("Unable to obtain crowdfunding campaign status: ", err));

        this.state = {};

    }

    private async init() {

        Firebase.init();
        const firestore = await Firestore.getInstance();

        const ref = firestore.collection("crowdfunding").doc("2019-04");

        ref.onSnapshot(snapshot => {

            const data = snapshot.data();

            if (! data) {
                return;
            }

            const status = data as CrowdfundingStatus;

            this.setState({status});

        });

    }

    public render() {

        if (this.state.status === undefined) {
            return <div/>;
        } else {

            const {value, goal} = this.state.status;

            const perc = Math.floor(Percentages.calculate(value, goal));

            return <div style={{display: 'flex'}}>

                <div className="mt-auto mb-auto text-primary ml-2 mr-1">
                    ${this.state.status.value.toLocaleString()}
                </div>

                <div className="mt-auto mb-auto" style={{flexGrow: 1}}>
                    <Progress value={perc} className="" />
                </div>

                <div className="mt-auto mb-auto text-primary ml-1 mr-2">
                    ${this.state.status.goal.toLocaleString()}
                </div>

            </div>;

        }

    }

}


interface IProps {
}

interface IState {
    readonly status?: CrowdfundingStatus;
}

interface CrowdfundingStatus {
    readonly value: number;
    readonly goal: number;
}
