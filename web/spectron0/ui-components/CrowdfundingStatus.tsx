import * as React from 'react';
import Button from 'reactstrap/lib/Button';

export class CrowdfundingStatus extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (

            <div className="p-1 border rounded"
                 style={{
                     backgroundColor: 'lightyellow',
                     display: 'flex'
                 }}>

                <div className="mt-auto mb-auto w-100">
                    <progress className="mt-auto mb-auto w-100" value={0.33}/>
                </div>

                <div className="mt-auto mb-auto ml-1" style={{whiteSpace: 'nowrap'}}>
                    <span style={{fontWeight: 'bold'}}>$3,300</span> of <span className="text-muted">$5,000</span> raised
                </div>

                <div className="mv-auto ml-1">
                    <Button color="success" size="sm">Donate</Button>
                </div>

            </div>

        );
    }

}


interface IProps {
}

interface IState {

}
