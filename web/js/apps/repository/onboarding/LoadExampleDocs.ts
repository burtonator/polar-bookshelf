import {AppPath} from '../../../electron/app_path/AppPath';
import {FilePaths} from 'polar-shared/src/util/FilePaths';
import {ImportedFile, PDFImporter} from '../importers/PDFImporter';
import {PersistenceLayer} from '../../../datastore/PersistenceLayer';
import {Providers} from 'polar-shared/src/util/Providers';
import {Pagemarks} from '../../../metadata/Pagemarks';
import {Logger} from 'polar-shared/src/logger/Logger';
import {ISODateTimeString, ISODateTimeStrings} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {DocMeta} from '../../../metadata/DocMeta';
import {DocMetas} from '../../../metadata/DocMetas';
import {Backend} from 'polar-shared/src/datastore/Backend';
import {AppRuntime} from '../../../AppRuntime';
import {LoadExampleDocsMeta} from './LoadExampleDocsMeta';
import {Hashcode} from 'polar-shared/src/metadata/Hashcode';
import {HashAlgorithm} from 'polar-shared/src/metadata/Hashcode';
import {HashEncoding} from 'polar-shared/src/metadata/Hashcode';
import {DocInfo} from '../../../metadata/DocInfo';
import {Datastores} from '../../../datastore/Datastores';
import {PDFMeta} from 'polar-pdf/src/pdf/PDFMetadata';
import {BackendFileRefs} from '../../../datastore/BackendFileRefs';
import {Tag} from '../../../tags/Tags';
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {BackendFileRef} from "polar-shared/src/datastore/BackendFileRef";
import {FileRef} from "polar-shared/src/datastore/FileRef";

const log = Logger.create();

export class LoadExampleDocs {

    public static MAIN_ANNOTATIONS_EXAMPLE_FINGERPRINT = "a2887850877ae33e1e66ea24f433e30f";

    private readonly persistenceLayer: PersistenceLayer;

    private readonly pdfImporter: PDFImporter;

    constructor(persistenceLayer: PersistenceLayer) {
        this.persistenceLayer = persistenceLayer;

        this.pdfImporter
            = new PDFImporter(
                Providers.toInterface(
                    Providers.of(
                        this.persistenceLayer)));

    }

    public async load(onLoaded: (docInfo: IDocInfo) => void) {

        if (await this.hasDocs()) {
            // we're done as there already docs in the repo
            log.debug("Docs already exist");
            return;
        }

        // Must use promise.all on firebase as this is much faster.  Locally
        // it really doesn't matter.
        const promises = [
            this.doDoc0(),
            this.doDoc1(),
            this.doDoc2(),
            this.doDoc3(),
            this.doDoc4(),
            this.doDoc5(),
            this.doDoc6(),
            this.doDoc7()
        ];

        for (const promise of promises) {

            promise
                .then(docMeta => {

                    if (docMeta) {
                        onLoaded(docMeta.docInfo);
                    } else {
                        log.warn("Unable to load docMeta");
                    }

            }).catch(err => log.error("Unable to load docInfo: ", err));

        }

        await Promise.all(promises);

    }

    private async doDoc7() {
        return await this.doDoc(FilePaths.join('docs', 'examples', 'pdf', 'dremel.pdf'), {
            fingerprint: "69cf32b9ffbb82056a3ac0eadea447de",
            title: "Dremel: Interactive Analysis of Web-Scale Datasets",
            tags: this.createTags('google', 'dremel'),
            added: ISODateTimeStrings.adjust(ISODateTimeStrings.create(), '-2d'),
            lastUpdated: ISODateTimeStrings.adjust(ISODateTimeStrings.create(), '-8h'),
            pagemarkEnd: 1,
            url: "https://storage.googleapis.com/polar-32b0f.appspot.com/public/dremel.pdf",
            nrPages: 10,
            hashcode: {
                enc: HashEncoding.BASE58CHECK,
                alg: HashAlgorithm.KECCAK256,
                data: "13e69EGrqZdoaAcKdzECCYwVkEAZ3HVsjh9UNccSjEcmTNCSRz"
            }
        });
    }

