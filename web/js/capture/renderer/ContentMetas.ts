import {ContentMeta} from "./ContentMeta";
import {isPresent} from 'polar-shared/src/Preconditions';
import {Optional} from "polar-shared/src/util/ts/Optional";
import {Logger} from "polar-shared/src/logger/Logger";
import {Objects} from "../../util/Objects";
import {Strings} from "polar-shared/src/util/Strings";

const log = Logger.create();

class AggregateParser implements ContentMetaParser {

    private readonly delegates: ContentMetaParser[] = [
        new TwitterCardParser(),
        new OGCardParser()

        // TODO support hatom, microdata

    ];

    public parse(doc: Document): Readonly<ContentMeta> {

        // parse the doc using every parser
        const results =
            this.delegates.map(current => {

                try {
                    return current.parse(doc);
                } catch (e) {
                    // don't allow these to throw exceptions...
                    log.error("Unable to parse doc: ", e);
                    return createNullContentMeta();
                }

            });

        // now take the results and merge them.
        const result = createNullContentMeta();

        for (const key of Objects.typedKeys(result)) {
            result[key] = this.first(current => current[key], ...results);
        }

        return result;

    }

    private first(converter: (contentMeta: ContentMeta) => string | undefined,
                  ...contentMeta: ContentMeta[]): string | undefined {

        const results =
            contentMeta.map(current => converter(current))
                       .map(current => Strings.filterEmpty(current));

        return Optional.first(...results).getOrUndefined();

    }

}

export class ContentMetas {

    private static readonly parser = new AggregateParser();

    /**
     * Parse metadata from the given document.
     */
    public static parse(doc: Document): Readonly<ContentMeta> {
        return this.parser.parse(doc);
    }

}

interface ContentMetaParser {

    parse(doc: Document): Readonly<ContentMeta>;

}


class TwitterCardParser implements ContentMetaParser {

    public parse(doc: Document): ContentMeta {
        const result = createNullContentMeta();

        result.title = metaValue(doc, 'twitter:title').getOrUndefined();
        result.description = metaValue(doc, 'twitter:description').getOrUndefined();

        return result;
    }

}

class OGCardParser implements ContentMetaParser {

    public parse(doc: Document): ContentMeta {
        const result = createNullContentMeta();

        result.title = metaValue(doc, 'article:title').getOrUndefined();
        result.description = metaValue(doc, 'article:description').getOrUndefined();

        return result;
    }

}


function createNullContentMeta(): ContentMeta {

    const result: ContentMeta = {
        title: undefined,
        description: undefined
    };

    return result;

}

function metaValue(doc: Document, name: string): Optional<string> {

    const optionalMetaElement = meta(doc, name);

    if (! optionalMetaElement.isPresent()) {
        return Optional.empty();
    }

    const metaElement = optionalMetaElement.get();

    let content = metaElement.getAttribute("content");

    if (isPresent(content)) {
        return Optional.of(content);
    }

    content = metaElement.getAttribute("value");

    return Optional.of(content);

}


function meta(doc: Document, name: string): Optional<Element> {

    let match = doc.querySelector(`meta[name=${name}]`);

    if (!match ) {
        match = doc.querySelector(`meta[property=${name}]`);
    }

    if (!match ) {
        match = doc.querySelector(`meta[itemprop=${name}]`);
    }

    return Optional.of(match);

}

