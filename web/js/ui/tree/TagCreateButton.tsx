import * as React from 'react';
import {Tag} from '../../tags/Tags';
import Button from 'reactstrap/lib/Button';
import {Dialogs} from '../dialogs/Dialogs';
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';
import {Tags} from '../../tags/Tags';
import {TagStr} from '../../tags/Tags';

export class TagCreateButton extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onClick = this.onClick.bind(this);
        this.onCreated = this.onCreated.bind(this);

    }

    public render() {

        const disabled = this.props.selected.length !== 1;

        const tag = this.props.selected[0];

        return (
            <Button className="ml-1"
                    color="light"
                    disabled={disabled}
                    onClick={() => this.onClick(tag)}
                    title="Enter a name for ">

                <i className="hover-button fas fa-plus"/>

            </Button>
        );

    }

    private onClick(tag: TagStr) {

        Dialogs.prompt({
            title: "Enter the name of a new folder:",

            onCancel: NULL_FUNCTION,
            validator: createInputValidator(tag),
            onDone: value => this.onCreated(tag, value)

        });

    }

    private onCreated(tag: TagStr, name: string) {
        const path =  createTag(tag, name);
        this.props.onCreated(path);
    }

}

interface IProps {
    readonly selected: ReadonlyArray<TagStr>;
    readonly onCreated: (path: string) => void;
}


interface IState {
}

function createInputValidator(tag: string) {

    return (input: string) => {
        const newTag = createTag(tag, input);

        if (! Tags.validate(newTag).isPresent()) {
            console.warn("Given invalid tag: ", newTag);
            return {
                message: "Invalid tag.  Tags may not contain spaces, quotes, etc."
            };
        }

        return undefined;

    };
}

function createTag(parent: string, child: string) {

    if (parent === '/') {
        return parent + child;
    }

    return parent + '/' + child;

}
