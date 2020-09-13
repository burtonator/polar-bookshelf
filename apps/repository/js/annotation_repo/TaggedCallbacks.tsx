import React from 'react';
import {Tag, Tags} from "polar-shared/src/tags/Tags";
import {AutocompleteDialogProps} from "../../../../web/js/ui/dialogs/AutocompleteDialog";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {MUITagInputControls} from "../MUITagInputControls";
import {DialogManager} from "../../../../web/js/mui/dialogs/MUIDialogController";
import {RelatedOptionsCalculator} from "../../../../web/js/mui/autocomplete/MUICreatableAutocomplete";

export namespace TaggedCallbacks {

    import toAutocompleteOption = MUITagInputControls.toAutocompleteOption;
    import ComputeNewTagsStrategy = Tags.ComputeNewTagsStrategy;

    export interface ITagsHolder {
        readonly tags?: Readonly<{[id: string]: Tag}> | undefined;
    }

    export interface TaggedCallbacksOpts<T> {

        /**
         * The items that should be tagged
         */
        readonly targets: () => ReadonlyArray<T>;

        readonly tagsProvider: () => ReadonlyArray<Tag>;

        readonly dialogs: DialogManager;

        readonly doTagged: (targets: ReadonlyArray<T>,
                            tags: ReadonlyArray<Tag>,
                            strategy: ComputeNewTagsStrategy) => void;

        readonly relatedOptionsCalculator?: RelatedOptionsCalculator<Tag>;

    }

    export function create<T extends ITagsHolder>(opts: TaggedCallbacksOpts<T>): () => void {

        return () => {

            const {doTagged, dialogs} = opts;

            const targets = opts.targets();

            if (targets.length === 0) {
                console.log("No targets");
                return;
            }

            const availableTags = opts.tagsProvider();

            interface AutocompleteStrategy {
                readonly strategy: ComputeNewTagsStrategy;
                readonly existingTags: ReadonlyArray<Tag>;
                readonly description?: string | JSX.Element;
            }

            function computeAutocompleteStrategy(): AutocompleteStrategy {

                if (targets.length > 1) {

                    return {
                        strategy: 'add',
                        existingTags: [],
                        description: (
                            <>
                                This will <b>ADD</b> the selected tags to <b>{targets.length}</b> items.
                            </>
                        )
                    };


                }

                const annotation = targets[0];

                return {
                    strategy: 'set',
                    existingTags: Tags.sortByLabel(Object.values(annotation.tags || {})),
                };

            }

            const autocompleteStrategy = computeAutocompleteStrategy();

            const handleDone = (tags: ReadonlyArray<Tag>) => {
                doTagged(targets, tags, autocompleteStrategy.strategy);
            }

            const autocompleteProps: AutocompleteDialogProps<Tag> = {
                title: "Assign Tags",
                description: autocompleteStrategy.description,
                options: availableTags.map(toAutocompleteOption),
                defaultOptions: autocompleteStrategy.existingTags.map(toAutocompleteOption),
                createOption: MUITagInputControls.createOption,
                onCancel: NULL_FUNCTION,
                onChange: NULL_FUNCTION,
                relatedOptionsCalculator: opts.relatedOptionsCalculator,
                onDone: tags => handleDone(tags)
            };

            dialogs.autocomplete(autocompleteProps);
        }

    }
}
