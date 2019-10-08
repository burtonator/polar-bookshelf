import * as React from 'react';
import {Author} from "../metadata/Author";
import {IAuthor} from "polar-shared/src/metadata/IAuthor";

const Image = (props: IProps) => {

    const {author} = props;

    return (

        <div className="mt-auto mb-auto mr-1">

            <img src={author!.image!.src}
                 alt={author!.name!}
                 title={author!.name!}
                 className="rounded"
                 style={{
                     maxWidth: '18px',
                     maxHeight: '18px'
                 }}/>

        </div>
    );

};

/**
 * A generic wrapper that determines which sub-component to render.
 */
export class DocAuthor extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

    }

    public render() {
        const {author} = this.props;

        if (author && author.image) {
            return <Image {...this.props}/>;
        } else {
            return <div/>;
        }

    }

}
interface IProps {
    readonly author?: IAuthor;
}

interface IState {

}


