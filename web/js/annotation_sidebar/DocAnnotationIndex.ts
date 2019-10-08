import {
    DefaultDocAnnotation,
    DocAnnotation,
    DocAnnotationMap,
    IDocAnnotation,
    SortedDocAnnotations
} from './DocAnnotation';
import {Optional} from "polar-shared/src/util/ts/Optional";
import {Refs} from "polar-shared/src/metadata/Refs";
import {ArrayListMultimap} from "polar-shared/src/util/Multimap";

export class DocAnnotationIndex {

    private readonly lookup: DocAnnotationMap = {};

    private readonly children = new ArrayListMultimap<string, DocAnnotation>();

    private readonly parents: ParentMap = {};

    constructor(docAnnotationMap: DocAnnotationMap = {}) {
        this.lookup = docAnnotationMap;
    }

    public get(id: IDString): DocAnnotation | undefined {
        return Optional.of(this.lookup[id]).getOrUndefined();
    }

    public put(...docAnnotations: ReadonlyArray<IDocAnnotation>) {

        for (const docAnnotation of docAnnotations) {

            const entry = new DefaultDocAnnotation(this, docAnnotation);

            if (docAnnotation.ref) {
                const parsedRef = Refs.parse(docAnnotation.ref);
                this._addChild(parsedRef.value, entry);
            } else {
                this.lookup[docAnnotation.id] = entry;
            }

        }

    }

    public delete(id: IDString) {

        const parent = this._getParent(id);

        if (parent) {
            this._removeChild(parent.id, id);
        }

        delete this.lookup[id];
        this.children.delete(id);

    }

    public getDocAnnotations(): ReadonlyArray<DefaultDocAnnotation> {
        return Object.values(this.lookup);
    }

    public getDocAnnotationsSorted(): ReadonlyArray<DefaultDocAnnotation> {

        const computeScore = (item: DocAnnotation) => {
            return (item.pageNum * 100000) + (item.position.y * 100) + item.position.x;
        };

        // TODO: I would prefer that this was a binary tree which was maintained sorted

        return Object.values(this.lookup)
            .sort((a, b) => {

                const diff = computeScore(a) - computeScore(b);

                if (diff === 0) {
                    return a.id.localeCompare(b.id);
                }

                return diff;

            });

    }

    public _getParent(id: IDString): DocAnnotation | undefined {

        const pid = this.parents[id];

        if (pid) {
            return this.lookup[pid];
        }

        return undefined;

    }

    public _getChildren(id: IDString): ReadonlyArray<DocAnnotation> {
        return this.children.get(id);
    }

    public _setChildren(id: IDString, children: ReadonlyArray<DocAnnotation>): void {
        this.children.putAll(id, children);
    }

    public _addChild(id: IDString, docAnnotation: DocAnnotation) {
        this.children.put(id, docAnnotation);
        this.parents[docAnnotation.id] = id;

    }

    public _removeChild(id: IDString, child: IDString) {
        this.children.delete(id, undefined, (value: DocAnnotation) => value.id === child);
        delete this.parents[child];
    }

}

export interface ParentMap {
    [id: string]: string;
}

export type IDString = string;
