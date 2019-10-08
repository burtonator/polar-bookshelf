import * as React from 'react';
import {Img} from '../metadata/Img';
import {DeepPureComponent} from '../react/DeepPureComponent';
import {HighlightColor} from "polar-shared/src/metadata/IBaseHighlight";

/**
 * Shows a and image and re-sizes it to its parent properly.
 */
export class ResponsiveImg extends DeepPureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {};

    }

    public render() {
        const {img, id, color} = this.props;

        if (img) {
            const width = Math.floor(img.width);
            const height = Math.floor(img.height);

            return (

                // TODO: we need the ability to scroll to the most recent
                // annotation that is created but I need a functional way to do
                // this because how do I determine when it loses focus?

                <div className="area-highlight m-1"
                     data-annotation-id={id}
                     data-annotation-color={color}
                     style={{
                        display: 'block',
                        textAlign: 'center',
                        position: 'relative'

                     }}>

                    <img style={{

                             // core CSS properties for the image so that it
                             // is responsive.

                             width: '100%',
                             height: 'auto',
                             objectFit: 'contain',
                             maxWidth: width,
                             maxHeight: height,

                             // border around the image

                             boxSizing: 'content-box',
                             // border: `1px solid #c6c6c6`,

                         }}
                         draggable={false}
                         className=""
                         width={width}
                         height={height}
                         alt="screenshot"
                         src={img.src}/>

                </div>

            );
        } else {
            return <div>{this.props.defaultText || 'No image'}</div>;
        }

    }

}
interface IProps {
    readonly id: string;
    readonly img?: Img;
    readonly color?: HighlightColor;
    readonly defaultText?: string;
}

interface IState {
}