    private async doDoc6() {
        return await this.doDoc(FilePaths.join('docs', 'examples', 'pdf', 'datacenter-as-a-computer.pdf'), {
            fingerprint: "a81fe1c43148c3448e1a4133a5c8005e",
            title: "The Datacenter as a Computer",
            tags: this.createTags('google', 'datacenters'),
            added: ISODateTimeStrings.adjust(ISODateTimeStrings.create(), '-2d'),
            lastUpdated: ISODateTimeStrings.adjust(ISODateTimeStrings.create(), '-8h'),
            pagemarkEnd: 2,
            url: "https://storage.googleapis.com/polar-32b0f.appspot.com/public/datacenter-as-a-computer.pdf",
            nrPages: 120,
            hashcode: {
                enc: HashEncoding.BASE58CHECK,
                alg: HashAlgorithm.KECCAK256,
                data: "12gk1XzeM8rCLbSmPnHSNYqWPkJ4V4LQW7WLo1MFJfGJMQVVQzU"
            }
        });
    }

    private async doDoc5() {
        return await this.doDoc(FilePaths.join('docs', 'examples', 'pdf', 'chubby.pdf'), {
            fingerprint: "c29bc1717788b1602a3cf4ed28ddfbcd",
            title: "The Chubby lock service for loosely-coupled distributed systems",
            tags: this.createTags('google', 'chubby'),
            added: ISODateTimeStrings.adjust(ISODateTimeStrings.create(), '-1d'),
            lastUpdated: ISODateTimeStrings.adjust(ISODateTimeStrings.create(), '-3h'),
            pagemarkEnd: 2,
            url: "https://storage.googleapis.com/polar-32b0f.appspot.com/public/chubby.pdf",
            nrPages: 16,
            hashcode: {
                enc: HashEncoding.BASE58CHECK,
                alg: HashAlgorithm.KECCAK256,
                data: "12dVEYTS8znhWJNCYUcGHSfWKQqfifBmbShRLxbLvNVYX5BK3sS"
            }
        });
    }

    private async doDoc4() {
        return await this.doDoc(FilePaths.join('docs', 'examples', 'pdf', 'borg.pdf'), {
            fingerprint: "3417be32534083dea66d733604d36d75",
            title: "Large-scale cluster management at Google with Borg",
            tags: this.createTags('google', 'borg', 'docker'),
            added: ISODateTimeStrings.adjust(ISODateTimeStrings.create(), '-3d'),
            lastUpdated: ISODateTimeStrings.adjust(ISODateTimeStrings.create(), '-8h'),
            pagemarkEnd: 2,
            url: "https://storage.googleapis.com/polar-32b0f.appspot.com/public/borg.pdf",
            nrPages: 17,
            hashcode: {
                enc: HashEncoding.BASE58CHECK,
                alg: HashAlgorithm.KECCAK256,
                data: "19YRZoEqfbhmY2GqQVKcbjfgbm1hZc5TwKdfUo3QW3TVz126bH"
            }

        });
    }

    private async doDoc3() {
        return await this.doDoc(FilePaths.join('docs', 'examples', 'pdf', 'availability.pdf'), {
            fingerprint: "39b730b6e9d281b0eae91b2c2c29b842",
            title: "Availability in Globally Distributed Storage Systems",
            tags: this.createTags('google', 'availability'),
            added: ISODateTimeStrings.adjust(ISODateTimeStrings.create(), '-2d'),
            lastUpdated: ISODateTimeStrings.adjust(ISODateTimeStrings.create(), '-12h'),
            pagemarkEnd: 7,
            url: "https://storage.googleapis.com/polar-32b0f.appspot.com/public/availability.pdf",
            nrPages: 14,
            hashcode: {
                enc: HashEncoding.BASE58CHECK,
                alg: HashAlgorithm.KECCAK256,
                data: "12Ji9JDcRnZT27jeckr4HusYY29QVwj4Wv2J6iYc5YXjtzn3ZJT"
            }

        });
    }

    private createTag(id: string, label?: string): Tag {
        return {id, label: label || id};
    }

    private createTags(...labels: string[]): {[id: string]: Tag} {

        const result: {[id: string]: Tag} = {};

        for (const label of labels) {
            const id = label;
            result[id] = {id, label};
        }

        return result;

    }

    private async doDoc0() {

        return await this.doDoc(FilePaths.join('docs', 'examples', 'pdf', 'pub47492.pdf'), {
            fingerprint: "6ea16525b2e4eab7b946f68419a345a6",
            title: "Efficient Live Expansion for Clos Data Center Networks",
            tags: this.createTags('google', 'datacenters'),
            added: ISODateTimeStrings.adjust(ISODateTimeStrings.create(), '-2h'),
            lastUpdated: ISODateTimeStrings.adjust(ISODateTimeStrings.create(), '-1h'),
            pagemarkEnd: 17,
            url: "https://storage.googleapis.com/polar-32b0f.appspot.com/public/pub47492.pdf",
            nrPages: 20,
            hashcode: {
                enc: HashEncoding.BASE58CHECK,
                alg: HashAlgorithm.KECCAK256,
                data: "1h62ktMPhAXXYgnFaDckCht164co4HcDR24WXu8xsvXV2RB1HA"
            }
        });

    }

    private async doDoc1() {

        const writtenDocMeta = await this.doDoc(FilePaths.join('docs', 'examples', 'pdf', 'bigtable.pdf'), {
            fingerprint: "a2887850877ae33e1e66ea24f433e30f",
            title: "Bigtable: A Distributed Storage System for Structured Data",
            tags: {
                google: this.createTag('google'),
                bigtable: this.createTag('bigtable'),
                compsci: this.createTag('compsci')
            },
            added: ISODateTimeStrings.adjust(ISODateTimeStrings.create(), '-2d'),
            lastUpdated: ISODateTimeStrings.adjust(ISODateTimeStrings.create(), '-1d'),
            // pagemarkEnd: 3,
            flagged: true,
            url: "https://storage.googleapis.com/polar-32b0f.appspot.com/public/bigtable.pdf",
            nrPages: 14,
            hashcode: {
                enc: HashEncoding.BASE58CHECK,
                alg: HashAlgorithm.KECCAK256,
                data: "1ag3DiKsWirunzx8s81iUL988AefnKouGa2DN2TMZxdZj9yZ4F"
            }
        });

        if (writtenDocMeta) {

            // TODO: use the correct lastUpdate and created times...
            const docMeta = DocMetas.deserialize(JSON.stringify(LoadExampleDocsMeta.BIGTABLE_DOC_META),
                                                 writtenDocMeta!.docInfo.fingerprint );

            docMeta.docInfo = writtenDocMeta!.docInfo;

            await this.persistenceLayer.writeDocMeta(docMeta);

            return docMeta;

        } else {
            // this is probably in a testing env...
            return undefined;
        }

    }

    private async doDoc2() {

        return await this.doDoc(FilePaths.join('docs', 'examples', 'pdf', 'mapreduce.pdf'), {
            fingerprint: "9012f59fe537f2bb5fb802e31bb40e83",
            title: "MapReduce: Simplified Data Processing on Large Clusters",
            tags: {
                google: this.createTag('google'),
                mapreduce: this.createTag('mapreduce'),
                compsci: this.createTag('compsci')
            },
            added: ISODateTimeStrings.adjust(ISODateTimeStrings.create(), '-3d'),
            lastUpdated: ISODateTimeStrings.adjust(ISODateTimeStrings.create(), '-2d'),
            pagemarkEnd: 6,
            url: "https://storage.googleapis.com/polar-32b0f.appspot.com/public/mapreduce.pdf",
            nrPages: 13,
            hashcode: {
                enc: HashEncoding.BASE58CHECK,
                alg: HashAlgorithm.KECCAK256,
                data: "12PBhYxGA587Ap4D59ac1hNRXtKcj1uyWi9t3hTuRTQofbQTr3q"
            }
        });

    }

    private async doDoc(relativePath: string, opts: DocOpts): Promise<IDocMeta| undefined> {

        const doImport = async (): Promise<ImportedDoc> => {

            if (AppRuntime.isElectron()) {

                const pdfMeta: PDFMeta = {
                    fingerprint: opts.fingerprint,
                    nrPages: opts.nrPages,
                    props: {}
                };

                const importedFile =
                    await this.doImport(relativePath, pdfMeta);

                if (importedFile.isPresent()) {

                    const docInfo = importedFile.get().docInfo;
                    const docMeta = await this.persistenceLayer.getDocMeta(docInfo.fingerprint);
                    const backendFileRef = importedFile.get().backendFileRef;

                    return {
                        docMeta: docMeta!,
                        backendFileRef: backendFileRef!
                    };

                } else {
                    throw new Error("Unable to do local import");
                }

            } else {

                const docMeta = DocMetas.create(opts.fingerprint, opts.nrPages);

                const ref: FileRef = {
                    name: FilePaths.basename(opts.url),
                    hashcode: opts.hashcode
                };

                docMeta.docInfo.backend = Backend.PUBLIC;
                docMeta.docInfo.filename = ref.name;
                docMeta.docInfo.hashcode = ref.hashcode;

                // note that we do NOT need to write to the datastore here
                // as we will write below and Firebase is a bit slower for
                // writes so we want to keep things as fast as possible.

                return {
                    docMeta,
                    backendFileRef: BackendFileRefs.toBackendFileRef(docMeta)!
                };

            }

        };

        const importedDoc = await doImport();

        const docMeta = importedDoc.docMeta;

        if (docMeta) {
            docMeta.docInfo.title = opts.title;

            const tags = {...(opts.tags || {}),
                          ...this.createTags('example')};

            docMeta.docInfo.tags = tags;

            if (opts.pagemarkEnd) {
                Pagemarks.updatePagemarksForRange(docMeta, opts.pagemarkEnd);
            }

            if (opts.added) {
                docMeta.docInfo.added = opts.added;
            }

            if (opts.lastUpdated) {
                docMeta.docInfo.lastUpdated = opts.lastUpdated;
            }

            docMeta.docInfo.flagged
                = Optional.of(opts.flagged).getOrElse(false);

            log.info("Wrote to persistenceLayer: ", opts.title);

            await this.persistenceLayer.writeDocMeta(docMeta);

            const datastore = this.persistenceLayer.datastore;

            if (datastore.id === 'firebase') {
                // noop for now.. backing out usage of metadata as it's expensive
                // to store this metadata and we really don't need it
            }

        }

        return docMeta;


    }

    private async doImport(relativePath: string, pdfMeta: PDFMeta): Promise<Optional<ImportedFile>> {

        const appPath = AppPath.get();

        if (! appPath) {
            return Optional.empty();
        }

        const path = FilePaths.join(appPath, relativePath);
        const basename = FilePaths.basename(relativePath);

        return await this.pdfImporter.importFile(path, basename, {pdfMeta});

    }

    private async hasDocs() {
        const docMetaRefs = await this.persistenceLayer.getDocMetaRefs();

        return docMetaRefs.length !== 0;
    }

}

interface DocOpts {

    readonly fingerprint: string;

    readonly title: string;

    readonly pagemarkEnd?: number;

    readonly tags?: {[id: string]: Tag};

    readonly added?: ISODateTimeString;

    readonly flagged?: boolean;

    readonly lastUpdated?: ISODateTimeString;

    /**
     * Requires so that we can create the DocMeta in cases wherwe we're adding
     * with an explit/external URL.
     */
    readonly nrPages: number;

    readonly url: string;

    readonly hashcode: Hashcode;

}

interface ImportedDoc {

    readonly docMeta: IDocMeta;
    readonly backendFileRef: BackendFileRef;

}
