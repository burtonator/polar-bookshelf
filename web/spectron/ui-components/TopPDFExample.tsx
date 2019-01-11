import * as React from 'react';
import {CommentComponent} from '../../js/annotation_sidebar/child_annotations/CommentComponent';
import {FilePaths} from '../../js/util/FilePaths';

class Styles {

    public static entries: React.CSSProperties = {
        display: 'table',
        width: '100%'
    };

    public static entry: React.CSSProperties = {
        display: 'table-row',
        width: '100%'
    };

    public static idx: React.CSSProperties = {
        display: 'table-cell',
        fontWeight: 'bold',
        marginRight: '5px',
        fontSize: '22px',
    };

    public static link: React.CSSProperties = {
        display: 'table-cell',
        fontSize: '22px',
        textAlign: 'left'
    };

}

export class TopPDFExample extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        for (const entry of entries) {
            entry.download = FilePaths.basename(entry.link);
        }

        let idx = 0;

        return <div style={Styles.entries}>
            {entries.map(entry =>
                 <div key={idx++} style={Styles.entry}>
                     <div style={Styles.idx}>{idx}.</div>

                     <div style={Styles.link}><a href={entry.link} download={entry.download}>{entry.title}</a></div>
                 </div> )}
        </div>;
    }

}


interface IProps {
}

interface IState {
}


interface Entry {

    title: string;

    score: number;

    link: string;

    commentsLink: string;

    // the download attribute for the filename to use and also to trigger
    // download not a navigate

    download?: string;

}

const entries: Entry[] = [
    {
        "title": "Norwegian Consumer Council report on how tech companies use dark patterns [pdf]",
        "score": 661,
        "link": "https:\/\/fil.forbrukerradet.no\/wp-content\/uploads\/2018\/06\/2018-06-27-deceived-by-design-final.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17406186"
    },
    {
        "title": "Assembly Language for Beginners [pdf]",
        "score": 590,
        "link": "https:\/\/yurichev.com\/writings\/AL4B-EN.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17549050"
    },
    {
        "title": "The Periodic Table of Data Structures [pdf]",
        "score": 534,
        "link": "https:\/\/stratos.seas.harvard.edu\/files\/stratos\/files\/periodictabledatastructures.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18314555"
    },
    {
        "title": "Competitive Programmer's Handbook (2017) [pdf]",
        "score": 514,
        "link": "https:\/\/cses.fi\/book.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16952222"
    },
    {
        "title": "DEF CON report on vulnerabilities in US election infrastructure [pdf]",
        "score": 509,
        "link": "https:\/\/defcon.org\/images\/defcon-26\/DEF%20CON%2026%20voting%20village%20report.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18112172"
    },
    {
        "title": "Original Source code for the Furby [pdf]",
        "score": 480,
        "link": "http:\/\/www.seanriddle.com\/furbysource.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17751599"
    },
    {
        "title": "Programming Paradigms for Dummies: What Every Programmer Should Know (2009) [pdf]",
        "score": 439,
        "link": "https:\/\/www.info.ucl.ac.be\/~pvr\/VanRoyChapter.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18381640"
    },
    {
        "title": "Selected Essays of Richard M. Stallman [pdf]",
        "score": 355,
        "link": "https:\/\/www.gnu.org\/philosophy\/fsfs\/rms-essays.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16927154"
    },
    {
        "title": "The Site Reliability Workbook: Practical Ways to Implement SRE [pdf]",
        "score": 351,
        "link": "https:\/\/services.google.com\/fh\/files\/misc\/the-site-reliability-workbook-next18.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17614907"
    },
    {
        "title": "Intel Analysis of Speculative Execution Side Channels [pdf]",
        "score": 346,
        "link": "https:\/\/newsroom.intel.com\/wp-content\/uploads\/sites\/11\/2018\/01\/Intel-Analysis-of-Speculative-Execution-Side-Channels.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16079910"
    },
    {
        "title": "Vipassana for Hackers [pdf]",
        "score": 345,
        "link": "https:\/\/github.com\/deobald\/vipassana-for-hackers\/blob\/master\/vipassana-for-hackers.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16842040"
    },
    {
        "title": "Writing Network Drivers in Rust [pdf]",
        "score": 326,
        "link": "https:\/\/www.net.in.tum.de\/fileadmin\/bibtex\/publications\/theses\/2018-ixy-rust.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18405515"
    },
    {
        "title": "NSA posters from the 50s and 60s [pdf]",
        "score": 322,
        "link": "http:\/\/www.governmentattic.org\/28docs\/NSAsecurityPosters_1950s-60s.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17222827"
    },
    {
        "title": "iOS 11 Security [pdf]",
        "score": 321,
        "link": "https:\/\/www.apple.com\/business\/docs\/iOS_Security_Guide.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16140418"
    },
    {
        "title": "Cognitive Distortions of People Who Get Stuff Done (2012) [pdf]",
        "score": 318,
        "link": "https:\/\/pdfs.semanticscholar.org\/presentation\/1a59\/7a9ca8b03d86ae9a2f86dd90e7bbff481fab.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17532360"
    },
    {
        "title": "Apple T2 Security Chip: Security Overview [pdf]",
        "score": 317,
        "link": "https:\/\/www.apple.com\/mac\/docs\/Apple_T2_Security_Chip_Overview.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18337825"
    },
    {
        "title": "Uber Self-Driving Car That Struck Pedestrian Wasn\u2019t Set to Stop in an Emergency",
        "score": 314,
        "link": "https:\/\/www.ntsb.gov\/investigations\/AccidentReports\/Reports\/HWY18MH010-prelim.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17144160"
    },
    {
        "title": "The Awk Programming Language (1988) [pdf]",
        "score": 314,
        "link": "https:\/\/ia802309.us.archive.org\/25\/items\/pdfy-MgN0H1joIoDVoIC7\/The_AWK_Programming_Language.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17140934"
    },
    {
        "title": "The $25B eigenvector (2006) [pdf]",
        "score": 311,
        "link": "https:\/\/www.rose-hulman.edu\/~bryan\/googleFinalVersionFixed.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16091646"
    },
    {
        "title": "Teach Yourself Logic: A Study Guide [pdf]",
        "score": 307,
        "link": "https:\/\/www.logicmatters.net\/resources\/pdfs\/TeachYourselfLogic2017.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18757972"
    },
    {
        "title": "A C89 compiler that produces executables that are also valid ASCII text files [pdf]",
        "score": 297,
        "link": "http:\/\/www.cs.cmu.edu\/~tom7\/abc\/paper.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16312317"
    },
    {
        "title": "Software-Defined Radio for Engineers [pdf]",
        "score": 292,
        "link": "http:\/\/www.analog.com\/media\/en\/training-seminars\/design-handbooks\/Software-Defined-Radio-for-Engineers-2018\/SDR4Engineers.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17399554"
    },
    {
        "title": "Notes on Discrete Mathematics (2017) [pdf]",
        "score": 287,
        "link": "http:\/\/www.cs.yale.edu\/homes\/aspnes\/classes\/202\/notes.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17391580"
    },
    {
        "title": "Set Theory and Algebra in CS: Introduction to Mathematical Modeling (2013) [pdf]",
        "score": 281,
        "link": "https:\/\/pdfs.semanticscholar.org\/d106\/6b6de601c1d7d5af25af3f7091bc7ad3ad51.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17840717"
    },
    {
        "title": "Testimony of Mark Zuckerberg \u2013 Hearing Before US House of Representatives [pdf]",
        "score": 280,
        "link": "http:\/\/docs.house.gov\/meetings\/IF\/IF00\/20180411\/108090\/HHRG-115-IF00-Wstate-ZuckerbergM-20180411.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16794058"
    },
    {
        "title": "Socioeconomic group classification based on user features [pdf]",
        "score": 279,
        "link": "http:\/\/pimg-faiw.uspto.gov\/fdd\/83\/2018\/28\/003\/0.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16866292"
    },
    {
        "title": " Apple Supplier List \u2013 Top 200 [pdf]",
        "score": 274,
        "link": "https:\/\/www.apple.com\/supplier-responsibility\/pdf\/Apple-Supplier-List.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18199170"
    },
    {
        "title": "Stellar Protocol: A Federated Model for Internet-Level Consensus (2016) [pdf]",
        "score": 263,
        "link": "https:\/\/www.stellar.org\/papers\/stellar-consensus-protocol.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16125920"
    },
    {
        "title": "How to Write a Technical Paper [pdf]",
        "score": 261,
        "link": "https:\/\/pdfs.semanticscholar.org\/441f\/ac7c2020e1c8f0d32adffca697bbb8a198a1.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18225197"
    },
    {
        "title": "The Making of Prince of Persia (2011) [pdf]",
        "score": 261,
        "link": "http:\/\/www.jordanmechner.com\/downloads\/makpopsample.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17845937"
    },
    {
        "title": "PID Without a PhD (2016) [pdf]",
        "score": 260,
        "link": "http:\/\/www.wescottdesign.com\/articles\/pid\/pidWithoutAPhd.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16257156"
    },
    {
        "title": "Principles of Algorithmic Problem Solving (2017) [pdf]",
        "score": 256,
        "link": "https:\/\/www.csc.kth.se\/~jsannemo\/slask\/main.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18287355"
    },
    {
        "title": "Public.resource.org wins appeal on right to publish the law [pdf]",
        "score": 248,
        "link": "https:\/\/www.cadc.uscourts.gov\/internet\/opinions.nsf\/533D47AF883C8194852582CD0052B8D4\/$file\/17-7035.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17579742"
    },
    {
        "title": "MIT Career Development Handbook [pdf]",
        "score": 248,
        "link": "https:\/\/gecd.mit.edu\/sites\/default\/files\/about\/files\/career-handbook.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17331316"
    },
    {
        "title": "Seven Puzzles You Think You Must Not Have Heard Correctly (2006) [pdf]",
        "score": 234,
        "link": "https:\/\/www.math.dartmouth.edu\/~pw\/solutions.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16998823"
    },
    {
        "title": "L-theanine, a constituent in tea, and its effect on mental state (2008) [pdf]",
        "score": 233,
        "link": "http:\/\/apjcn.nhri.org.tw\/server\/APJCN\/17%20Suppl%201\/\/167.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17644204"
    },
    {
        "title": "Self-Awareness for Introverts [pdf]",
        "score": 225,
        "link": "http:\/\/cliffc.org\/blog\/wp-content\/uploads\/2018\/05\/AWarOfWords.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17010199"
    },
    {
        "title": "House Oversight Committee Report on Equifax Breach [pdf]",
        "score": 221,
        "link": "https:\/\/oversight.house.gov\/wp-content\/uploads\/2018\/12\/Equifax-Report.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18651676"
    },
    {
        "title": "Apple File System Reference [pdf]",
        "score": 220,
        "link": "https:\/\/developer.apple.com\/support\/apple-file-system\/Apple-File-System-Reference.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18040742"
    },
    {
        "title": "The original pitch for Diablo (1994) [pdf]",
        "score": 219,
        "link": "http:\/\/www.graybeardgames.com\/download\/diablo_pitch.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16685795"
    },
    {
        "title": "Senator requests better https compliance at US Department of Defense [pdf]",
        "score": 216,
        "link": "https:\/\/www.wyden.senate.gov\/imo\/media\/doc\/wyden-web-encryption-letter-to-dod-cio.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17129093"
    },
    {
        "title": "Berkshire Hathaway 2017 Annual Letter [pdf]",
        "score": 216,
        "link": "http:\/\/www.berkshirehathaway.com\/letters\/2017ltr.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16453150"
    },
    {
        "title": "How to Be a Programmer: A Short, Comprehensive, and Personal Summary (2002) [pdf]",
        "score": 215,
        "link": "https:\/\/www.doc.ic.ac.uk\/~susan\/475\/HowToBeAProgrammer.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18742199"
    },
    {
        "title": "It Takes Two Neurons to Ride a Bicycle (2004)",
        "score": 212,
        "link": "http:\/\/paradise.caltech.edu\/~cook\/papers\/TwoNeurons.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16215130"
    },
    {
        "title": "United States v. Microsoft Corp. Dismissed [pdf]",
        "score": 207,
        "link": "https:\/\/www.supremecourt.gov\/opinions\/17pdf\/17-2_1824.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16858597"
    },
    {
        "title": "StarCraft: Remastered \u2013 Emulating a buffer overflow for fun and profit [pdf]",
        "score": 205,
        "link": "http:\/\/0xeb.net\/wp-content\/uploads\/2018\/02\/StarCraft_EUD_Emulator.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16305769"
    },
    {
        "title": "How to find hidden cameras (2002) [pdf]",
        "score": 203,
        "link": "http:\/\/www.tentacle.franken.de\/papers\/hiddencams.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16381592"
    },
    {
        "title": "The Evolution of C Programming Practices: A Study of Unix (2016) [pdf]",
        "score": 203,
        "link": "https:\/\/www2.dmst.aueb.gr\/dds\/pubs\/conf\/2016-ICSE-ProgEvol\/html\/SLK16.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17046332"
    },
    {
        "title": "Blockchains from a Distributed Computing Perspective [pdf]",
        "score": 202,
        "link": "http:\/\/cs.brown.edu\/courses\/csci2952-a\/papers\/perspective.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16191506"
    },
    {
        "title": "How to Architect a Query Compiler, Revisited [pdf]",
        "score": 201,
        "link": "https:\/\/www.cs.purdue.edu\/homes\/rompf\/papers\/tahboub-sigmod18.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17851941"
    },
    {
        "title": "Foundations of Data Science [pdf]",
        "score": 198,
        "link": "http:\/\/www.cs.cornell.edu\/jeh\/book.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17131941"
    },
    {
        "title": "A Wandering Mind Is an Unhappy Mind (2010) [pdf]",
        "score": 197,
        "link": "https:\/\/greatergood.berkeley.edu\/images\/application_uploads\/KILLINGSWORTH-WanderingMind.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16797947"
    },
    {
        "title": "Comparing Languages for Engineering Server Software: Erlang, Go, and Scala\/Akka [pdf]",
        "score": 194,
        "link": "http:\/\/www.dcs.gla.ac.uk\/~trinder\/papers\/sac-18.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17342276"
    },
    {
        "title": "Bumper Sticker Computer Science (1985) [pdf]",
        "score": 193,
        "link": "http:\/\/www.bowdoin.edu\/~ltoma\/teaching\/cs340\/spring05\/coursestuff\/Bentley_BumperSticker.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17794507"
    },
    {
        "title": "Facebook Q1 2018 Earnings Slides [pdf]",
        "score": 191,
        "link": "https:\/\/investor.fb.com\/files\/doc_financials\/2018\/Q1\/Q1-2018-Earnings-Presentation-(1).pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16925671"
    },
    {
        "title": "Introduction to OS Abstractions Using Plan 9 from Bell Labs (2007) [pdf]",
        "score": 191,
        "link": "https:\/\/lsub.org\/who\/nemo\/9.intro.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16253193"
    },
    {
        "title": "Microsoft Word for Windows 1.0 Postmortem (1989) [pdf]",
        "score": 190,
        "link": "http:\/\/antitrust.slated.org\/www.iowaconsumercase.org\/011607\/8000\/PX08875.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18764790"
    },
    {
        "title": "Architecture of a Database System (2007) [pdf]",
        "score": 189,
        "link": "http:\/\/db.cs.berkeley.edu\/papers\/fntdb07-architecture.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17190947"
    },
    {
        "title": "Money creation in the modern economy (2014) [pdf]",
        "score": 189,
        "link": "https:\/\/www.bankofengland.co.uk\/-\/media\/boe\/files\/quarterly-bulletin\/2014\/money-creation-in-the-modern-economy.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16604251"
    },
    {
        "title": "Exploiting modern microarchitectures: Meltdown, Spectre, and other attacks [pdf]",
        "score": 189,
        "link": "http:\/\/people.redhat.com\/jcm\/talks\/FOSDEM_2018.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16304460"
    },
    {
        "title": "Bayes\u2019 Theorem in the 21st Century (2013) [pdf]",
        "score": 185,
        "link": "http:\/\/web.ipac.caltech.edu\/staff\/fmasci\/home\/astro_refs\/Science-2013-Efron.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18213117"
    },
    {
        "title": "How to scale a distributed system [pdf]",
        "score": 184,
        "link": "https:\/\/cdn.oreillystatic.com\/en\/assets\/1\/event\/244\/How%20to%20scale%20a%20distributed%20system%20Presentation.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17529780"
    },
    {
        "title": "How to write Mathematics (1970) [pdf]",
        "score": 182,
        "link": "http:\/\/www.math.utah.edu\/~pa\/3000\/halmos.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16829440"
    },
    {
        "title": "How Rust Is Tilde\u2019s Competitive Advantage [pdf]",
        "score": 177,
        "link": "https:\/\/www.rust-lang.org\/pdfs\/Rust-Tilde-Whitepaper.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16317722"
    },
    {
        "title": "Rendered Insecure: GPU Side Channel Attacks Are Practical [pdf]",
        "score": 174,
        "link": "http:\/\/www.cs.ucr.edu\/~zhiyunq\/pub\/ccs18_gpu_side_channel.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18449672"
    },
    {
        "title": "The Rate of Return on Everything, 1870\u20132015 [pdf]",
        "score": 168,
        "link": "https:\/\/www.frbsf.org\/economic-research\/files\/wp2017-25.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16078059"
    },
    {
        "title": "Speech and Language Processing, 3rd Edition [pdf]",
        "score": 167,
        "link": "https:\/\/web.stanford.edu\/~jurafsky\/slp3\/ed3book.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16104868"
    },
    {
        "title": "MtGox: Announcement of Commencement of Civil Rehabilitation Proceedings [pdf]",
        "score": 167,
        "link": "https:\/\/www.mtgox.com\/img\/pdf\/20180622_announcement_en.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17373857"
    },
    {
        "title": "Towards a Type System for Containers and AWS Lambda to Avoid Failures [pdf]",
        "score": 167,
        "link": "http:\/\/christophermeiklejohn.com\/publications\/hotedge-2018-containers-preprint.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16746315"
    },
    {
        "title": "Alphabet Announces Second Quarter 2018 Results [pdf]",
        "score": 166,
        "link": "https:\/\/abc.xyz\/investor\/pdf\/2018Q2_alphabet_earnings_release.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17595510"
    },
    {
        "title": "Evolution of Emacs Lisp [pdf]",
        "score": 165,
        "link": "https:\/\/www.iro.umontreal.ca\/~monnier\/hopl-4-emacs-lisp.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18267285"
    },
    {
        "title": "Kademlia: A Peer-To-peer Information System Based on the XOR Metric (2002) [pdf]",
        "score": 165,
        "link": "https:\/\/pdos.csail.mit.edu\/~petar\/papers\/maymounkov-kademlia-lncs.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18711980"
    },
    {
        "title": "Deep image reconstruction from human brain activity [pdf]",
        "score": 165,
        "link": "https:\/\/www.biorxiv.org\/content\/biorxiv\/early\/2017\/12\/30\/240317.full.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16140054"
    },
    {
        "title": "A Lisp Way to Type Theory and Formal Proofs (2017) [pdf]",
        "score": 164,
        "link": "https:\/\/www.european-lisp-symposium.org\/static\/2017\/peschanski.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18383654"
    },
    {
        "title": "Computer Science I [pdf]",
        "score": 163,
        "link": "http:\/\/cse.unl.edu\/~cbourke\/ComputerScienceOne.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16053015"
    },
    {
        "title": "IEEE Position Statement in Support of Strong Encryption [pdf]",
        "score": 162,
        "link": "http:\/\/globalpolicy.ieee.org\/wp-content\/uploads\/2018\/06\/IEEE18006.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17408494"
    },
    {
        "title": "The Economic Limits of Bitcoin and the Blockchain [pdf]",
        "score": 161,
        "link": "http:\/\/faculty.chicagobooth.edu\/eric.budish\/research\/Economic-Limits-Bitcoin-Blockchain.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17394262"
    },
    {
        "title": "Show HN: Software Architecture, all you need to know [pdf]",
        "score": 161,
        "link": "https:\/\/share.composieux.fr\/white-book-software-architecture.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18761609"
    },
    {
        "title": "Math from Three to Seven: The Story of a Mathematical Circle for Preschoolers [pdf]",
        "score": 161,
        "link": "http:\/\/www.msri.org\/people\/staff\/levy\/files\/MCL\/Zvonkin.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17018583"
    },
    {
        "title": "Breakout implemented in JavaScript in a PDF",
        "score": 160,
        "link": "https:\/\/rawgit.com\/osnr\/horrifying-pdf-experiments\/master\/breakout.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17915296"
    },
    {
        "title": "The Mathematics of Quantum Mechanics [pdf]",
        "score": 160,
        "link": "https:\/\/uwaterloo.ca\/institute-for-quantum-computing\/sites\/ca.institute-for-quantum-computing\/files\/uploads\/files\/mathematics_qm_v21.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18046343"
    },
    {
        "title": "Going IPv6 Only [pdf]",
        "score": 158,
        "link": "https:\/\/pc.nanog.org\/static\/published\/meetings\/NANOG73\/1645\/20180625_Lagerholm_T-Mobile_S_Journey_To_v1.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17399884"
    },
    {
        "title": "The Basic Ideas in Neural Networks (1994) [pdf]",
        "score": 155,
        "link": "http:\/\/www-isl.stanford.edu\/~widrow\/papers\/j1994thebasic.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16112464"
    },
    {
        "title": "NIST: Blockchain Technology Overview [pdf]",
        "score": 154,
        "link": "https:\/\/nvlpubs.nist.gov\/nistpubs\/ir\/2018\/NIST.IR.8202.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18157363"
    },
    {
        "title": "Do you need a blockchain?",
        "score": 153,
        "link": "https:\/\/eprint.iacr.org\/2017\/375.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16315456"
    },
    {
        "title": "Writing Network Drivers in Go [pdf]",
        "score": 152,
        "link": "https:\/\/www.net.in.tum.de\/fileadmin\/bibtex\/publications\/theses\/2018-ixy-go.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18399389"
    },
    {
        "title": "Introduction to Functional Programming (1988) [pdf]",
        "score": 150,
        "link": "http:\/\/usi-pl.github.io\/lc\/sp-2015\/doc\/Bird_Wadler.%20Introduction%20to%20Functional%20Programming.1ed.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16471372"
    },
    {
        "title": "DeepLog: Anomaly Detection and Diagnosis from System Logs (2017) [pdf]",
        "score": 149,
        "link": "https:\/\/acmccs.github.io\/papers\/p1285-duA.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17506265"
    },
    {
        "title": "Firefox: The Effect of Ad Blocking on User Engagement with the Web [pdf]",
        "score": 149,
        "link": "https:\/\/research.mozilla.org\/files\/2018\/04\/The-Effect-of-Ad-Blocking-on-User-Engagement-with-the-Web.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18105375"
    },
    {
        "title": "Setting Up a Cayman Islands Company [pdf]",
        "score": 147,
        "link": "https:\/\/www.stuartslaw.com\/cms\/document\/Setting_up_a_Cayman_Islands_Company.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16807765"
    },
    {
        "title": "The Jury Is In: Monolithic OS Design Is Flawed [pdf]",
        "score": 147,
        "link": "http:\/\/ts.data61.csiro.au\/publications\/csiro_full_text\/Biggs_LH_18.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17767060"
    },
    {
        "title": "Modern Code Review: A Case Study at Google [pdf]",
        "score": 146,
        "link": "https:\/\/sback.it\/publications\/icse2018seip.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18035548"
    },
    {
        "title": "Analysis of USB fan given to journalists at North Korea-Singapore Summit [pdf]",
        "score": 145,
        "link": "http:\/\/www.cl.cam.ac.uk\/~sps32\/usb_fan_report.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17459041"
    },
    {
        "title": "Email exchange between MIT Media Lab and the IOTA Foundation [pdf]",
        "score": 144,
        "link": "http:\/\/www.tangleblog.com\/wp-content\/uploads\/2018\/02\/letters.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16457120"
    },
    {
        "title": "Linear logic and deep learning [pdf]",
        "score": 142,
        "link": "http:\/\/therisingsea.org\/notes\/talk-lldl-transcript.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16255612"
    },
    {
        "title": "Reviving Smalltalk-78 (2014) [pdf]",
        "score": 142,
        "link": "http:\/\/freudenbergs.de\/bert\/publications\/Ingalls-2014-Smalltalk78.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17055960"
    },
    {
        "title": "Bandit Algorithms Book [pdf]",
        "score": 141,
        "link": "http:\/\/downloads.tor-lattimore.com\/banditbook\/book.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17642564"
    },
    {
        "title": "Why Philosophers Should Care About Computational Complexity (2011) [pdf]",
        "score": 140,
        "link": "https:\/\/www.scottaaronson.com\/papers\/philos.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17573142"
    },
    {
        "title": "Log(Graph): A Near-Optimal High-Performance Graph Representation (2018) [pdf]",
        "score": 140,
        "link": "https:\/\/people.csail.mit.edu\/jshun\/papers\/loggraph.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18081978"
    },
    {
        "title": "Seven Pillars of Causal Reasoning with Reflections on Machine Learning [pdf]",
        "score": 140,
        "link": "http:\/\/ftp.cs.ucla.edu\/pub\/stat_ser\/r481.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17187306"
    },
    {
        "title": "The physics of baking good pizza [pdf]",
        "score": 140,
        "link": "https:\/\/arxiv.org\/ftp\/arxiv\/papers\/1806\/1806.08790.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17437229"
    },
    {
        "title": "Get Billions of Correct Digits of Pi from a Wrong Formula (1999) [pdf]",
        "score": 140,
        "link": "https:\/\/academics.rowan.edu\/csm\/departments\/math\/facultystaff\/faculty\/osler\/Billions_pi_digits.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18040630"
    },
    {
        "title": "Advanced Data Analysis from an Elementary Point of View (2017) [pdf]",
        "score": 139,
        "link": "http:\/\/www.stat.cmu.edu\/~cshalizi\/ADAfaEPoV\/ADAfaEPoV.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16410936"
    },
    {
        "title": "Freenet: A Distributed Anonymous Information Storage and Retrieval System (2000) [pdf]",
        "score": 138,
        "link": "http:\/\/snap.stanford.edu\/class\/cs224w-readings\/clarke00freenet.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18709383"
    },
    {
        "title": "The Simple Essence of Automatic Differentiation [pdf]",
        "score": 137,
        "link": "http:\/\/conal.net\/papers\/essence-of-ad\/essence-of-ad-icfp.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18306860"
    },
    {
        "title": "Programming Paradigms and Beyond [pdf]",
        "score": 137,
        "link": "http:\/\/cs.brown.edu\/~sk\/Publications\/Papers\/Published\/kf-prog-paradigms-and-beyond\/paper.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17382365"
    },
    {
        "title": "Alphabet Q1 2018 Earnings [pdf]",
        "score": 135,
        "link": "https:\/\/abc.xyz\/investor\/pdf\/2018Q1_alphabet_earnings_release.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16907007"
    },
    {
        "title": "State of Multicore OCaml [pdf]",
        "score": 135,
        "link": "http:\/\/kcsrk.info\/slides\/mcocaml_gallium.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17416797"
    },
    {
        "title": "The Meta-Problem of Consciousness [pdf]",
        "score": 131,
        "link": "https:\/\/philpapers.org\/archive\/CHATMO-32.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16360199"
    },
    {
        "title": "What do Stanford CS PhD students think of their PhD program? [pdf]",
        "score": 130,
        "link": "https:\/\/archive.org\/download\/phd_student_survey_summary_report_0a5c\/phd_student_survey_summary_report_0a5c.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17493963"
    },
    {
        "title": "The weird and wonderful world of constructive mathematics (2017) [pdf]",
        "score": 130,
        "link": "https:\/\/home.sandiego.edu\/~shulman\/papers\/rabbithole.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18411935"
    },
    {
        "title": "Low-Latency Video Processing Using Thousands of Tiny Threads [pdf]",
        "score": 130,
        "link": "https:\/\/www.usenix.org\/system\/files\/conference\/nsdi17\/nsdi17-fouladi.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16197253"
    },
    {
        "title": "Self-encrypting deception: weaknesses in the encryption of solid state drives [pdf]",
        "score": 129,
        "link": "https:\/\/www.ru.nl\/publish\/pages\/909275\/draft-paper_1.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18382975"
    },
    {
        "title": "C++ Core Coroutines Proposal [pdf]",
        "score": 128,
        "link": "http:\/\/www.open-std.org\/jtc1\/sc22\/wg21\/docs\/papers\/2018\/p1063r0.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18036748"
    },
    {
        "title": "Power Laws and Rich-Get-Richer Phenomena (2010) [pdf]",
        "score": 127,
        "link": "http:\/\/www.cs.cornell.edu\/home\/kleinber\/networks-book\/networks-book-ch18.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17199766"
    },
    {
        "title": "A Taste of Linear Logic (1993) [pdf]",
        "score": 126,
        "link": "https:\/\/homepages.inf.ed.ac.uk\/wadler\/papers\/lineartaste\/lineartaste-revised.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17641476"
    },
    {
        "title": "An Analysis of the Impact of Arbitrary Blockchain Content on Bitcoin [pdf]",
        "score": 125,
        "link": "https:\/\/fc18.ifca.ai\/preproceedings\/6.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16617136"
    },
    {
        "title": "PolarFS: Alibaba Distributed File System for Shared Storage Cloud Database [pdf]",
        "score": 122,
        "link": "http:\/\/www.vldb.org\/pvldb\/vol11\/p1849-cao.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17814185"
    },
    {
        "title": "Notation as a Tool of Thought (1979) [pdf]",
        "score": 121,
        "link": "http:\/\/www.eecg.toronto.edu\/~jzhu\/csc326\/readings\/iverson.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16842378"
    },
    {
        "title": "Mindfulness Meditation Impairs Task Motivation but Not Performance [pdf]",
        "score": 120,
        "link": "https:\/\/sci-hub.tw\/downloads\/2310\/10.1016@j.obhdp.2018.05.001.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17342639"
    },
    {
        "title": "Fallacies of Distributed Computing Explained (2006) [pdf]",
        "score": 119,
        "link": "http:\/\/www.rgoarchitects.com\/Files\/fallacies.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17505927"
    },
    {
        "title": "Fuzzing the OpenBSD Kernel [pdf]",
        "score": 119,
        "link": "https:\/\/www.openbsd.org\/papers\/fuzz-slides.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17929234"
    },
    {
        "title": "The conceptual origins of Maxwell's equations and gauge theory (2014) [pdf]",
        "score": 117,
        "link": "http:\/\/www.physics.umd.edu\/grt\/taj\/675e\/OriginsofMaxwellandGauge.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16325605"
    },
    {
        "title": "The Birth of Prolog (1992) [pdf]",
        "score": 117,
        "link": "https:\/\/web.stanford.edu\/class\/linguist289\/p37-colmerauer.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18178215"
    },
    {
        "title": "Is IPv6 only for the Rich? [pdf]",
        "score": 116,
        "link": "https:\/\/ripe76.ripe.net\/presentations\/9-2018-05-17-ipv6-reasons.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17060437"
    },
    {
        "title": "One parameter is always enough [pdf]",
        "score": 116,
        "link": "http:\/\/colala.bcs.rochester.edu\/papers\/piantadosi2018one.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17161032"
    },
    {
        "title": "A Plan 9 C compiler for RISC-V [pdf]",
        "score": 115,
        "link": "https:\/\/www.geeklan.co.uk\/files\/oshug69-Miller-criscv.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18308255"
    },
    {
        "title": "Security Analysis of WireGuard [pdf]",
        "score": 115,
        "link": "https:\/\/courses.csail.mit.edu\/6.857\/2018\/project\/He-Xu-Xu-WireGuard.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17883269"
    },
    {
        "title": "Automatic Differentiation in Machine Learning: A Survey [pdf]",
        "score": 114,
        "link": "http:\/\/jmlr.org\/papers\/volume18\/17-468\/17-468.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18491208"
    },
    {
        "title": "Pledge and Unveil in OpenBSD [pdf]",
        "score": 114,
        "link": "https:\/\/www.openbsd.org\/papers\/BeckPledgeUnveilBSDCan2018.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17277067"
    },
    {
        "title": "Using Prediction Markets to Track Information Flows:  Evidence from Google [pdf]",
        "score": 113,
        "link": "https:\/\/www.stat.berkeley.edu\/users\/aldous\/157\/Papers\/GooglePredictionMarketPaper.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17015055"
    },
    {
        "title": "There\u2019s a Hole in the Bottom of the C: Effectiveness of Allocation Protection [pdf]",
        "score": 113,
        "link": "http:\/\/web.mit.edu\/ha22286\/www\/papers\/SecDev18.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18442578"
    },
    {
        "title": "NetSpectre: Read Arbitrary Memory Over Network [pdf]",
        "score": 112,
        "link": "https:\/\/misc0110.net\/web\/files\/netspectre.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17621823"
    },
    {
        "title": "The Byzantine Generals Problem (1982) [pdf]",
        "score": 112,
        "link": "https:\/\/lamport.azurewebsites.net\/pubs\/byz.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17702640"
    },
    {
        "title": "A plea for lean software (1995) [pdf]",
        "score": 111,
        "link": "https:\/\/cr.yp.to\/bib\/1995\/wirth.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17872400"
    },
    {
        "title": "Abstract of the NTSB Report on Air Canada flight 759's taxiway overflight at SFO [pdf]",
        "score": 111,
        "link": "https:\/\/ntsb.gov\/news\/events\/Documents\/DCA17IA148-Abstract.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18071966"
    },
    {
        "title": "Motorola M68000 Family Programmer\u2019s Reference Manual (1992) [pdf]",
        "score": 110,
        "link": "http:\/\/cache.nxp.com\/docs\/en\/reference-manual\/M68000PM.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17076962"
    },
    {
        "title": "Dissecting QNX [pdf]",
        "score": 110,
        "link": "https:\/\/www.blackhat.com\/docs\/asia-18\/asia-18-Wetzels_Abassi_dissecting_qnx__WP.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18013158"
    },
    {
        "title": "The Foundations of Mathematics (2007) [pdf]",
        "score": 109,
        "link": "https:\/\/www.math.wisc.edu\/~miller\/old\/m771-10\/kunen770.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16078514"
    },
    {
        "title": "Oberon System Implemented on a Low-Cost FPGA Board (2015) [pdf]",
        "score": 109,
        "link": "https:\/\/pdfs.semanticscholar.org\/2c11\/7c1456eb96bbea19aa3c8b018de4fc9387bc.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17933881"
    },
    {
        "title": "Why Minimal Guidance During Instruction Does Not Work (2006) [pdf]",
        "score": 109,
        "link": "http:\/\/www.cogtech.usc.edu\/publications\/kirschner_Sweller_Clark.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18217245"
    },
    {
        "title": "Efficient Methods and Hardware for Deep Learning [pdf]",
        "score": 109,
        "link": "http:\/\/cs231n.stanford.edu\/slides\/2017\/cs231n_2017_lecture15.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17617870"
    },
    {
        "title": "Google\u2019s secret and Linear Algebra (2004) [pdf]",
        "score": 107,
        "link": "http:\/\/verso.mat.uam.es\/~pablo.fernandez\/ems63-pablo-fernandez_final.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18298608"
    },
    {
        "title": "The Art of Approximation in Science and Engineering [pdf]",
        "score": 106,
        "link": "http:\/\/web.mit.edu\/6.055\/book\/book-draft.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18099596"
    },
    {
        "title": "Towards an optical FPGA \u2013 Programmable silicon photonic circuits [pdf]",
        "score": 106,
        "link": "https:\/\/arxiv.org\/ftp\/arxiv\/papers\/1807\/1807.01656.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17488838"
    },
    {
        "title": "Pythran: Crossing the Python Frontier [pdf]",
        "score": 105,
        "link": "https:\/\/www.computer.org\/csdl\/mags\/cs\/2018\/02\/mcs2018020083.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16910446"
    },
    {
        "title": "What's hidden in the hidden layers? (1989) [pdf]",
        "score": 105,
        "link": "https:\/\/www.cs.cmu.edu\/~dst\/pubs\/byte-hiddenlayer-1989.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16048710"
    },
    {
        "title": "The Haskell School of Music \u2013 From Signals to Symphonies (2014) [pdf]",
        "score": 105,
        "link": "http:\/\/haskell.cs.yale.edu\/wp-content\/uploads\/2015\/03\/HSoM.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17517285"
    },
    {
        "title": "Giftedness and Genius: Crucial Differences (1996) [pdf]",
        "score": 105,
        "link": "https:\/\/www.gwern.net\/docs\/iq\/1996-jensen.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16350293"
    },
    {
        "title": "Sketchpad: A man-machine graphical communication system (1963) [pdf]",
        "score": 104,
        "link": "https:\/\/www.cl.cam.ac.uk\/techreports\/UCAM-CL-TR-574.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17354764"
    },
    {
        "title": "The Future of Computing: Logic or Biology (2003) [pdf]",
        "score": 104,
        "link": "https:\/\/lamport.azurewebsites.net\/pubs\/future-of-computing.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17457213"
    },
    {
        "title": "Predicting Price Changes in Ethereum (2017) [pdf]",
        "score": 104,
        "link": "http:\/\/cs229.stanford.edu\/proj2017\/final-reports\/5244039.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17272328"
    },
    {
        "title": "An Introduction to Mathematical Optimal Control Theory [pdf]",
        "score": 103,
        "link": "https:\/\/math.berkeley.edu\/~evans\/control.course.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17585777"
    },
    {
        "title": "Mindstorms: Children, Computers, and Powerful Ideas (1980) [pdf]",
        "score": 103,
        "link": "http:\/\/worrydream.com\/refs\/Papert%20-%20Mindstorms%201st%20ed.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18361665"
    },
    {
        "title": "Functional Bits: Lambda-calculus based algorithmic information theory [pdf]",
        "score": 103,
        "link": "https:\/\/tromp.github.io\/cl\/LC.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17726545"
    },
    {
        "title": "The Effects of Computer Use on Eye Health and Vision (1997) [pdf]",
        "score": 102,
        "link": "https:\/\/www.aoa.org\/Documents\/optometrists\/effects-of-computer-use.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16146106"
    },
    {
        "title": "Actor Model of Computation (2010) [pdf]",
        "score": 102,
        "link": "https:\/\/arxiv.org\/vc\/arxiv\/papers\/1008\/1008.1459v8.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17667323"
    },
    {
        "title": "Exploiting URL Parser in Programming Languages (2017) [pdf]",
        "score": 102,
        "link": "https:\/\/www.blackhat.com\/docs\/us-17\/thursday\/us-17-Tsai-A-New-Era-Of-SSRF-Exploiting-URL-Parser-In-Trending-Programming-Languages.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17955626"
    },
    {
        "title": "Border Search of Electronic Devices \u2013 CBP Directive [pdf]",
        "score": 101,
        "link": "https:\/\/www.cbp.gov\/sites\/default\/files\/assets\/documents\/2018-Jan\/cbp-directive-3340-049a-border-search-electronic-media.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16084820"
    },
    {
        "title": "Physics as a Way of Thinking (1936) [pdf]",
        "score": 101,
        "link": "https:\/\/kb.osu.edu\/dspace\/bitstream\/handle\/1811\/72567\/OSLJ_V2N3_0241.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17396205"
    },
    {
        "title": "Web Prolog and the Programmable Prolog Web [pdf]",
        "score": 100,
        "link": "https:\/\/github.com\/Web-Prolog\/swi-web-prolog\/blob\/master\/web-client\/apps\/swish\/web-prolog.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17288493"
    },
    {
        "title": "Fifty Years of Shannon Theory (1998) [pdf]",
        "score": 100,
        "link": "https:\/\/www.princeton.edu\/~verdu\/reprints\/IT44.6.2057-2078.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16130297"
    },
    {
        "title": "Unskilled and Unaware of It (1999) [pdf]",
        "score": 99,
        "link": "http:\/\/psych.colorado.edu\/~vanboven\/teaching\/p7536_heurbias\/p7536_readings\/kruger_dunning.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16125060"
    },
    {
        "title": "Non-Recursive Make Considered Harmful: Build Systems at Scale (2016) [pdf]",
        "score": 99,
        "link": "https:\/\/ndmitchell.com\/downloads\/paper-non_recursive_make_considered_harmful-22_sep_2016.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17088328"
    },
    {
        "title": "Debugging across pipes and sockets with strace [pdf]",
        "score": 98,
        "link": "https:\/\/github.com\/nh2\/strace-pipes-presentation\/blob\/master\/presentation\/Debugging%20across%20pipes%20and%20sockets%20with%20strace.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16708392"
    },
    {
        "title": "A History of the Erlang VM (2011) [pdf]",
        "score": 97,
        "link": "http:\/\/www.erlang-factory.com\/upload\/presentations\/389\/EFSF11-ErlangVM.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16214996"
    },
    {
        "title": "How to do with probabilities what people say you can\u2019t (1985) [pdf]",
        "score": 97,
        "link": "https:\/\/ftp.cs.ucla.edu\/pub\/stat_ser\/r49.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18663223"
    },
    {
        "title": "Police Use of Force: An Examination of Modern Policing Practices [pdf]",
        "score": 97,
        "link": "https:\/\/www.usccr.gov\/pubs\/2018\/11-15-Police-Force.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18546038"
    },
    {
        "title": "Single-decryption EM-based attack reveals private keys from Android phones [pdf]",
        "score": 97,
        "link": "https:\/\/www.usenix.org\/system\/files\/conference\/usenixsecurity18\/sec18-alam.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17817966"
    },
    {
        "title": "Efficient Hot-Water Piping (2013) [pdf]",
        "score": 95,
        "link": "http:\/\/www.garykleinassociates.com\/PDFs\/15%20-%20Efficient%20Hot-Water%20Piping-JLC.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16540802"
    },
    {
        "title": "Scientists warn of potential serious health effects of 5G (2017) [pdf]",
        "score": 95,
        "link": "https:\/\/ehtrust.org\/wp-content\/uploads\/Scientist-5G-appeal-2017.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17967372"
    },
    {
        "title": "A micro manual for Lisp \u2013 Not the whole truth (1978) [pdf]",
        "score": 95,
        "link": "http:\/\/www.ee.ryerson.ca\/~elf\/pub\/misc\/micromanualLISP.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17958413"
    },
    {
        "title": "Everything You Wanted to Know About Synchronization (2013) [pdf]",
        "score": 95,
        "link": "http:\/\/sigops.org\/sosp\/sosp13\/papers\/p33-david.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16859719"
    },
    {
        "title": "The Strong Free Will Theorem (2009) [pdf]",
        "score": 94,
        "link": "http:\/\/www.ams.org\/notices\/200902\/rtx090200226p.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18392040"
    },
    {
        "title": "The art of Virtual Analog filter design [pdf]",
        "score": 93,
        "link": "https:\/\/www.native-instruments.com\/fileadmin\/ni_media\/downloads\/pdf\/VAFilterDesign_2.1.0.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18346463"
    },
    {
        "title": "Human-Centric Tools for Navigating Code [pdf]",
        "score": 93,
        "link": "http:\/\/web.eecs.utk.edu\/~azh\/pubs\/Henley2018bDissertation.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18648580"
    },
    {
        "title": "Every Good Regulator of a System Must Be a Model of That System (1970) [pdf]",
        "score": 92,
        "link": "http:\/\/pespmc1.vub.ac.be\/books\/Conant_Ashby.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16545537"
    },
    {
        "title": "Case Studies Where Phase 2 and Phase 3 Trials had Divergent Results [pdf]",
        "score": 92,
        "link": "https:\/\/www.fda.gov\/downloads\/AboutFDA\/ReportsManualsForms\/Reports\/UCM535780.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17568712"
    },
    {
        "title": "802.11 with Multiple Antennas for Dummies (2009) [pdf]",
        "score": 92,
        "link": "https:\/\/djw.cs.washington.edu\/papers\/mimo_for_dummies.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17290302"
    },
    {
        "title": "Self-Regulated Learning: Beliefs, Techniques, and Illusions [pdf]",
        "score": 92,
        "link": "http:\/\/www.excaliburtsa.org.uk\/wp-content\/uploads\/2017\/11\/Self-regulated-learning-Bjork.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17462633"
    },
    {
        "title": "Scikit-learn user guide (2017) [pdf]",
        "score": 92,
        "link": "http:\/\/scikit-learn.org\/stable\/_downloads\/scikit-learn-docs.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17430673"
    },
    {
        "title": "$vau: the ultimate abstraction (2010) [pdf]",
        "score": 92,
        "link": "https:\/\/web.wpi.edu\/Pubs\/ETD\/Available\/etd-090110-124904\/unrestricted\/jshutt.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18405014"
    },
    {
        "title": "Design of a low-level C++ template SIMD library [pdf]",
        "score": 91,
        "link": "https:\/\/www.ti.uni-bielefeld.de\/downloads\/publications\/templateSIMD.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16050021"
    },
    {
        "title": "A Template for Understanding How the Economic Machine Works (2011) [pdf]",
        "score": 91,
        "link": "https:\/\/media.economist.com\/sites\/default\/files\/pdfs\/A_Template_for_Understanding_-_Ray_Dalio__Bridgewater.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17962136"
    },
    {
        "title": "Do Developers Understand IEEE Floating Point? [pdf]",
        "score": 91,
        "link": "http:\/\/pdinda.org\/Papers\/ipdps18.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18761944"
    },
    {
        "title": "Collective hallucination and inefficient markets: The Railway Mania of the 1840s [pdf]",
        "score": 91,
        "link": "http:\/\/www.dtc.umn.edu\/~odlyzko\/doc\/hallucinations.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16145157"
    },
    {
        "title": "Newton\u2019s Financial Misadventures in the South Sea Bubble [pdf]",
        "score": 91,
        "link": "http:\/\/www.dtc.umn.edu\/~odlyzko\/doc\/mania13.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16245284"
    },
    {
        "title": "MeltdownPrime, SpectrePrime: Exploiting Invalidation-Based Coherence Protocols",
        "score": 90,
        "link": "https:\/\/arxiv.org\/pdf\/1802.03802.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16430215"
    },
    {
        "title": "JITing PostgreSQL using LLVM [pdf]",
        "score": 90,
        "link": "http:\/\/anarazel.de\/talks\/fosdem-2018-02-03\/jit.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16299632"
    },
    {
        "title": "The Evolution of Bitcoin Hardware [pdf]",
        "score": 89,
        "link": "http:\/\/cseweb.ucsd.edu\/~mbtaylor\/papers\/Taylor_Bitcoin_IEEE_Computer_2017.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16289074"
    },
    {
        "title": "Everything You Always Wanted to Know About Optical Networking [pdf]",
        "score": 89,
        "link": "https:\/\/www.nanog.org\/sites\/default\/files\/Steenbergen.Everything_You_Need.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18099304"
    },
    {
        "title": "Cross-Platform Language Design [pdf]",
        "score": 89,
        "link": "http:\/\/lampwww.epfl.ch\/~doeraene\/thesis\/doeraene-thesis-2018-cross-platform-language-design.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18640515"
    },
    {
        "title": "The Evolution of Operating Systems (2000) [pdf]",
        "score": 88,
        "link": "http:\/\/www.brinch-hansen.net\/papers\/2001b.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17581530"
    },
    {
        "title": "The Z Garbage Collector: An Introduction [pdf]",
        "score": 88,
        "link": "https:\/\/fosdem.org\/2018\/schedule\/event\/zgc\/attachments\/slides\/2211\/export\/events\/attachments\/zgc\/slides\/2211\/ZGC_FOSDEM_2018.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16405852"
    },
    {
        "title": "Nagini: A Static Verifier for Python [pdf]",
        "score": 87,
        "link": "http:\/\/pm.inf.ethz.ch\/publications\/getpdf.php?bibname=Own&id=EilersMueller18.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17535752"
    },
    {
        "title": "Mininet on OpenBSD: Interactive SDN Testing and Development [pdf]",
        "score": 86,
        "link": "https:\/\/www.openbsd.org\/papers\/bsdcan2018-mininet.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17301835"
    },
    {
        "title": "Design and Implementation of a 256-Core BrainFuck Computer [pdf]",
        "score": 86,
        "link": "http:\/\/sigtbd.csail.mit.edu\/pubs\/veryconference-paper2.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16866435"
    },
    {
        "title": "Logic is Metaphysics (2011) [pdf]",
        "score": 85,
        "link": "https:\/\/philpapers.org\/archive\/ALVLIM-3.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17246944"
    },
    {
        "title": "On the rheology of cats (2014) [pdf]",
        "score": 85,
        "link": "https:\/\/www.drgoulu.com\/wp-content\/uploads\/2017\/09\/Rheology-of-cats.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18540550"
    },
    {
        "title": "What you get is what you C: Controlling side effects in mainstream C compilers [pdf]",
        "score": 85,
        "link": "http:\/\/www.cl.cam.ac.uk\/~rja14\/Papers\/whatyouc.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16911185"
    },
    {
        "title": "TensorFlow: Machine Learning on Heterogeneous Distributed Systems (2015) [pdf]",
        "score": 85,
        "link": "https:\/\/static.googleusercontent.com\/media\/research.google.com\/en\/\/pubs\/archive\/45166.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17028631"
    },
    {
        "title": "LegoOS: Disseminated, Distributed OS for Hardware Resource Disaggregation [pdf]",
        "score": 85,
        "link": "https:\/\/www.usenix.org\/system\/files\/osdi18-shan.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18488292"
    },
    {
        "title": "The usefulness of useless knowledge (1939) [pdf]",
        "score": 84,
        "link": "https:\/\/library.ias.edu\/files\/UsefulnessHarpers.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18683298"
    },
    {
        "title": "An FPGA-based In-line Accelerator for Memcached (2013) [pdf]",
        "score": 84,
        "link": "https:\/\/www.hotchips.org\/wp-content\/uploads\/hc_archives\/hc25\/HC25.50-FPGA-epub\/HC25.27.530-Memcached-Lavasani-UTexas.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17175135"
    },
    {
        "title": "US Surgeon General Declares E-cigarette Epidemic Among Youth [pdf]",
        "score": 84,
        "link": "https:\/\/e-cigarettes.surgeongeneral.gov\/documents\/surgeon-generals-advisory-on-e-cigarette-use-among-youth-2018.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18716016"
    },
    {
        "title": "Practical Examples in Data Oriented Design (2013) [pdf]",
        "score": 83,
        "link": "http:\/\/gamedevs.org\/uploads\/practical-examples-in-data-oriented-design.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16047380"
    },
    {
        "title": "An Introduction to Quantum Computation and Quantum Communication (2000) [pdf]",
        "score": 83,
        "link": "http:\/\/herpolhode.com\/rob\/qcintro.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18422415"
    },
    {
        "title": "FlureeDB, a Practical Decentralized Database (2017) [pdf]",
        "score": 82,
        "link": "https:\/\/flur.ee\/assets\/pdf\/flureedb_whitepaper_v1.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17056315"
    },
    {
        "title": "Communicating Sequential Processes (1978) [pdf]",
        "score": 82,
        "link": "https:\/\/www.cs.cmu.edu\/~crary\/819-f09\/Hoare78.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18607031"
    },
    {
        "title": "Pallene: A statically typed companion language for Lua [pdf]",
        "score": 82,
        "link": "http:\/\/www.inf.puc-rio.br\/~roberto\/docs\/pallene-sblp.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18038619"
    },
    {
        "title": "PoC||GTFO-18 [pdf]",
        "score": 81,
        "link": "https:\/\/www.alchemistowl.org\/pocorgtfo\/pocorgtfo18.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17413610"
    },
    {
        "title": "Loss of Locational Privacy While Traveling in Your Automobile (2013) [pdf]",
        "score": 81,
        "link": "https:\/\/www.defcon.org\/images\/defcon-21\/dc-21-presentations\/Pukingmonkey\/DEFCON-21-Pukingmonkey-The-Road-Less-Surreptitiously-Traveled-Updated.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16251396"
    },
    {
        "title": "A Formal Security Analysis of the Signal Messaging Protocol (2017) [pdf]",
        "score": 81,
        "link": "https:\/\/eprint.iacr.org\/2016\/1013.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17107149"
    },
    {
        "title": "Exploring C Semantics and Pointer Provenance [pdf]",
        "score": 81,
        "link": "https:\/\/www.cl.cam.ac.uk\/~pes20\/cerberus\/top-Cerberus-draft.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18328328"
    },
    {
        "title": "The Battle of the Schedulers: FreeBSD ULE vs. Linux CFS [pdf]",
        "score": 81,
        "link": "https:\/\/www.usenix.org\/system\/files\/conference\/atc18\/atc18-bouron.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17508403"
    },
    {
        "title": "Optimal Time-Inconsistent Beliefs: Misplanning, Procrastination, and Commitment [pdf]",
        "score": 80,
        "link": "https:\/\/scholar.princeton.edu\/sites\/default\/files\/TimeInconsistentBeliefs_0.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18294159"
    },
    {
        "title": "Linear types can change the world (1990) [pdf]",
        "score": 80,
        "link": "http:\/\/www.cs.ioc.ee\/ewscs\/2010\/mycroft\/linear-2up.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16100840"
    },
    {
        "title": "Designing and building a distributed data store in Go [pdf]",
        "score": 80,
        "link": "https:\/\/fosdem.org\/2018\/schedule\/event\/datastore\/attachments\/slides\/2618\/export\/events\/attachments\/datastore\/slides\/2618\/designing_distributed_datastore_in_go_timbala.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17524879"
    },
    {
        "title": "How does a GPU shader core work? [pdf]",
        "score": 79,
        "link": "http:\/\/aras-p.info\/texts\/files\/2018Academy%20-%20GPU.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18504470"
    },
    {
        "title": "Outlier Detection Techniques (2010) [pdf]",
        "score": 79,
        "link": "https:\/\/archive.siam.org\/meetings\/sdm10\/tutorial3.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18410647"
    },
    {
        "title": "UnicodeMath \u2013 A Nearly Plain-Text Encoding of Mathematics (2016) [pdf]",
        "score": 79,
        "link": "https:\/\/www.unicode.org\/notes\/tn28\/UTN28-PlainTextMath-v3.1.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18513897"
    },
    {
        "title": "Option Pricing with Fourier Transform and Exponential L\u00e9vy Models [pdf]",
        "score": 79,
        "link": "http:\/\/maxmatsuda.com\/Papers\/2004\/Matsuda%20Intro%20FT%20Pricing.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18298775"
    },
    {
        "title": "The Quantum Theory and Reality (1979) [pdf]",
        "score": 79,
        "link": "https:\/\/www.scientificamerican.com\/media\/pdf\/197911_0158.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16254297"
    },
    {
        "title": "Zero overhead deterministic failure: A unified mechanism for C and C++ [pdf]",
        "score": 79,
        "link": "http:\/\/www.open-std.org\/jtc1\/sc22\/wg14\/www\/docs\/n2289.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17922715"
    },
    {
        "title": "Model-Free, Model-Based, and General Intelligence [pdf]",
        "score": 78,
        "link": "https:\/\/www.ijcai.org\/proceedings\/2018\/0002.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17591361"
    },
    {
        "title": "The Algorithmic Foundations of Differential Privacy (2014) [pdf]",
        "score": 78,
        "link": "https:\/\/www.cis.upenn.edu\/~aaroth\/Papers\/privacybook.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16671955"
    },
    {
        "title": "History of Lisp (1979) [pdf]",
        "score": 77,
        "link": "http:\/\/jmc.stanford.edu\/articles\/lisp\/lisp.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17846522"
    },
    {
        "title": "Threads Cannot Be Implemented as a Library (2005) [pdf]",
        "score": 77,
        "link": "https:\/\/cs.nyu.edu\/~mwalfish\/classes\/14fa\/ref\/boehm05threads.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18483717"
    },
    {
        "title": "How Developers Use Dynamic Features of Programming Languages: Smalltalk [pdf]",
        "score": 77,
        "link": "https:\/\/users.dcc.uchile.cl\/~rrobbes\/p\/EMSE-features.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17114406"
    },
    {
        "title": "Why Systolic Architectures? (1982) [pdf]",
        "score": 77,
        "link": "http:\/\/www.eecs.harvard.edu\/~htk\/publication\/1982-kung-why-systolic-architecture.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18620841"
    },
    {
        "title": "The Next 700 Programming Languages (1965) [pdf]",
        "score": 77,
        "link": "http:\/\/homepages.inf.ed.ac.uk\/wadler\/papers\/papers-we-love\/landin-next-700.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16090761"
    },
    {
        "title": "Opening the Hood of a Word Processor (1984) [pdf]",
        "score": 77,
        "link": "http:\/\/worrydream.com\/refs\/Kay%20-%20Opening%20the%20Hood%20of%20a%20Word%20Processor.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16352020"
    },
    {
        "title": "The Red Wedding Problem: Write Spikes at the Edge and a Mitigation Strategy [pdf]",
        "score": 76,
        "link": "http:\/\/christophermeiklejohn.com\/publications\/hotedge-2018-preprint.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16643959"
    },
    {
        "title": "Canopy: An End-to-End Performance Tracing And Analysis System [pdf]",
        "score": 76,
        "link": "https:\/\/cs.brown.edu\/~jcmace\/papers\/kaldor2017canopy.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16592303"
    },
    {
        "title": "Building Robust Systems (2008) [pdf]",
        "score": 76,
        "link": "https:\/\/groups.csail.mit.edu\/mac\/users\/gjs\/6.945\/readings\/robust-systems.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16890498"
    },
    {
        "title": "Software Updates for IoT Devices and the Hidden Costs of Homegrown Updaters [pdf]",
        "score": 75,
        "link": "https:\/\/mender.io\/resources\/guides-and-whitepapers\/_resources\/Mender%2520White%2520Paper%2520_%2520Hidden%2520Costs%2520of%2520Homegrown.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16181051"
    },
    {
        "title": "Fantastic Timers: High-Resolution Microarchitectural Attacks in JS (2017) [pdf]",
        "score": 75,
        "link": "https:\/\/gruss.cc\/files\/fantastictimers.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16080235"
    },
    {
        "title": "Comprehensive and biased comparison of OpenBSD and FreeBSD (2017) [pdf]",
        "score": 75,
        "link": "https:\/\/www.bsdfrog.org\/pub\/events\/my_bsd_sucks_less_than_yours-AsiaBSDCon2017-paper.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18667179"
    },
    {
        "title": "Design and Evaluation of FPGA-Based Gigabit Ethernet Network Card (2004) [pdf]",
        "score": 73,
        "link": "https:\/\/pdfs.semanticscholar.org\/8bfe\/8988c14703302ebd2d567924b27a5cb10c57.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17029454"
    },
    {
        "title": "An Empirical Study of Programmers\u2019 Acquisition of New Programming Languages [pdf]",
        "score": 73,
        "link": "http:\/\/cs242.stanford.edu\/assets\/projects\/2017\/parastoo-gdietz44.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17950588"
    },
    {
        "title": "Ghostbuster: Detecting the Presence of Hidden Eavesdroppers [pdf]",
        "score": 73,
        "link": "https:\/\/synrg.csl.illinois.edu\/papers\/ghostbuster-mobicom18.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18082384"
    },
    {
        "title": "Low-Level Thinking in High-Level Shading Languages (2013) [pdf]",
        "score": 73,
        "link": "http:\/\/www.humus.name\/Articles\/Persson_LowLevelThinking.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16223651"
    },
    {
        "title": "William Stein on the struggle for open source funding in pure mathematics [pdf]",
        "score": 73,
        "link": "http:\/\/www.ams.org\/journals\/notices\/201805\/rnoti-p540.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16940726"
    },
    {
        "title": "Logic Programming and Compiler Writing (1980) [pdf]",
        "score": 72,
        "link": "http:\/\/sovietov.com\/tmp\/warren1980.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17674859"
    },
    {
        "title": "A survey of attacks against Intel x86 over last 10 years (2015) [pdf]",
        "score": 72,
        "link": "https:\/\/blog.invisiblethings.org\/papers\/2015\/x86_harmful.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17588822"
    },
    {
        "title": "Typed Clojure in Theory and Practice [pdf]",
        "score": 72,
        "link": "http:\/\/ambrosebs.com\/talks\/proposal.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17772922"
    },
    {
        "title": "How to Subvert Backdoored Encryption [pdf]",
        "score": 71,
        "link": "https:\/\/eprint.iacr.org\/2018\/212.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16763365"
    },
    {
        "title": "Who Are These Economists, Anyway? (2009) [pdf]",
        "score": 71,
        "link": "http:\/\/www.levyinstitute.org\/pubs\/Thought_Action.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17008291"
    },
    {
        "title": "Computing Higher Order Derivatives of Matrix and Tensor Expressions [pdf]",
        "score": 71,
        "link": "http:\/\/www.matrixcalculus.org\/matrixcalculus.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18464003"
    },
    {
        "title": "A Pedagogical Analysis of Online Coding Tutorials [pdf]",
        "score": 71,
        "link": "https:\/\/faculty.washington.edu\/ajko\/papers\/Kim2017CodingTutorialEvaluation.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16961716"
    },
    {
        "title": "Unix: Building a Development Environment from Scratch (2016) [pdf]",
        "score": 71,
        "link": "http:\/\/minnie.tuhs.org\/Y5\/wkt_hapop_paper.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16402165"
    },
    {
        "title": "Alchemy: A Language and Compiler for Homomorphic Encryption Made Easy [pdf]",
        "score": 71,
        "link": "http:\/\/web.eecs.umich.edu\/~cpeikert\/pubs\/alchemy.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18265948"
    },
    {
        "title": "Naked mole-rat mortality rates defy Gompertzian laws by not increasing with age [pdf]",
        "score": 70,
        "link": "https:\/\/www.ncbi.nlm.nih.gov\/pmc\/articles\/PMC5783610\/pdf\/elife-31157.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18109533"
    },
    {
        "title": "A First Course in Design and Analysis of Experiments (2010) [pdf]",
        "score": 70,
        "link": "http:\/\/users.stat.umn.edu\/~gary\/book\/fcdae.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18096685"
    },
    {
        "title": "Galois Field in Cryptography (2012) [pdf]",
        "score": 69,
        "link": "https:\/\/sites.math.washington.edu\/~morrow\/336_12\/papers\/juan.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16351068"
    },
    {
        "title": "USDZ File Format Specification [pdf]",
        "score": 69,
        "link": "https:\/\/graphics.pixar.com\/usd\/files\/USDZFileFormatSpecification.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17229971"
    },
    {
        "title": "Austerity and the rise of the Nazi party [pdf]",
        "score": 69,
        "link": "https:\/\/www.anderson.ucla.edu\/Documents\/areas\/fac\/gem\/nazi_austerity.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16558832"
    },
    {
        "title": "Sinking of the US Cargo Vessel El Faro: Illustrated digest [pdf]",
        "score": 68,
        "link": "https:\/\/www.ntsb.gov\/investigations\/AccidentReports\/Reports\/SPC1801.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17160396"
    },
    {
        "title": "This architecture tastes like microarchitecture [pdf]",
        "score": 68,
        "link": "http:\/\/wp3workshop.website\/pdfs\/WP3_dunham.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16560064"
    },
    {
        "title": "Parsing with Derivatives: A Functional Pearl (2011) [pdf]",
        "score": 68,
        "link": "http:\/\/matt.might.net\/papers\/might2011derivatives.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17391071"
    },
    {
        "title": "The Consistency of Arithmetic [pdf]",
        "score": 68,
        "link": "http:\/\/timothychow.net\/consistent.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18440115"
    },
    {
        "title": "The Potentiometer Handbook (1975) [pdf]",
        "score": 68,
        "link": "https:\/\/www.bourns.com\/docs\/technical-documents\/technical-library\/corporate\/OnlinePotentiometerHandbook.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18391076"
    },
    {
        "title": "A visual history of the future (2014) [pdf]",
        "score": 68,
        "link": "https:\/\/assets.publishing.service.gov.uk\/government\/uploads\/system\/uploads\/attachment_data\/file\/360814\/14-814-future-cities-visual-history.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17742726"
    },
    {
        "title": "The Computer for the 21st Cenury (1991) [pdf]",
        "score": 67,
        "link": "https:\/\/www.lri.fr\/~mbl\/Stanford\/CS477\/papers\/Weiser-SciAm.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17029179"
    },
    {
        "title": "High Performance Computing: Are We Just Getting Wrong Answers Faster? (1998) [pdf]",
        "score": 67,
        "link": "https:\/\/www3.nd.edu\/~markst\/cast-award-speech.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18049509"
    },
    {
        "title": "Notes on Landauer's principle, reversible computation, Maxwell's Demon (2003) [pdf]",
        "score": 67,
        "link": "https:\/\/www.cs.princeton.edu\/courses\/archive\/fall06\/cos576\/papers\/bennett03.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18267000"
    },
    {
        "title": "Leisure Luxuries and the Labor Supply of Young Men [pdf]",
        "score": 66,
        "link": "https:\/\/scholar.princeton.edu\/sites\/default\/files\/maguiar\/files\/leisure-luxuries-labor-june-2017.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16393903"
    },
    {
        "title": "How did software get so reliable without proof? (1996) [pdf]",
        "score": 65,
        "link": "http:\/\/www.gwern.net\/docs\/math\/1996-hoare.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18050706"
    },
    {
        "title": "Understanding Simpson\u2019s Paradox (2013) [pdf]",
        "score": 65,
        "link": "https:\/\/ftp.cs.ucla.edu\/pub\/stat_ser\/r414.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17728954"
    },
    {
        "title": "F1 Query: Declarative Querying at Google Scale [pdf]",
        "score": 65,
        "link": "http:\/\/www.vldb.org\/pvldb\/vol11\/p1835-samwel.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17719916"
    },
    {
        "title": "How to Print Floating-Point Numbers Accurately (1990) [pdf]",
        "score": 64,
        "link": "https:\/\/lists.nongnu.org\/archive\/html\/gcl-devel\/2012-10\/pdfkieTlklRzN.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17277560"
    },
    {
        "title": "Defeating Modern Secure Boot Using Second-Order Pulsed EM Fault Injection [pdf]",
        "score": 64,
        "link": "https:\/\/www.usenix.org\/system\/files\/conference\/woot17\/woot17-paper-cui.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17895781"
    },
    {
        "title": "Foundations for Efficient and Expressive Differentiable Programming [pdf]",
        "score": 64,
        "link": "http:\/\/papers.nips.cc\/paper\/8221-backpropagation-with-callbacks-foundations-for-efficient-and-expressive-differentiable-programming.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18747767"
    },
    {
        "title": "APL\\3000 \u2013 HP Journal \u2013 July 1977 [pdf]",
        "score": 64,
        "link": "http:\/\/www.hpl.hp.com\/hpjournal\/pdfs\/IssuePDFs\/1977-07.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17506789"
    },
    {
        "title": "On Intelligence in Cells: The Case for Whole Cell Biology (2009) [pdf]",
        "score": 64,
        "link": "http:\/\/www.brianjford.com\/a-ISR_Ford.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17317323"
    },
    {
        "title": "GraalSqueak: A Fast Smalltalk Bytecode Interpreter [pdf]",
        "score": 64,
        "link": "https:\/\/fniephaus.com\/2018\/icooolps18-graalsqueak.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17470767"
    },
    {
        "title": "Towards Stealthy Manipulation of Road Navigation Systems [pdf]",
        "score": 64,
        "link": "https:\/\/people.cs.vt.edu\/gangwang\/sec18-gps.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17581755"
    },
    {
        "title": "Monoid machines: a O(log n) parser for regular languages (2006) [pdf]",
        "score": 64,
        "link": "http:\/\/www.dcc.fc.up.pt\/~acm\/semigr.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17512574"
    },
    {
        "title": "A Relational Model of Data for Large Shared Data Banks (1970) [pdf]",
        "score": 64,
        "link": "https:\/\/cs.uwaterloo.ca\/~david\/cs848s14\/codd-relational.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18088951"
    },
    {
        "title": "BleedingBit: The hidden attack surface within BLE chips [pdf]",
        "score": 64,
        "link": "https:\/\/go.armis.com\/hubfs\/BLEEDINGBIT%20-%20Technical%20White%20Paper.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18621070"
    },
    {
        "title": "2018 Deloitte Millennial Survey [pdf]",
        "score": 63,
        "link": "https:\/\/www2.deloitte.com\/content\/dam\/Deloitte\/global\/Documents\/About-Deloitte\/gx-2018-millennial-survey-report.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17631670"
    },
    {
        "title": "Adopting Lessons from Offline Ray-Tracing to Real-Time Ray-Tracing [pdf]",
        "score": 63,
        "link": "http:\/\/advances.realtimerendering.com\/s2018\/Pharr%20-%20Advances%20in%20RTR%20-%20Real-time%20Ray%20Tracing.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18364825"
    },
    {
        "title": "Huygens: Scalable, Fine-grained Clock Synchronization [pdf]",
        "score": 63,
        "link": "https:\/\/www.usenix.org\/system\/files\/conference\/nsdi18\/nsdi18-geng.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17428655"
    },
    {
        "title": "The Case for Shared Nothing (1986) [pdf]",
        "score": 63,
        "link": "http:\/\/db.cs.berkeley.edu\/papers\/hpts85-nothing.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17391376"
    },
    {
        "title": "\u201cLittle Languages\u201d by Jon Bentley (1986) [pdf]",
        "score": 63,
        "link": "http:\/\/staff.um.edu.mt\/afra1\/seminar\/little-languages.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17881705"
    },
    {
        "title": "Optimizing Paxos with batching and pipelining (2012) [pdf]",
        "score": 63,
        "link": "https:\/\/pdfs.semanticscholar.org\/a0d0\/cdd2e8af1945c03cfaf2cb451f71f208d0c9.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16952649"
    },
    {
        "title": "The Structure of \u201cUnstructured\u201d Decision Processes (1976) [pdf]",
        "score": 63,
        "link": "http:\/\/media.corporate-ir.net\/media_files\/irol\/97\/97664\/reports\/Mintzberg.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16513405"
    },
    {
        "title": "Modeling Potential Income and Welfare \u2013 Benefits in Illinois (2014) [pdf]",
        "score": 62,
        "link": "https:\/\/d2dv7hze646xr.cloudfront.net\/wp-content\/uploads\/2014\/12\/Welfare_Report_finalfinal.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17484212"
    },
    {
        "title": "Building a Self-Healing Operating System (2007) [pdf]",
        "score": 62,
        "link": "http:\/\/choices.cs.illinois.edu\/selfhealing.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17745990"
    },
    {
        "title": "Static Program Analysis [pdf]",
        "score": 62,
        "link": "https:\/\/cs.au.dk\/~amoeller\/spa\/spa.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17915563"
    },
    {
        "title": "Evidence for biological shaping of hair ice (2015) [pdf]",
        "score": 62,
        "link": "https:\/\/www.biogeosciences.net\/12\/4261\/2015\/bg-12-4261-2015.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17305994"
    },
    {
        "title": "Security Chasms of WASM [pdf]",
        "score": 62,
        "link": "https:\/\/i.blackhat.com\/us-18\/Thu-August-9\/us-18-Lukasiewicz-WebAssembly-A-New-World-of-Native_Exploits-On-The-Web-wp.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17834675"
    },
    {
        "title": "IRS: Review of the System Failure That Led to the Tax Day Outage [pdf]",
        "score": 62,
        "link": "https:\/\/www.treasury.gov\/tigta\/auditreports\/2018reports\/201820065fr.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18062405"
    },
    {
        "title": "The CONS microprocessor (1974) [pdf]",
        "score": 61,
        "link": "https:\/\/dspace.mit.edu\/bitstream\/handle\/1721.1\/41115\/AI_WP_080.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18531352"
    },
    {
        "title": "Setting, Elaborating, Reflecting on Goals Improves Academic Performance (2010) [pdf]",
        "score": 61,
        "link": "http:\/\/individual.utoronto.ca\/jacobhirsh\/publications\/GoalSettingJAP2010.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18206472"
    },
    {
        "title": "Live Coding in Sporth: A Stack-Based Language for Audio Synthesis [pdf]",
        "score": 61,
        "link": "https:\/\/iclc.livecodenetwork.org\/2017\/cameraReady\/sporth.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17118237"
    },
    {
        "title": "On the Detection of Kernel-Level Rootkits Using Hardware Performance Counters [pdf]",
        "score": 61,
        "link": "http:\/\/www.cs.binghamton.edu\/~devtyushkin\/asiaccs-2017.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17161886"
    },
    {
        "title": "The Socratic Method in an Age of Trauma (2017) [pdf]",
        "score": 61,
        "link": "https:\/\/harvardlawreview.org\/wp-content\/uploads\/2017\/10\/2320-2347_Online.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18050207"
    },
    {
        "title": "To Kill a Centrifuge (2013) [pdf]",
        "score": 60,
        "link": "https:\/\/www.langner.com\/wp-content\/uploads\/2017\/03\/to-kill-a-centrifuge.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17133329"
    },
    {
        "title": "Deep Learning: A Critical Appraisal [pdf]",
        "score": 60,
        "link": "https:\/\/arxiv.org\/ftp\/arxiv\/papers\/1801\/1801.00631.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16083469"
    },
    {
        "title": "Design case history: the Commodore 64 (1985) [pdf]",
        "score": 60,
        "link": "https:\/\/spectrum.ieee.org\/ns\/pdfs\/commodore64_mar1985.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17438106"
    },
    {
        "title": "Sulong: Finding Errors in C Programs [pdf]",
        "score": 60,
        "link": "http:\/\/ssw.jku.at\/General\/Staff\/ManuelRigger\/ASPLOS18.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16536013"
    },
    {
        "title": "A Stall-Free Real-Time Garbage Collector for Reconfigurable Hardware (2012) [pdf]",
        "score": 60,
        "link": "https:\/\/researcher.watson.ibm.com\/researcher\/files\/us-bacon\/Bacon12AndThen.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16347624"
    },
    {
        "title": "Chipforge opensource foundry [pdf]",
        "score": 59,
        "link": "https:\/\/github.com\/leviathanch\/SITCON\/blob\/master\/ORConf-20180921.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18104362"
    },
    {
        "title": "Introduction to the Mumps Language (2017) [pdf]",
        "score": 59,
        "link": "https:\/\/www.cs.uni.edu\/~okane\/source\/MUMPS-MDH\/MumpsTutorial.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16309237"
    },
    {
        "title": "Dangerous Optimizations and the Loss of Causality in C and C++ (2010) [pdf]",
        "score": 59,
        "link": "https:\/\/pubweb.eng.utah.edu\/~cs5785\/slides-f10\/Dangerous+Optimizations.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17399228"
    },
    {
        "title": "The next 700 programming languages (1966) [pdf]",
        "score": 59,
        "link": "http:\/\/fsl.cs.illinois.edu\/images\/e\/ef\/P157-landin.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17718158"
    },
    {
        "title": "Detecting Consciousness (2017) [pdf]",
        "score": 58,
        "link": "https:\/\/www.alleninstitute.org\/media\/filer_public\/3e\/7a\/3e7aabb0-5da7-4915-b4b6-2aa896c8faee\/2017_11_howtomakeaconsciousnessmeter.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16300280"
    },
    {
        "title": "Cure53: Browser Security Whitepaper (2017) [pdf]",
        "score": 58,
        "link": "https:\/\/cure53.de\/browser-security-whitepaper.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16406663"
    },
    {
        "title": "How to Catch When Proxies Lie [pdf]",
        "score": 57,
        "link": "https:\/\/www.andrew.cmu.edu\/user\/nicolasc\/publications\/Weinberg-IMC18.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18336283"
    },
    {
        "title": "Bringup is Hard [pdf]",
        "score": 57,
        "link": "http:\/\/www.garbled.net\/tmp\/bringup.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17435512"
    },
    {
        "title": "Functional Pearl: Enumerating the Rationals [pdf]",
        "score": 56,
        "link": "https:\/\/www.cs.ox.ac.uk\/jeremy.gibbons\/publications\/rationals.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18515413"
    },
    {
        "title": "Computation and State Machines (2008) [pdf]",
        "score": 56,
        "link": "https:\/\/lamport.azurewebsites.net\/pubs\/state-machine.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18012672"
    },
    {
        "title": "All Your IOPS Are Belong to Us: Case Study in Performance Optimization (2015) [pdf]",
        "score": 56,
        "link": "https:\/\/www.percona.com\/live\/mysql-conference-2015\/sites\/default\/files\/slides\/all_your_iops_are_belong_to_usPLMCE2015.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16252986"
    },
    {
        "title": "TCP and BBR [pdf]",
        "score": 56,
        "link": "https:\/\/ripe76.ripe.net\/presentations\/10-2018-05-15-bbr.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17063582"
    },
    {
        "title": "Reverse-Engineering WebAssembly [pdf]",
        "score": 56,
        "link": "https:\/\/www.pnfsoftware.com\/reversing-wasm.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17507767"
    },
    {
        "title": "Still All on One Server: Perforce at Scale (2011) [pdf]",
        "score": 56,
        "link": "http:\/\/info.perforce.com\/rs\/perforce\/images\/GoogleWhitePaper-StillAllonOneServer-PerforceatScale.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17607457"
    },
    {
        "title": "Ambit: In-Memory Accelerator for Bulk Bitwise Operations Using Commodity DRAM [pdf]",
        "score": 56,
        "link": "https:\/\/people.inf.ethz.ch\/omutlu\/pub\/ambit-bulk-bitwise-dram_micro17.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16085778"
    },
    {
        "title": "Specializing Ropes for Ruby [pdf]",
        "score": 56,
        "link": "https:\/\/chrisseaton.com\/truffleruby\/ropes-manlang.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17971920"
    },
    {
        "title": "Programming in an Interactive Environment: The \u201cLisp\u201d Experience (1978) [pdf]",
        "score": 55,
        "link": "http:\/\/www.softwarepreservation.org\/projects\/interactive_c\/bib\/Sandewall-1978.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17736959"
    },
    {
        "title": "Prolog as Description and Implementation Language in CS Teaching (2004) [pdf]",
        "score": 55,
        "link": "http:\/\/www.ep.liu.se\/ecp\/012\/004\/ecp012004.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18174191"
    },
    {
        "title": "Why Threads Are a Bad Idea (1995) [pdf]",
        "score": 55,
        "link": "https:\/\/www.cc.gatech.edu\/classes\/AY2010\/cs4210_fall\/papers\/ousterhout-threads.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17297325"
    },
    {
        "title": "Compiler Construction: The Art of Niklaus Wirth (2000) [pdf]",
        "score": 54,
        "link": "https:\/\/pdfs.semanticscholar.org\/036f\/c4effda4bbbe9f6a9ee762df717bd0af1324.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16609360"
    },
    {
        "title": "Understanding, finding, and eliminating ground loops (2003) [pdf]",
        "score": 54,
        "link": "http:\/\/web.mit.edu\/jhawk\/tmp\/p\/EST016_Ground_Loops_handout.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17640674"
    },
    {
        "title": "Fuzzy Logic in Agent-Based Game Design [pdf]",
        "score": 54,
        "link": "https:\/\/web.northeastern.edu\/magy\/courses\/AI\/FuzzyLogicGames.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17265862"
    },
    {
        "title": "No Causal Effect of Music Practice on Ability (2014) [pdf]",
        "score": 54,
        "link": "https:\/\/www.gwern.net\/docs\/genetics\/correlation\/2014-mosing.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16348727"
    },
    {
        "title": "Dynamic Automatic Differentiation of GPU Broadcast Kernels [pdf]",
        "score": 53,
        "link": "http:\/\/www.mit.edu\/~jvielma\/publications\/Dynamic-Automatic-Differentiation.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18404201"
    },
    {
        "title": "The Problem with Threads (2006) [pdf]",
        "score": 53,
        "link": "https:\/\/www2.eecs.berkeley.edu\/Pubs\/TechRpts\/2006\/EECS-2006-1.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16996668"
    },
    {
        "title": "Inside the Windows 95 File System (1997) [pdf]",
        "score": 53,
        "link": "http:\/\/www.tenox.net\/books\/Microsoft_Windows\/Inside_the_Windows95_File_System.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17391526"
    },
    {
        "title": "Computational Complexity of Air Travel Planning (2003) [pdf]",
        "score": 53,
        "link": "http:\/\/www.demarcken.org\/carl\/papers\/ITA-software-travel-complexity\/ITA-software-travel-complexity.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17642263"
    },
    {
        "title": "Racklog: Prolog Style Logic Programming [pdf]",
        "score": 53,
        "link": "https:\/\/plt.eecs.northwestern.edu\/snapshots\/current\/pdf-doc\/racklog.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18767708"
    },
    {
        "title": "A Failure of Academic Quality Control [pdf]",
        "score": 53,
        "link": "http:\/\/journalofpositivesexuality.org\/wp-content\/uploads\/2018\/08\/Failure-of-Academic-Quality-Control-Technology-of-Orgasm-Lieberman-Schatzberg.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17897753"
    },
    {
        "title": "An Empirical Study of the Reliability of Unix Utilities (1989) [pdf]",
        "score": 52,
        "link": "http:\/\/ftp.cs.wisc.edu\/paradyn\/technical_papers\/fuzz.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16324063"
    },
    {
        "title": "American Gut: An Open Platform for Citizen Science Microbiome Research [pdf]",
        "score": 52,
        "link": "http:\/\/msystems.asm.org\/content\/msys\/3\/3\/e00031-18.full.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17434948"
    },
    {
        "title": "How the Reformulation of OxyContin Ignited the Heroin Epidemic [pdf]",
        "score": 52,
        "link": "https:\/\/www3.nd.edu\/~elieber\/research\/ELP.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16792052"
    },
    {
        "title": "Basic Cave Diving: A Blueprint for Survival (1986) [pdf]",
        "score": 52,
        "link": "https:\/\/nsscds.org\/wp-content\/uploads\/2018\/05\/Blueprint-for-Survival.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17483339"
    },
    {
        "title": "CFTC and SEC Testimony on Cryptocurrencies [pdf]",
        "score": 52,
        "link": "https:\/\/www.banking.senate.gov\/public\/_cache\/files\/a5e72ac6-4f8a-473f-9c9c-e2894573d57d\/BF62433A09A9B95A269A29E1FF13D2BA.clayton-testimony-2-6-18.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16312025"
    },
    {
        "title": "Zero-overhead deterministic exceptions: Throwing values [pdf]",
        "score": 51,
        "link": "http:\/\/www.open-std.org\/jtc1\/sc22\/wg21\/docs\/papers\/2018\/p0709r0.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17059297"
    },
    {
        "title": "Cryptographically Certified Hypothesis Testing [pdf]",
        "score": 51,
        "link": "http:\/\/sachaservanschreiber.com\/thesis.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18692982"
    },
    {
        "title": "A History of Capacity Challenges in Computer Science [pdf]",
        "score": 51,
        "link": "https:\/\/cs.stanford.edu\/people\/eroberts\/CSCapacity.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16334968"
    },
    {
        "title": "Mach-O Tricks [pdf]",
        "score": 51,
        "link": "http:\/\/iokit.racing\/machotricks.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17378829"
    },
    {
        "title": "Exploiting Coroutines to Attack the \u201cKiller Nanoseconds\u201d [pdf]",
        "score": 50,
        "link": "http:\/\/www.vldb.org\/pvldb\/vol11\/p1702-jonathan.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18420950"
    },
    {
        "title": "Pycket: A Tracing JIT For a Functional Language (2015) [pdf]",
        "score": 50,
        "link": "http:\/\/homes.sice.indiana.edu\/samth\/pycket-draft.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18005734"
    },
    {
        "title": "Systems Software Research is Irrelevant (2000) [pdf]",
        "score": 50,
        "link": "http:\/\/doc.cat-v.org\/bell_labs\/utah2000\/utah2000.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18207317"
    },
    {
        "title": "Welcome to DNS, or Saving the DNS Camel [pdf]",
        "score": 50,
        "link": "https:\/\/indico.dns-oarc.net\/event\/29\/contributions\/658\/attachments\/641\/1039\/Welcome_to_DNS-final.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18255619"
    },
    {
        "title": "The Dark (Patterns) Side of UX Design [pdf]",
        "score": 50,
        "link": "http:\/\/colingray.me\/wp-content\/uploads\/2018_Grayetal_CHI_DarkPatternsUXDesign.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17962469"
    },
    {
        "title": "Monads for functional programming (1995) [pdf]",
        "score": 49,
        "link": "http:\/\/homepages.inf.ed.ac.uk\/wadler\/papers\/marktoberdorf\/baastad.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17002554"
    },
    {
        "title": "Online Tracking: A 1M-site Measurement and Analysis [pdf]",
        "score": 49,
        "link": "http:\/\/randomwalker.info\/publications\/OpenWPM_1_million_site_tracking_measurement.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18771494"
    },
    {
        "title": "SEC settles with EtherDelta founder for running an unlicensed exchange [pdf]",
        "score": 49,
        "link": "https:\/\/www.sec.gov\/litigation\/admin\/2018\/34-84553.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18410483"
    },
    {
        "title": "Naming and Synchronization in a Decentralized Computer System (1979) [pdf]",
        "score": 49,
        "link": "http:\/\/www.dtic.mil\/dtic\/tr\/fulltext\/u2\/a061407.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18267022"
    },
    {
        "title": "Methods for Studying Coincidences (1989) [pdf]",
        "score": 49,
        "link": "http:\/\/www.math.uchicago.edu\/~fcale\/CCC\/DC.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16297067"
    },
    {
        "title": "To Explain or to Predict? (2010) [pdf]",
        "score": 49,
        "link": "http:\/\/www.galitshmueli.com\/system\/files\/Stat%20Science%20published.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17509407"
    },
    {
        "title": "The Intel 80x86 Process Architecture: Pitfalls for Secure Systems (1995) [pdf]",
        "score": 49,
        "link": "https:\/\/pdfs.semanticscholar.org\/2209\/42809262c17b6631c0f6536c91aaf7756857.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16101719"
    },
    {
        "title": "Imperfect Forward Secrecy: How Diffie-Hellman Fails in Practice",
        "score": 49,
        "link": "https:\/\/jhalderm.com\/pub\/papers\/weakdh-cacm19.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18725824"
    },
    {
        "title": "Froid: Optimization of Imperative Programs in a Relational Database [pdf]",
        "score": 49,
        "link": "http:\/\/www.vldb.org\/pvldb\/vol11\/p432-ramachandra.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18747807"
    },
    {
        "title": "Succincter [pdf]",
        "score": 49,
        "link": "http:\/\/people.csail.mit.edu\/mip\/papers\/succinct\/succinct.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18701540"
    },
    {
        "title": "An FPGA Implementation of a Distributed Virtual Machine [pdf]",
        "score": 48,
        "link": "https:\/\/www.cs.unm.edu\/~williams\/fpga-ucnc18.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17760267"
    },
    {
        "title": "The Trouble with Macroeconomics (2016) [pdf]",
        "score": 48,
        "link": "https:\/\/paulromer.net\/wp-content\/uploads\/2016\/09\/WP-Trouble.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18179989"
    },
    {
        "title": "Clascal Reference Manual for the Lisa (1983) [pdf]",
        "score": 48,
        "link": "http:\/\/www.mirrorservice.org\/sites\/www.bitsavers.org\/pdf\/apple\/lisa\/toolkit_university\/Clascal_Reference_Manual_Mar83.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17591728"
    },
    {
        "title": "Self-Censorship in Public Discourse: A Theory of 'Political Correctness' (1994) [pdf]",
        "score": 47,
        "link": "https:\/\/www.brown.edu\/Departments\/Economics\/Faculty\/Glenn_Loury\/louryhomepage\/papers\/Loury_Political_Correctness.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16442347"
    },
    {
        "title": "The Scheme Machine (1994) [pdf]",
        "score": 47,
        "link": "http:\/\/burgerrg.github.io\/TR413.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17702420"
    },
    {
        "title": "Mathematics in the 20th century \u2013 Sir Michael Atiyah [pdf]",
        "score": 47,
        "link": "http:\/\/www.math.tamu.edu\/~rojas\/atiyah20thcentury.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18730436"
    },
    {
        "title": "Why Echo Chambers Are Useful [pdf]",
        "score": 47,
        "link": "https:\/\/www.economics.ox.ac.uk\/materials\/jm_papers\/921\/echochambers.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18375409"
    },
    {
        "title": "Building a Bw-Tree Takes More Than Just Buzz Words [pdf]",
        "score": 47,
        "link": "https:\/\/db.cs.cmu.edu\/papers\/2018\/mod342-wangA.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17041616"
    },
    {
        "title": "The History, Controversy, and Evolution of the Goto Statement [pdf]",
        "score": 46,
        "link": "http:\/\/web.sonoma.edu\/users\/l\/luvisi\/goto\/goto.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18484221"
    },
    {
        "title": "Automated PCB Reverse Engineering (2017) [pdf]",
        "score": 46,
        "link": "https:\/\/www.usenix.org\/system\/files\/conference\/woot17\/woot17-paper-kleber.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18082465"
    },
    {
        "title": "New Hardware for Massive Neural Networks (1988) [pdf]",
        "score": 46,
        "link": "https:\/\/papers.nips.cc\/paper\/22-new-hardware-for-massive-neural-networks.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18372953"
    },
    {
        "title": "Entity Component Systems and Data Oriented Design [pdf]",
        "score": 46,
        "link": "http:\/\/aras-p.info\/texts\/files\/2018Academy%20-%20ECS-DoD.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18202308"
    },
    {
        "title": "Testing Theories of American Politics: Elites, Interest Groups, Citizens (2014) [pdf]",
        "score": 46,
        "link": "https:\/\/scholar.princeton.edu\/sites\/default\/files\/mgilens\/files\/gilens_and_page_2014_-testing_theories_of_american_politics.doc.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18324592"
    },
    {
        "title": "Technological Change and Obsolete Skills: Evidence from Men\u2019s Pro Tennis (2017) [pdf]",
        "score": 46,
        "link": "http:\/\/individual.utoronto.ca\/jhall\/documents\/TennisTechChange.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16720468"
    },
    {
        "title": "Flare: An Approach to Routing in Lightning Network (2016) [pdf]",
        "score": 45,
        "link": "http:\/\/bitfury.com\/content\/downloads\/whitepaper_flare_an_approach_to_routing_in_lightning_network_7_7_2016.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17057441"
    },
    {
        "title": "Bicycle Technology (1973) [pdf]",
        "score": 45,
        "link": "http:\/\/veterancycleclublibrary.org.uk\/ncl\/pics\/Bicycle%20Technology%20Scientific%20American%20March%201973%20(V-CC%20Library).pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17968267"
    },
    {
        "title": "How Browsers\u2019 Explanations Impact Misconceptions About Private Browsing [pdf]",
        "score": 45,
        "link": "https:\/\/www.blaseur.com\/papers\/www18privatebrowsing.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17456047"
    },
    {
        "title": "Overload Control for Scaling WeChat Microservices [pdf]",
        "score": 45,
        "link": "https:\/\/www.cs.columbia.edu\/~ruigu\/papers\/socc18-final100.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18691462"
    },
    {
        "title": "Popularity Dynamics and Intrinsic Quality in Reddit and Hacker News (2015) [pdf]",
        "score": 45,
        "link": "https:\/\/pdfs.semanticscholar.org\/ccf6\/0d08bdd989ea3595bbbda132dedd71c47acf.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18290904"
    },
    {
        "title": "Show HN: A Root Cause Analysis EBook [pdf]",
        "score": 45,
        "link": "http:\/\/www.sologic.com\/sites\/default\/files\/pdf\/RCA-ebook-my-boss-told-me-to-do-rca.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16483762"
    },
    {
        "title": "Survival in the first hours of the Cenozoic (2004) [pdf]",
        "score": 44,
        "link": "http:\/\/uahost.uantwerpen.be\/funmorph\/raoul\/macroevolutie\/Robertson2004.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17748995"
    },
    {
        "title": "The Discoveries of Continuations (1993) [pdf]",
        "score": 44,
        "link": "http:\/\/www.math.bas.bg\/~bantchev\/place\/iswim\/conti-disco.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18457914"
    },
    {
        "title": "Oral History of John Backus (2006) [pdf]",
        "score": 44,
        "link": "http:\/\/archive.computerhistory.org\/resources\/access\/text\/2013\/05\/102657970-05-01-acc.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17564186"
    },
    {
        "title": "Peeking Behind the Curtains of Serverless Platforms [pdf]",
        "score": 44,
        "link": "http:\/\/pages.cs.wisc.edu\/~liangw\/pub\/atc18-final298.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17686223"
    },
    {
        "title": "A Mathematician\u2019s Apology (1940) [pdf]",
        "score": 44,
        "link": "http:\/\/www.math.ualberta.ca\/~mss\/misc\/A%20Mathematician%27s%20Apology.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18037550"
    },
    {
        "title": "LHD: Improving Cache Hit Rate by Maximizing Hit Density [pdf]",
        "score": 44,
        "link": "http:\/\/www.cs.cmu.edu\/~beckmann\/publications\/papers\/2018.nsdi.lhd.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16825931"
    },
    {
        "title": "Direction for ISO C++ [pdf]",
        "score": 43,
        "link": "http:\/\/www.open-std.org\/JTC1\/SC22\/WG21\/docs\/papers\/2018\/p0939r0.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16394041"
    },
    {
        "title": "Fortifying Macros (2010) [pdf]",
        "score": 43,
        "link": "https:\/\/www2.ccs.neu.edu\/racket\/pubs\/icfp10-cf.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18372103"
    },
    {
        "title": "Deprecating the Observer Pattern (2010) [pdf]",
        "score": 43,
        "link": "https:\/\/infoscience.epfl.ch\/record\/148043\/files\/DeprecatingObserversTR2010.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17845341"
    },
    {
        "title": "Compiler Fuzzing Through Deep Learning [pdf]",
        "score": 43,
        "link": "http:\/\/homepages.inf.ed.ac.uk\/hleather\/publications\/2018_deepfuzzing_issta.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18748193"
    },
    {
        "title": "You Could Have Invented Spectral Sequences (2006) [pdf]",
        "score": 43,
        "link": "http:\/\/timothychow.net\/spectral02.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18063999"
    },
    {
        "title": "Relationship Between Practice and Performance in Sports: A Meta-Analysis (2016) [pdf]",
        "score": 43,
        "link": "https:\/\/artscimedia.case.edu\/wp-content\/uploads\/sites\/141\/2016\/09\/14214856\/Macnamara-Moreau-Hambrick-2016.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17874069"
    },
    {
        "title": "Herbert Simon: The Architecture of Complexity (1962) [pdf]",
        "score": 42,
        "link": "http:\/\/ecoplexity.org\/files\/uploads\/Simon.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16392223"
    },
    {
        "title": "Reminiscences of the VLSI Revolution (2012) [pdf]",
        "score": 42,
        "link": "http:\/\/worrydream.com\/refs\/Conway%20-%20Reminiscences%20of%20the%20VLSI%20Revolution.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18140297"
    },
    {
        "title": "Finger Printing Data [pdf]",
        "score": 42,
        "link": "https:\/\/eprint.iacr.org\/2018\/503.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17162619"
    },
    {
        "title": "Quantitative analysis of family trees with millions of relatives (2017) [pdf]",
        "score": 42,
        "link": "https:\/\/www.biorxiv.org\/content\/biorxiv\/early\/2017\/02\/07\/106427.1.full.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16499241"
    },
    {
        "title": "CloudKit: Structured Storage for Mobile Applications [pdf]",
        "score": 42,
        "link": "http:\/\/www.vldb.org\/pvldb\/vol11\/p540-shraer.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16281270"
    },
    {
        "title": "Thirty Years Later: Lessons from the Multics Security Evaluation (2002) [pdf]",
        "score": 42,
        "link": "https:\/\/www.acsac.org\/2002\/papers\/classic-multics.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16956386"
    },
    {
        "title": "Hints for Computer System Design (1983) [pdf]",
        "score": 41,
        "link": "https:\/\/www.microsoft.com\/en-us\/research\/wp-content\/uploads\/2016\/02\/acrobat-17.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17587748"
    },
    {
        "title": "The Computer and the Brain (1958) [pdf]",
        "score": 41,
        "link": "https:\/\/ia800800.us.archive.org\/4\/items\/TheComputerAndTheBrain\/The%20Computer%20and%20The%20Brain_text.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17461152"
    },
    {
        "title": "Natural Sounding Artificial Reverberation (1962) [pdf]",
        "score": 41,
        "link": "http:\/\/charlesames.net\/pdf\/MRSchroeder\/artificial-reverb.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16304354"
    },
    {
        "title": "Self-reference and Logic (2005) [pdf]",
        "score": 41,
        "link": "http:\/\/www.imm.dtu.dk\/~tobo\/essay.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17845288"
    },
    {
        "title": "Techniques of Systems Analysis (1957) [pdf]",
        "score": 40,
        "link": "https:\/\/www.rand.org\/content\/dam\/rand\/pubs\/research_memoranda\/2006\/RM1829-1.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16355886"
    },
    {
        "title": "Implementing SIP Telephony in Python (2008) [pdf]",
        "score": 40,
        "link": "http:\/\/39peers.net\/download\/doc\/report.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17757737"
    },
    {
        "title": "Practical Memory Safety with Random Embedded Secret Tokens [pdf]",
        "score": 40,
        "link": "http:\/\/www.cs.columbia.edu\/~simha\/preprint_isca18_REST_memory_safety.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16891319"
    },
    {
        "title": "Scalable 10 Gbps TCP\/IP Stack Architecture for Reconfigurable Hardware (2015) [pdf]",
        "score": 39,
        "link": "http:\/\/davidsidler.ch\/files\/fccm2015-tcpip.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17994713"
    },
    {
        "title": "Understand and Eliminate JVM Warm-Up Overhead in Data-Parallel Systems (2016) [pdf]",
        "score": 39,
        "link": "https:\/\/www.usenix.org\/system\/files\/conference\/osdi16\/osdi16-lion.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17995055"
    },
    {
        "title": "The Tyranny of the Clock (2012) [pdf]",
        "score": 39,
        "link": "http:\/\/www.eng.auburn.edu\/~uguin\/teaching\/READING\/E6200\/Sutherland_Tyranny_o_Clock.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17577677"
    },
    {
        "title": "Bfloat16 \u2013 Hardware Numerics Definition [pdf]",
        "score": 39,
        "link": "https:\/\/software.intel.com\/sites\/default\/files\/managed\/40\/8b\/bf16-hardware-numerics-definition-white-paper.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18475575"
    },
    {
        "title": "Compiling a Subset of APL into a Typed Intermediate Language (2014) [pdf]",
        "score": 39,
        "link": "http:\/\/hiperfit.dk\/pdf\/array14_final.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16230067"
    },
    {
        "title": "Genetic Predisposition to Obesity and Medicare Expenditures [pdf]",
        "score": 39,
        "link": "https:\/\/www.gwern.net\/docs\/genetics\/selection\/2017-wehby.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16434697"
    },
    {
        "title": "Imperfect Forward Secrecy: How Diffie-Hellman Fails in Practice (2015)",
        "score": 39,
        "link": "https:\/\/weakdh.org\/imperfect-forward-secrecy-ccs15.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18725824"
    },
    {
        "title": "Mathematical Metaphysics (2015) [pdf]",
        "score": 38,
        "link": "http:\/\/shelf1.library.cmu.edu\/HSS\/2015\/a1626190.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17462947"
    },
    {
        "title": "Retpoline: A Branch Target Injection Mitigation [pdf]",
        "score": 38,
        "link": "https:\/\/software.intel.com\/sites\/default\/files\/managed\/1d\/46\/Retpoline-A-Branch-Target-Injection-Mitigation.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16423401"
    },
    {
        "title": "Essentials of Metaheuristics (2015) [pdf]",
        "score": 38,
        "link": "https:\/\/cs.gmu.edu\/~sean\/book\/metaheuristics\/Essentials.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18491274"
    },
    {
        "title": "Verifying Concurrent Programs Using Contracts (2017) [pdf]",
        "score": 38,
        "link": "http:\/\/www.fit.vutbr.cz\/~vojnar\/Publications\/icst17-contracts.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18403244"
    },
    {
        "title": "The TX-2 Computer and Sketchpad (2012) [pdf]",
        "score": 38,
        "link": "https:\/\/www.ll.mit.edu\/publications\/labnotes\/LookingBack_19_1.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16058966"
    },
    {
        "title": "Ground: A Data Context Service [pdf]",
        "score": 38,
        "link": "https:\/\/rise.cs.berkeley.edu\/wp-content\/uploads\/2017\/03\/CIDR17.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18415456"
    },
    {
        "title": "SoC it to EM: EM side-channel attacks on a complex SoC [pdf]",
        "score": 38,
        "link": "https:\/\/www.iacr.org\/archive\/ches2015\/92930599\/92930599.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17220660"
    },
    {
        "title": "ICANN seeking input on ceding control of WHOIS privacy to governments [pdf]",
        "score": 38,
        "link": "https:\/\/www.icann.org\/en\/system\/files\/files\/proposed-interim-model-gdpr-compliance-summary-description-28feb18-en.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16491566"
    },
    {
        "title": "NIST Uncertainty Machine \u2013 User\u2019s Manual [pdf]",
        "score": 37,
        "link": "https:\/\/uncertainty.nist.gov\/NISTUncertaintyMachine-UserManual.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17008705"
    },
    {
        "title": "Three Generations of Asynchronous Microprocessors (2003) [pdf]",
        "score": 37,
        "link": "http:\/\/mail.async.caltech.edu\/Pubs\/PDF\/2003_threegen.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17546731"
    },
    {
        "title": "Insider Accounts of Computing and Life at BBN: A sixty-year report (2011) [pdf]",
        "score": 37,
        "link": "http:\/\/walden-family.com\/bbn\/bbn-print2.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17166680"
    },
    {
        "title": "Mill CPU is Immune to Spectre, Meltdown [pdf]",
        "score": 37,
        "link": "https:\/\/millcomputing.com\/blog\/wp-content\/uploads\/2018\/01\/Spectre.03.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16153570"
    },
    {
        "title": "Why Johnny Doesn\u2019t Use Two Factor \u2013 A Study of the FIDO U2F Security Key [pdf]",
        "score": 37,
        "link": "https:\/\/fc18.ifca.ai\/preproceedings\/111.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17732460"
    },
    {
        "title": "Contracts in OpenBSD (2010) [pdf]",
        "score": 36,
        "link": "http:\/\/kindsoftware.com\/documents\/reports\/Torlakcik10.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17939799"
    },
    {
        "title": "House of Commons committee re-invites to Mark Zuckerburg to appear [pdf]",
        "score": 36,
        "link": "https:\/\/www.parliament.uk\/documents\/commons-committees\/culture-media-and-sport\/180501-Chair-to-Rebecca-Stimson-Facebook-re-oral-evidence-follow-up.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16966882"
    },
    {
        "title": "Science and Linguistics (1940)",
        "score": 36,
        "link": "http:\/\/web.mit.edu\/allanmc\/www\/whorf.scienceandlinguistics.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16072798"
    },
    {
        "title": "Gray Failure: The Achilles' Heel of Cloud-Scale Systems [pdf]",
        "score": 36,
        "link": "https:\/\/www.cs.jhu.edu\/~huang\/paper\/grayfailure-hotos17.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16253405"
    },
    {
        "title": "KLEAK: Practical Kernel Memory Disclosure Detection [pdf]",
        "score": 36,
        "link": "https:\/\/netbsd.org\/gallery\/presentations\/maxv\/kleak.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18648060"
    },
    {
        "title": "The Design and Implementation of Hyperupcalls [pdf]",
        "score": 36,
        "link": "https:\/\/www.usenix.org\/system\/files\/conference\/atc18\/atc18-amit.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17513530"
    },
    {
        "title": "On the Work of Edward Witten (1990) [pdf]",
        "score": 35,
        "link": "http:\/\/bohr.physics.berkeley.edu\/reinsch\/phys105spr2014\/files\/Witten_Atiyah.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16453163"
    },
    {
        "title": "The function of dream sleep (1983) [pdf]",
        "score": 35,
        "link": "https:\/\/profiles.nlm.nih.gov\/ps\/access\/scbcdk.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18405810"
    },
    {
        "title": "Recollections of Early Chip Development at Intel [pdf]",
        "score": 34,
        "link": "https:\/\/lark.tu-sofia.bg\/ntt\/eusku\/readings\/art_1.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18624722"
    },
    {
        "title": "The tragedy of the commons in evolutionary biology (2007) [pdf]",
        "score": 34,
        "link": "http:\/\/www.kokkonuts.org\/wp-content\/uploads\/Rankin_ToC.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18557657"
    },
    {
        "title": "How News Aggregators Help Development Communities Shape and Share Knowledge [pdf]",
        "score": 34,
        "link": "https:\/\/ctreude.files.wordpress.com\/2018\/02\/icse18.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17057859"
    },
    {
        "title": "Unique IPv6 prefix per host [pdf]",
        "score": 34,
        "link": "https:\/\/ripe76.ripe.net\/presentations\/143-rfc8273-v5.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17091176"
    },
    {
        "title": "Pepper's Cone: An Inexpensive Do-It-Yourself 3D Display [pdf]",
        "score": 34,
        "link": "http:\/\/grail.cs.washington.edu\/wp-content\/uploads\/2017\/10\/luo2017pca.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16051078"
    },
    {
        "title": "BaSiX \u2013 A Basic interpreter written in TeX (1990) [pdf]",
        "score": 34,
        "link": "http:\/\/www.tug.org\/TUGboat\/tb11-3\/tb29greene.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17509519"
    },
    {
        "title": "The Metaphysical Transparency of Truth (2017) [pdf]",
        "score": 34,
        "link": "https:\/\/www.uvm.edu\/~lderosse\/transparency.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17581799"
    },
    {
        "title": "Stateless Network Functions (2017) [pdf]",
        "score": 34,
        "link": "https:\/\/www.usenix.org\/system\/files\/conference\/nsdi17\/nsdi17-kablan.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17470748"
    },
    {
        "title": "Direct Conversion Receivers: Some Amateur Radio History [pdf]",
        "score": 34,
        "link": "http:\/\/w7zoi.net\/dcrx68.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18449407"
    },
    {
        "title": "#ifdef considered harmful (1992) [pdf]",
        "score": 34,
        "link": "https:\/\/usenix.org\/legacy\/publications\/library\/proceedings\/sa92\/spencer.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17624014"
    },
    {
        "title": "The Forgetfulness of Beings (1997) [pdf]",
        "score": 33,
        "link": "https:\/\/maritain.nd.edu\/ama\/Ciapalo\/Ciapalo14.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17432560"
    },
    {
        "title": "Designing experiments for understanding performance [pdf]",
        "score": 33,
        "link": "https:\/\/timharris.uk\/misc\/five-ways.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16346138"
    },
    {
        "title": "Visual overview of radiator valves used in Germany [pdf]",
        "score": 33,
        "link": "https:\/\/www.eq-3.de\/Downloads\/eq3\/download%20bereich\/Ventilkompatibilitaeten-Model-N.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18532446"
    },
    {
        "title": "Code Inflation (2015) [pdf]",
        "score": 33,
        "link": "https:\/\/www.computer.org\/cms\/Computer.org\/ComputingNow\/issues\/2015\/04\/mso2015020010.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17787922"
    },
    {
        "title": "The Natural Rate of Interest Is Zero (2004) [pdf]",
        "score": 33,
        "link": "http:\/\/www.cfeps.org\/pubs\/wp-pdf\/WP37-MoslerForstater.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16414199"
    },
    {
        "title": "Timing Analysis of Keystrokes and Timing Attacks on SSH (2001) [pdf]",
        "score": 33,
        "link": "https:\/\/people.eecs.berkeley.edu\/~daw\/papers\/ssh-use01.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18557916"
    },
    {
        "title": "The History and Concept of Computability (1996) [pdf]",
        "score": 32,
        "link": "http:\/\/www.people.cs.uchicago.edu\/~soare\/History\/handbook.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18298389"
    },
    {
        "title": "NIST: Usability and Key Management [pdf]",
        "score": 32,
        "link": "https:\/\/csrc.nist.gov\/CSRC\/media\/Presentations\/Usability-and-Key-Management\/images-media\/Usability_and_Key_Mgmt.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17808910"
    },
    {
        "title": "An Analysis of the ProtonMail Cryptographic Architecture [pdf]",
        "score": 32,
        "link": "https:\/\/eprint.iacr.org\/2018\/1121.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18500924"
    },
    {
        "title": "Advances in OpenBSD packages [pdf]",
        "score": 32,
        "link": "https:\/\/www.openbsd.org\/papers\/eurobsdcon_2018_https.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18056774"
    },
    {
        "title": "A Model of Mental Fluidity and Analogy-Making (1994) [pdf]",
        "score": 32,
        "link": "http:\/\/portal.uni-freiburg.de\/cognition\/lehre\/archiv\/WS0910\/analogiemat\/6thsitting\/Vortrag\/copycatamodelofmentalfluidityandanalogymaking.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16299804"
    },
    {
        "title": "Comparison of Metaheuristics [pdf]",
        "score": 32,
        "link": "http:\/\/www2.cscamm.umd.edu\/publications\/BookChapter_CS-09-13.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18491278"
    },
    {
        "title": "Python\u2019s Meta-Object Protocol (2012) [pdf]",
        "score": 32,
        "link": "http:\/\/laser.inf.ethz.ch\/2012\/slides\/vanRossum\/laser-mop.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17669621"
    },
    {
        "title": "A History of Individually Wrapped Cheese Slices (1979) [pdf]",
        "score": 32,
        "link": "http:\/\/www56.homepage.villanova.edu\/david.nawrocki\/Arnold%20Nawrocki%20IWS%20Paper.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17639514"
    },
    {
        "title": "Voice-matching technology was developed by MIT\/Lincoln Labs under NSA contract [pdf]",
        "score": 32,
        "link": "https:\/\/assets.documentcloud.org\/documents\/4351987\/2006-01-04-Technology-That-Identifies-People-by.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16195038"
    },
    {
        "title": "Cognitive Networks: Brains, Internet, and Civilizations (2017) [pdf]",
        "score": 31,
        "link": "https:\/\/pdfs.semanticscholar.org\/342d\/672ba656102fd5a98df2c882723ef3022efe.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17485151"
    },
    {
        "title": "Squeak: A Language for Communicating with Mice (1985) [pdf]",
        "score": 31,
        "link": "http:\/\/ordiecole.com\/squeak\/cardelli_squeak1985.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17787781"
    },
    {
        "title": "Neuromorphic computing with multi-memristive synapses [pdf]",
        "score": 31,
        "link": "https:\/\/www.nature.com\/articles\/s41467-018-04933-y.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17712896"
    },
    {
        "title": "Revisiting the Risks of Bitcoin Currency Exchange Closure [pdf]",
        "score": 31,
        "link": "https:\/\/tylermoore.utulsa.edu\/toit17.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16337782"
    },
    {
        "title": "A Decade of Lattice Cryptography (2016) [pdf]",
        "score": 31,
        "link": "http:\/\/web.eecs.umich.edu\/~cpeikert\/pubs\/lattice-survey.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17701148"
    },
    {
        "title": "Field Guide for Designing Human Interaction with Intelligent Systems (1998) [pdf]",
        "score": 30,
        "link": "https:\/\/ston.jsc.nasa.gov\/collections\/trs\/_techrep\/TM-1998-208470.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18049945"
    },
    {
        "title": "Crabs: the bitmap terror (1985) [pdf]",
        "score": 30,
        "link": "http:\/\/lucacardelli.name\/Papers\/Crabs.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16967529"
    },
    {
        "title": "Sugar: Secure GPU Acceleration in Web Browsers [pdf]",
        "score": 30,
        "link": "https:\/\/www.ics.uci.edu\/~ardalan\/papers\/Yao_ASPLOS18.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17802567"
    },
    {
        "title": "Not All Patterns, but Enough (2008) [pdf]",
        "score": 30,
        "link": "https:\/\/www.cs.york.ac.uk\/plasma\/publications\/pdf\/MitchellRuncimanHaskell08.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18431228"
    },
    {
        "title": "Now you see them: DARPA's Stealth Revolution (2008) [pdf]",
        "score": 30,
        "link": "https:\/\/www.darpa.mil\/attachments\/(2O24)%20Global%20Nav%20-%20About%20Us%20-%20History%20-%20Resources%20-%2050th%20-%20Stealth%20(Approved).pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16610659"
    },
    {
        "title": "Personal Computing (1975) [pdf]",
        "score": 30,
        "link": "https:\/\/mprove.de\/diplom\/gui\/Kay75.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18044785"
    },
    {
        "title": "Composing with Tape Recorders: Musique Concr\u00e8te for Beginners [pdf]",
        "score": 30,
        "link": "https:\/\/monoskop.org\/images\/b\/b3\/Dwyer_Terence_Composing_with_Tape_Recorders_Musique_Concrete_for_Beginners.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17338092"
    },
    {
        "title": "Quantifying the Performance of Garbage Collection (2005) [pdf]",
        "score": 30,
        "link": "https:\/\/www.cs.umass.edu\/~emery\/pubs\/gcvsmalloc.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18760111"
    },
    {
        "title": "Cicada: Dependably Fast Multi-Core In-Memory Transactions (2017) [pdf]",
        "score": 29,
        "link": "https:\/\/hyeontaek.com\/papers\/cicada-sigmod2017.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18157973"
    },
    {
        "title": "Common Lisp, Typing and Mathematics (2001) [pdf]",
        "score": 29,
        "link": "https:\/\/www-fourier.ujf-grenoble.fr\/~sergerar\/Papers\/Ezcaray.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17774516"
    },
    {
        "title": "A Study of Linux File System Evolution (2013) [pdf]",
        "score": 29,
        "link": "https:\/\/www.usenix.org\/system\/files\/login\/articles\/03_lu_010-017_final.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17098261"
    },
    {
        "title": "The What\u2019s Next Intermittent Computing Architecture [pdf]",
        "score": 28,
        "link": "http:\/\/www.eecg.toronto.edu\/~ganesa10\/assets\/pdfs\/whatsnext-hpca2019.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18700616"
    },
    {
        "title": "Depth-first search and linear graph algorithms (1972) [pdf]",
        "score": 28,
        "link": "https:\/\/rjlipton.files.wordpress.com\/2009\/10\/dfs1971.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18518732"
    },
    {
        "title": "A Type of Simulation Which Some Experimental Evidence Suggests We Don't Live In [pdf]",
        "score": 28,
        "link": "https:\/\/philpapers.org\/archive\/ALEATO-6.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17718864"
    },
    {
        "title": "Napoleon as Organizational Designer (2009) [pdf]",
        "score": 28,
        "link": "http:\/\/www.dtic.mil\/dtic\/tr\/fulltext\/u2\/a501580.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17498577"
    },
    {
        "title": "Infinitesimal machinery (1993) [pdf]",
        "score": 28,
        "link": "https:\/\/people.eecs.berkeley.edu\/~pister\/290G\/Papers\/Feynman83.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18637226"
    },
    {
        "title": "The coolest way to generate binary strings (2013) [pdf]",
        "score": 28,
        "link": "https:\/\/www.researchgate.net\/profile\/Aaron_Williams10\/publication\/257376294_The_Coolest_Way_to_Generate_Binary_Strings\/links\/572a12cf08ae057b0a0787f9\/The-Coolest-Way-to-Generate-Binary-Strings.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18715055"
    },
    {
        "title": "Dynamic Hash Tables (1988) [pdf]",
        "score": 27,
        "link": "http:\/\/www.csd.uoc.gr\/~hy460\/pdf\/Dynamic%20Hash%20Tables.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16608613"
    },
    {
        "title": "Fault attacks on secure chips: from glitch to flash (2011) [pdf]",
        "score": 27,
        "link": "https:\/\/www.cl.cam.ac.uk\/~sps32\/ECRYPT2011_1.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17113364"
    },
    {
        "title": "A comparison of adaptive radix trees and hash tables [pdf]",
        "score": 26,
        "link": "https:\/\/bigdata.uni-saarland.de\/publications\/ARCD15.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17181334"
    },
    {
        "title": "Phoneme- and Word-Based Learning of English Words Presented to the Skin",
        "score": 26,
        "link": "https:\/\/research.fb.com\/wp-content\/uploads\/2018\/04\/a-comparative-study-of-phoneme-and-word-based-learning-of-english-words-presented-to-the-skin.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17214986"
    },
    {
        "title": "An Adaptive Packed-Memory Array (2007) [pdf]",
        "score": 26,
        "link": "https:\/\/www3.cs.stonybrook.edu\/~bender\/newpub\/BenderHu07-TODS.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16191144"
    },
    {
        "title": "The eXpress Data Path: Fast Programmable Packet Processing in the OS Kernel [pdf]",
        "score": 26,
        "link": "https:\/\/github.com\/tohojo\/xdp-paper\/blob\/master\/xdp-the-express-data-path.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18290518"
    },
    {
        "title": "Ace: a syntax-driven C preprocessor (1989) [pdf]",
        "score": 26,
        "link": "https:\/\/swtch.com\/gosling89ace.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17206416"
    },
    {
        "title": "Computation at the Edge of Chaos (1990) [pdf]",
        "score": 26,
        "link": "https:\/\/pdfs.semanticscholar.org\/cb4c\/df7812fc8ad56d13317eaabc99b76659e95f.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17515793"
    },
    {
        "title": "Internet Architecture Board on the Australian Assistance and Access Bill [pdf]",
        "score": 26,
        "link": "https:\/\/www.iab.org\/wp-content\/IAB-uploads\/2018\/09\/IAB-Comments-on-Australian-Assistance-and-Access-Bill-2018.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17958778"
    },
    {
        "title": "The Why of Y (2001) [pdf]",
        "score": 26,
        "link": "https:\/\/www.dreamsongs.com\/Files\/WhyOfY.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18637939"
    },
    {
        "title": "Delta Pointers: Buffer Overflow Checks Without the Checks [pdf]",
        "score": 26,
        "link": "https:\/\/www.cs.vu.nl\/~herbertb\/download\/papers\/delta-pointers_eurosys18.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16915957"
    },
    {
        "title": "A general memristor-based partial differential equation solver",
        "score": 26,
        "link": "http:\/\/www2.ece.rochester.edu\/~xiguo\/gomac15.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17662864"
    },
    {
        "title": "A Formal Apology for Metaphysics [pdf]",
        "score": 26,
        "link": "https:\/\/philpapers.org\/archive\/BARAFA-6.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18739311"
    },
    {
        "title": "Compiling machine learning programs via high-level tracing [pdf]",
        "score": 26,
        "link": "https:\/\/www.sysml.cc\/doc\/146.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18500784"
    },
    {
        "title": "Knut Wicksell: the Birth of Modern Monetary Policy (2004) [pdf]",
        "score": 26,
        "link": "https:\/\/www.dallasfed.org\/~\/media\/documents\/research\/ei\/ei0401.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18540149"
    },
    {
        "title": "Volatility and the Alchemy of Risk [pdf]",
        "score": 25,
        "link": "https:\/\/static1.squarespace.com\/static\/5581f17ee4b01f59c2b1513a\/t\/59ea16f7e5dd5b23063a3154\/1508513533577\/Artemis_Volatility+and+the+Alchemy+of+Risk_2017.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16409601"
    },
    {
        "title": "Leakage-Resilient Client-Side Deduplication of Encrypted Data in Cloud Storage [pdf]",
        "score": 25,
        "link": "https:\/\/eprint.iacr.org\/2011\/538.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17993796"
    },
    {
        "title": "Engineering and Software Engineering (2010) [pdf]",
        "score": 25,
        "link": "http:\/\/mcs.open.ac.uk\/mj665\/FoSEZurich2010.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17125383"
    },
    {
        "title": "Dthreads: Efficient Deterministic Multithreading (2011) [pdf]",
        "score": 25,
        "link": "http:\/\/people.cs.ksu.edu\/~danielwang\/Investigation\/System_Security\/dthreads-sosp11.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17756774"
    },
    {
        "title": "Hardware Masking, Revisited [pdf]",
        "score": 25,
        "link": "https:\/\/www.emsec.rub.de\/media\/crypto\/veroeffentlichungen\/2018\/04\/16\/PDN_Masking.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18154230"
    },
    {
        "title": "The State of the TclQuadcode compiler (2017) [pdf]",
        "score": 25,
        "link": "https:\/\/www.tcl.tk\/community\/tcl2017\/assets\/talk101\/Paper.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18179974"
    },
    {
        "title": "Multiple Linear Regression (2012) [pdf]",
        "score": 25,
        "link": "http:\/\/mezeylab.cb.bscb.cornell.edu\/labmembers\/documents\/supplement%205%20-%20multiple%20regression.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17787615"
    },
    {
        "title": "XDP: 1.5 years in production [pdf]",
        "score": 25,
        "link": "http:\/\/vger.kernel.org\/lpc_net2018_talks\/LPC_XDP_Shirokov_v2.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18493304"
    },
    {
        "title": "The Early History of Programming Languages (1976) [pdf]",
        "score": 25,
        "link": "http:\/\/bitsavers.trailing-edge.com\/pdf\/stanford\/cs_techReports\/STAN-CS-76-562_EarlyDevelPgmgLang_Aug76.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17735866"
    },
    {
        "title": "RaiBlocks: A Feeless Distributed Cryptocurrency Network [pdf]",
        "score": 25,
        "link": "https:\/\/raiblocks.net\/media\/RaiBlocks_Whitepaper__English.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16053048"
    },
    {
        "title": "How Bad Is Selfish Routing? (2001) [pdf]",
        "score": 24,
        "link": "http:\/\/theory.stanford.edu\/~tim\/papers\/routing.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17741641"
    },
    {
        "title": "Things We Need to Know About Technological Change (1998) [pdf]",
        "score": 24,
        "link": "http:\/\/web.cs.ucdavis.edu\/~rogaway\/classes\/188\/materials\/postman.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17522319"
    },
    {
        "title": "Fast-Path Loop Unrolling of Non-Counted Loops [pdf]",
        "score": 24,
        "link": "http:\/\/ssw.jku.at\/General\/Staff\/Leopoldseder\/manlang2018-fast_path_unrolling_authorpreprint.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17643802"
    },
    {
        "title": "How to use 1000 registers (1979) [pdf]",
        "score": 24,
        "link": "http:\/\/caltechconf.library.caltech.edu\/200\/1\/RichardLSites.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18098589"
    },
    {
        "title": "HSN-1000 Nuclear Event Detector (2005) [pdf]",
        "score": 24,
        "link": "http:\/\/www.maxwell.com\/images\/documents\/hsn1000_rev3.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18532536"
    },
    {
        "title": "Speech Intellegibility in Naval Aircraft Radios (1972) [pdf]",
        "score": 24,
        "link": "http:\/\/www.dtic.mil\/dtic\/tr\/fulltext\/u2\/748202.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17534480"
    },
    {
        "title": "Realizability of Graphs (2008) [pdf]",
        "score": 24,
        "link": "http:\/\/faculty.bard.edu\/mbelk\/DiscreteMathDayTalk.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17956589"
    },
    {
        "title": "The Unreasonable Effectiveness of Data (2009) [pdf]",
        "score": 24,
        "link": "https:\/\/static.googleusercontent.com\/media\/research.google.com\/en\/\/pubs\/archive\/35179.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16096186"
    },
    {
        "title": "Good Ideas, Through the Looking Glass (2005) [pdf]",
        "score": 23,
        "link": "https:\/\/www.inf.ethz.ch\/personal\/wirth\/Articles\/GoodIdeas_origFig.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17331168"
    },
    {
        "title": "On-Chip Interconnection Architecture of the Tile Processor (2007) [pdf]",
        "score": 23,
        "link": "https:\/\/www.princeton.edu\/~wentzlaf\/documents\/Wentzlaff.2007.IEEE_Micro.Tilera.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17741972"
    },
    {
        "title": "Million Dollar Problems (2000) [pdf]",
        "score": 23,
        "link": "http:\/\/www.math.buffalo.edu\/~sww\/0papers\/million.buck.problems.mi.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18005183"
    },
    {
        "title": "Real world DNSSEC+DANE for secure inter-domain mail transport [pdf]",
        "score": 23,
        "link": "https:\/\/static.ptbl.co\/static\/attachments\/169319\/1520904692.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16617893"
    },
    {
        "title": "Fountain codes (2005) [pdf]",
        "score": 23,
        "link": "https:\/\/docs.switzernet.com\/people\/emin-gabrielyan\/060112-capillary-references\/ref\/MacKay05.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18385386"
    },
    {
        "title": "A Quick Reference to Airfield Standards [pdf]",
        "score": 23,
        "link": "https:\/\/www.faa.gov\/airports\/southern\/airport_safety\/part139_cert\/media\/aso-airfield-standards-quick-reference.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18492930"
    },
    {
        "title": "The SIGABA\/ECM II Cipher Machine: \u201cA Beautiful Idea\u201d (2015) [pdf]",
        "score": 23,
        "link": "https:\/\/www.nsa.gov\/about\/cryptologic-heritage\/historical-figures-publications\/publications\/assets\/files\/sigaba-ecm-ii\/The_SIGABA_ECM_Cipher_Machine_A_Beautiful_Idea3.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17549897"
    },
    {
        "title": "Final Report on the August 14, 2003 Blackout (2004) [pdf]",
        "score": 22,
        "link": "https:\/\/www.energy.gov\/sites\/prod\/files\/oeprod\/DocumentsandMedia\/BlackoutFinal-Web.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17168338"
    },
    {
        "title": "Neurology in Ancient Faces (2001) [pdf]",
        "score": 22,
        "link": "https:\/\/www.ncbi.nlm.nih.gov\/pmc\/articles\/PMC1737287\/pdf\/v070p00524.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16118387"
    },
    {
        "title": "Zipf\u2019s Law in Passwords (2017) [pdf]",
        "score": 22,
        "link": "http:\/\/wangdingg.weebly.com\/uploads\/2\/0\/3\/6\/20366987\/ieeetifs17_final.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18062130"
    },
    {
        "title": "Doppelg\u00e4nger Finder: Taking Stylometry to the Underground (2014) [pdf]",
        "score": 22,
        "link": "https:\/\/www1.icsi.berkeley.edu\/~sadia\/papers\/oakland2014-underground.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18328270"
    },
    {
        "title": "Hybrid Field-Effect Transistors Based on Cellulose Fiber Paper (2008) [pdf]",
        "score": 22,
        "link": "https:\/\/run.unl.pt\/bitstream\/10362\/3242\/1\/Fortunato_2008.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18520767"
    },
    {
        "title": "The Potentiometer Handbook (1975) [pdf]",
        "score": 22,
        "link": "https:\/\/www.bourns.com\/pdfs\/OnlinePotentiometerHandbook.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18391076"
    },
    {
        "title": "Strongly Typed Heterogeneous Collections (2004) [pdf]",
        "score": 22,
        "link": "http:\/\/okmij.org\/ftp\/Haskell\/HList-ext.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18004708"
    },
    {
        "title": "Hacking chemical plants for competition and extortion (2015) [pdf]",
        "score": 21,
        "link": "https:\/\/www.blackhat.com\/docs\/us-15\/materials\/us-15-Krotofil-Rocking-The-Pocket-Book-Hacking-Chemical-Plant-For-Competition-And-Extortion-wp.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18692902"
    },
    {
        "title": "Compiled and Vectorized Queries [pdf]",
        "score": 21,
        "link": "http:\/\/www.vldb.org\/pvldb\/vol11\/p2209-kersten.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18081477"
    },
    {
        "title": "The Effect of Zoning on Housing Prices \u2013 Research from Australia's Reserve Bank [pdf]",
        "score": 21,
        "link": "https:\/\/www.rba.gov.au\/publications\/rdp\/2018\/pdf\/rdp2018-03.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16571996"
    },
    {
        "title": "Debugging Distributed Systems With Why-Across-Time Provenance [pdf]",
        "score": 21,
        "link": "https:\/\/mwhittaker.github.io\/publications\/wat_SOCC18.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18193921"
    },
    {
        "title": "Mathematics applied to dressmaking (1993) [pdf]",
        "score": 21,
        "link": "https:\/\/www.lms.ac.uk\/sites\/lms.ac.uk\/files\/1994%20Mathematics%20applied%20to%20dressmaking%20%28preprint%29.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18298586"
    },
    {
        "title": "The Psychology of Security (2008) [pdf]",
        "score": 21,
        "link": "https:\/\/www.schneier.com\/academic\/paperfiles\/paper-psychology-of-security.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17958560"
    },
    {
        "title": "The Postgres Rule Manager (1988) [pdf]",
        "score": 21,
        "link": "http:\/\/db.cs.berkeley.edu\/papers\/tse88-rulemgr.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17581880"
    },
    {
        "title": "Failure Rates in Introductory Programming (2007) [pdf]",
        "score": 21,
        "link": "http:\/\/users-cs.au.dk\/mic\/publications\/journal\/25--bulletin2007.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18186847"
    },
    {
        "title": "A Scalable, Commodity Data Center Network Architecture (2008) [pdf]",
        "score": 21,
        "link": "http:\/\/ccr.sigcomm.org\/online\/files\/p63-alfares.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17290388"
    },
    {
        "title": "Cache Modeling and Optimization Using Miniature Simulations [pdf]",
        "score": 20,
        "link": "https:\/\/www.usenix.org\/system\/files\/conference\/atc17\/atc17-waldspurger.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18318628"
    },
    {
        "title": "Is the scientific paper fraudulent? (1964) [pdf]",
        "score": 20,
        "link": "http:\/\/blog.thegrandlocus.com\/static\/misc\/is_the_scientific_paper_fraudulent.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17624787"
    },
    {
        "title": "Five deep questions in computing (2008) [pdf]",
        "score": 20,
        "link": "http:\/\/www.cs.cmu.edu\/~wing\/publications\/Wing08.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17755605"
    },
    {
        "title": "Discerning the Out-Of-Order Advantage: Is It Speculation or Dynamism? (2013) [pdf]",
        "score": 20,
        "link": "http:\/\/zilles.cs.illinois.edu\/papers\/mcfarlin_asplos_2013.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17881132"
    },
    {
        "title": "Intentional Acoustic Interference Damages Availability and Integrity in HDDs [pdf]",
        "score": 20,
        "link": "https:\/\/spqr.eecs.umich.edu\/papers\/bolton-blue-note-IEEESSP-2018.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17295595"
    },
    {
        "title": "Comprehending Ringads (2016) [pdf]",
        "score": 20,
        "link": "http:\/\/www.cs.ox.ac.uk\/jeremy.gibbons\/publications\/ringads.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17001478"
    },
    {
        "title": "A Computer Scientist\u2019s Guide to Cell Biology [pdf]",
        "score": 19,
        "link": "http:\/\/www.cs.cmu.edu\/~wcohen\/GuideToBiology-sampleChapter-release1.4.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18778499"
    },
    {
        "title": "Lunar Laser Ranging: a continuing legacy of the Apollo program (1994) [pdf]",
        "score": 19,
        "link": "https:\/\/www.hq.nasa.gov\/alsj\/LRRR-94-0193.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17780532"
    },
    {
        "title": "Understanding Reduced-Voltage Operation in Modern DRAM Devices [pdf]",
        "score": 19,
        "link": "http:\/\/www.pdl.cmu.edu\/PDL-FTP\/NVM\/17sigmetrics_voltron.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18307111"
    },
    {
        "title": "Better documentation \u2013 on the web and for LibreSSL [pdf]",
        "score": 19,
        "link": "https:\/\/www.openbsd.org\/papers\/eurobsdcon2018-mandoc.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18110033"
    },
    {
        "title": "Open-Source Bitstream Generation (2013) [pdf]",
        "score": 19,
        "link": "https:\/\/www.isi.edu\/sites\/default\/files\/users\/nsteiner\/soni-2013-bitstream-fccm13.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18488020"
    },
    {
        "title": "Cherry-Picking and the Scientific Method (2013) [pdf]",
        "score": 19,
        "link": "http:\/\/www.cs.cofc.edu\/~bowring\/classes\/csci%20362\/docs\/p32-neville-neil.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18492261"
    },
    {
        "title": "Construction of the Transreal Numbers and Algebraic Transfields [pdf]",
        "score": 18,
        "link": "http:\/\/www.iaeng.org\/IJAM\/issues_v46\/issue_1\/IJAM_46_1_03.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16730457"
    },
    {
        "title": "Crypko White Paper: Cryptocollectible Game Empowered by GANs [pdf]",
        "score": 18,
        "link": "https:\/\/crypko.ai\/static\/files\/crypko-whitepaper.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16990347"
    },
    {
        "title": "Two curious integrals and a graphic proof (2014) [pdf]",
        "score": 18,
        "link": "http:\/\/schmid-werren.ch\/hanspeter\/publications\/2014elemath.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17883349"
    },
    {
        "title": "Xoodoo cookbook [pdf]",
        "score": 18,
        "link": "https:\/\/eprint.iacr.org\/2018\/767.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17844542"
    },
    {
        "title": "CastSan: efficient detection of bad C++ casts [pdf]",
        "score": 18,
        "link": "https:\/\/www.docdroid.net\/INWYBF7\/castsan-esorics18.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17783317"
    },
    {
        "title": "Beastly Numbers (1996) [pdf]",
        "score": 17,
        "link": "https:\/\/people.eecs.berkeley.edu\/~wkahan\/tests\/numbeast.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17006041"
    },
    {
        "title": "Julia for R programmers [pdf]",
        "score": 17,
        "link": "https:\/\/www.stat.wisc.edu\/~bates\/JuliaForRProgrammers.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17723977"
    },
    {
        "title": "The case for writing papers in economics using faKe LaTeX [pdf]",
        "score": 17,
        "link": "http:\/\/www.farmdoc.illinois.edu\/irwin\/research\/The_Case_for_Fake_LaTeX_Body_Feb%202018.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16592401"
    },
    {
        "title": "History of Combinatorial Generation (2004) [pdf]",
        "score": 17,
        "link": "http:\/\/www.antiquark.com\/blogimg\/fasc4b.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16395222"
    },
    {
        "title": "Scrapino \u2013 Self-sustainable robot from e-scrap using renewable energy [pdf]",
        "score": 17,
        "link": "https:\/\/www.sciencedirect.com\/science\/article\/pii\/S2405896318328593\/pdf?md5=ac7fae174710da0a5035026f88e0559b&pid=1-s2.0-S2405896318328593-main.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18687923"
    },
    {
        "title": "Attack Directories, Not Caches: Side-Channel Attacks in a Non-Inclusive World [pdf]",
        "score": 17,
        "link": "http:\/\/iacoma.cs.uiuc.edu\/iacoma-papers\/ssp19.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18407850"
    },
    {
        "title": "The Translucent File Service (1988) [pdf]",
        "score": 17,
        "link": "http:\/\/mcvoy.com\/lm\/papers\/SunOS.tfs.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17743933"
    },
    {
        "title": "Criminal Law 2.0 (2015) [pdf]",
        "score": 16,
        "link": "https:\/\/georgetownlawjournal.org\/assets\/kozinski-arcp-preface-9a990f08f3f006558eaa03ccc440d3078f5899b3426ec47aaedb89c606caeae7.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16616722"
    },
    {
        "title": "Map Projections \u2013 A Working Manual (1987) [pdf]",
        "score": 16,
        "link": "https:\/\/pubs.usgs.gov\/pp\/1395\/report.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18099029"
    },
    {
        "title": "VrankenFuzz \u2013 a multi-sensor, multi-generator mutational fuzz testing engine [pdf]",
        "score": 16,
        "link": "https:\/\/guidovranken.files.wordpress.com\/2018\/07\/vrankenfuzz.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17468377"
    },
    {
        "title": "Can moons have moons? [pdf]",
        "score": 16,
        "link": "https:\/\/arxiv.org\/pdf\/1810.03304.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18217646"
    },
    {
        "title": "Machine Learning on 2KB of RAM [pdf]",
        "score": 15,
        "link": "http:\/\/manikvarma.org\/pubs\/kumar17.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18231239"
    },
    {
        "title": "Quaternions and Reflections (1946) [pdf]",
        "score": 15,
        "link": "http:\/\/www.math.utah.edu\/~ptrapa\/math-library\/coxeter\/Coxeter-Quaternions-and-reflections-AMM-1946.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18525801"
    },
    {
        "title": "Physical Addressing on Real Hardware in Isabelle\/HOL [pdf]",
        "score": 15,
        "link": "https:\/\/people.inf.ethz.ch\/troscoe\/pubs\/achermann_itp_2018.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18373896"
    },
    {
        "title": "Product Evaluation of the Zilog Z80-CTC (1979) [pdf]",
        "score": 15,
        "link": "http:\/\/smithsonianchips.si.edu\/ice\/OCR_ScanPE125\/PE125(10379-K).pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17739214"
    },
    {
        "title": "A Survey of Rollback-Recovery Protocols in Message-Passing Systems (2002) [pdf]",
        "score": 15,
        "link": "https:\/\/www.cs.utexas.edu\/~lorenzo\/papers\/SurveyFinal.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16886165"
    },
    {
        "title": "Examining Children\u2019s Online Privacy Protection Act compliance [pdf]",
        "score": 15,
        "link": "https:\/\/petsymposium.org\/2018\/files\/papers\/issue3\/popets-2018-0021.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16848148"
    },
    {
        "title": "The Complexity of Songs (1977) [pdf]",
        "score": 15,
        "link": "http:\/\/fivedots.coe.psu.ac.th\/Software.coe\/242-535_ADA\/Background\/Readings\/knuth_song_complexity.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18044603"
    },
    {
        "title": "Differentiable Programming for Image Processing and Deep Learning in Halide [pdf]",
        "score": 14,
        "link": "https:\/\/people.csail.mit.edu\/tzumao\/gradient_halide\/gradient_halide.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17929144"
    },
    {
        "title": "The Debasement Puzzle: an Essay on Medieval Monetary History (1997) [pdf]",
        "score": 14,
        "link": "https:\/\/www.minneapolisfed.org\/research\/qr\/qr2142.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18692170"
    },
    {
        "title": "An IPv6 Update [pdf]",
        "score": 14,
        "link": "https:\/\/conference.apnic.net\/46\/assets\/files\/APNC402\/An-IPv6-Update.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17957531"
    },
    {
        "title": "Revisiting a Summer Vacation: Digital Restoration and Typesetter Forensics [pdf]",
        "score": 14,
        "link": "http:\/\/www.eprg.org\/papers\/202paper.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16051520"
    },
    {
        "title": "C Standard Undefined Behavior vs. Wittgenstein [pdf]",
        "score": 14,
        "link": "http:\/\/www.yodaiken.com\/wp-content\/uploads\/2018\/05\/ub-1.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17195710"
    },
    {
        "title": "NY Attorney General Report on Crytpocurrency Market Integrity",
        "score": 13,
        "link": "https:\/\/ag.ny.gov\/sites\/default\/files\/vmii_report.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18017922"
    },
    {
        "title": "Evolution of Multicellular Computing: Parallels with Multicellular Life (2009) [pdf]",
        "score": 13,
        "link": "http:\/\/www.evolutionofcomputing.org\/Birmingham09Seminar.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18654989"
    },
    {
        "title": "Enterprise Objects Framework Developer\u2019s Guide [pdf]",
        "score": 13,
        "link": "https:\/\/developer.apple.com\/library\/archive\/documentation\/LegacyTechnologies\/WebObjects\/WebObjects_4.0\/System\/Documentation\/Developer\/EnterpriseObjects\/Guide\/EOFDevGuide.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17591554"
    },
    {
        "title": "USPTO issues 10 millionth patent [pdf]",
        "score": 13,
        "link": "https:\/\/10millionpatents.uspto.gov\/docs\/patent10million.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17349939"
    },
    {
        "title": "The Keyhole Problem (2002) [pdf]",
        "score": 13,
        "link": "http:\/\/www.aristeia.com\/TKP\/draftPaper.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18293263"
    },
    {
        "title": "Abel's Theorem in Problems and Solutions (2004) [pdf]",
        "score": 13,
        "link": "http:\/\/www.maths.ed.ac.uk\/~v1ranick\/papers\/abel.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17209635"
    },
    {
        "title": "Design of the Burroughs B1700 (1972) [pdf]",
        "score": 13,
        "link": "https:\/\/pdfs.semanticscholar.org\/cff6\/6b2eba20a7172c5db281e84600049e1e82fe.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17114482"
    },
    {
        "title": "The Difficulty of Faking Data (1999) [pdf]",
        "score": 13,
        "link": "http:\/\/www.kkuniyuk.com\/Math119FakingData.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17020226"
    },
    {
        "title": "A Brief History of Just-In-Time (2003) [pdf]",
        "score": 12,
        "link": "http:\/\/eecs.ucf.edu\/~dcm\/Teaching\/COT4810-Spring2011\/Literature\/JustInTimeCompilation.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18693500"
    },
    {
        "title": "The Cult of the Bound Variable: ICFP Programming Contest (2006) [pdf]",
        "score": 12,
        "link": "http:\/\/boundvariable.org\/press\/tr-06-163.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18708366"
    },
    {
        "title": "The Civic Labor of Online Moderators (2016) [pdf]",
        "score": 12,
        "link": "http:\/\/blogs.oii.ox.ac.uk\/ipp-conference\/sites\/ipp\/files\/documents\/JNM-The_Civic_Labor_of_Online_Moderators__Internet_Politics_Policy_.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18506746"
    },
    {
        "title": "Technical Specification for the Delivery of Television Programs to the BBC [pdf]",
        "score": 12,
        "link": "http:\/\/dpp-assets.s3.amazonaws.com\/wp-content\/uploads\/specs\/bbc\/TechnicalDeliveryStandardsBBCFile.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18204099"
    },
    {
        "title": "Tribute to Vladimir Arnold (2012) [pdf]",
        "score": 12,
        "link": "http:\/\/www.ams.org\/notices\/201203\/rtx120300378p.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16330925"
    },
    {
        "title": "Falcon Heavy Demonstration Mission (overview and timeline) [pdf]",
        "score": 12,
        "link": "http:\/\/www.spacex.com\/sites\/spacex\/files\/falconheavypresskit_v1.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16317304"
    },
    {
        "title": "The missing link: explaining ELF static linking, semantically [pdf]",
        "score": 12,
        "link": "http:\/\/dominic-mulligan.co.uk\/wp-content\/uploads\/2011\/08\/oopsla-elf-linking-2016.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18713230"
    },
    {
        "title": "Response time in man-computer conversational transactions (1968) [pdf]",
        "score": 12,
        "link": "https:\/\/www.computer.org\/csdl\/proceedings\/afips\/1968\/5072\/00\/50720267.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16809846"
    },
    {
        "title": "Rigorous Benchmarking in Reasonable Time (2013) [pdf]",
        "score": 12,
        "link": "https:\/\/kar.kent.ac.uk\/33611\/7\/paper.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16843808"
    },
    {
        "title": "TxFS: Leveraging File-System Crash Consistency to Provide Transactions [pdf]",
        "score": 12,
        "link": "http:\/\/www.cs.utexas.edu\/%7Evijay\/papers\/atc18-txfs.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17807272"
    },
    {
        "title": "Networking Named Content (2009) [pdf]",
        "score": 12,
        "link": "https:\/\/conferences.sigcomm.org\/co-next\/2009\/papers\/Jacobson.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17933543"
    },
    {
        "title": "The grand challenges of \u201cScience Robotics\u201d [pdf]",
        "score": 11,
        "link": "http:\/\/www.nanoscience.gatech.edu\/paper\/2018\/18_SR_01.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17161642"
    },
    {
        "title": "What is the Monster? (2002) [pdf]",
        "score": 11,
        "link": "http:\/\/www.ams.org\/notices\/200209\/what-is.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18483929"
    },
    {
        "title": "The On-Line Encyclopedia of Integer Sequences [pdf]",
        "score": 11,
        "link": "https:\/\/www.ams.org\/journals\/notices\/201809\/rnoti-p1062.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18015493"
    },
    {
        "title": "The Most Influential Paper Gerard Salton Never Wrote (2004) [pdf]",
        "score": 11,
        "link": "https:\/\/www.ideals.illinois.edu\/bitstream\/handle\/2142\/1697\/Dubin748764.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18201597"
    },
    {
        "title": "Applying auction mechanisms to meeting scheduling (2010) [pdf]",
        "score": 11,
        "link": "https:\/\/www.seas.harvard.edu\/sites\/default\/files\/files\/archived\/Xu.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17390105"
    },
    {
        "title": "An Introduction to Information Security [pdf]",
        "score": 11,
        "link": "https:\/\/nvlpubs.nist.gov\/nistpubs\/SpecialPublications\/NIST.SP.800-12r1.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16458577"
    },
    {
        "title": "Categorifying cardinal arithmetic [pdf]",
        "score": 11,
        "link": "http:\/\/www.math.jhu.edu\/~eriehl\/arithmetic.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17702228"
    },
    {
        "title": "*ANY* Android manufacturer monitors users without consent [pdf]",
        "score": 11,
        "link": "http:\/\/eprints.networks.imdea.org\/1744\/1\/trackers.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18635062"
    },
    {
        "title": "Legal Curiosities: Fact or Fable? (2015) [pdf]",
        "score": 10,
        "link": "http:\/\/www.lawcom.gov.uk\/app\/uploads\/2015\/03\/Legal_Oddities.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18654438"
    },
    {
        "title": "How We Cracked the Code Book Ciphers (2000) [pdf]",
        "score": 10,
        "link": "http:\/\/codebook.org\/codebook_solution.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18692477"
    },
    {
        "title": "Alfred Stieglitz's Lantern Slides: History, Technique and Analysis (2015) [pdf]",
        "score": 10,
        "link": "https:\/\/www.researchgate.net\/profile\/Rosina_Herrera_Garrido\/publication\/266251396_Alfred_Stieglitz%27s_Lantern_Slides_History_Technique_and_Technical_Analysis\/links\/54f81f290cf2ccffe9dcd349\/Alfred-Stieglitzs-Lantern-Slides-History-Technique-and-Technical-Analysis.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17905829"
    },
    {
        "title": "Remember the Vasa [pdf]",
        "score": 10,
        "link": "http:\/\/open-std.org\/JTC1\/SC22\/WG21\/docs\/papers\/2018\/p0977r0.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17172057"
    },
    {
        "title": "Design and Evaluation of a Continuous Consistency Model for Replicated Services [pdf]",
        "score": 10,
        "link": "https:\/\/www.usenix.org\/legacy\/event\/osdi00\/full_papers\/yuvahdat\/yuvahdat.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16831825"
    },
    {
        "title": "Taming Performance Variability [pdf]",
        "score": 10,
        "link": "https:\/\/www.usenix.org\/system\/files\/osdi18-maricq.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18169385"
    },
    {
        "title": "GLL Parsing with Flexible Combinators [pdf]",
        "score": 10,
        "link": "https:\/\/pure.royalholloway.ac.uk\/portal\/files\/31169565\/paper.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18399899"
    },
    {
        "title": "Representing Control in the Presence of One-Shot Continuations (1996) [pdf]",
        "score": 10,
        "link": "https:\/\/www.cs.indiana.edu\/~dyb\/pubs\/call1cc.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16960740"
    },
    {
        "title": "Grand Pwning Unit: Accelerating Microarchitectural Attacks with the GPU [pdf]",
        "score": 10,
        "link": "https:\/\/www.vusec.net\/wp-content\/uploads\/2018\/05\/glitch.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16984868"
    },
    {
        "title": "Privacy by Design (2010) [pdf]",
        "score": 10,
        "link": "https:\/\/link.springer.com\/content\/pdf\/10.1007%2Fs12394-010-0055-x.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16262824"
    },
    {
        "title": "Status of collectively bargained benefits [pdf]",
        "score": 9,
        "link": "http:\/\/www.milliman.com\/uploadedFiles\/insight\/2018\/status-collectively-bargained-benefits.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17741249"
    },
    {
        "title": "The errors, insights and lessons of famous AI predictions (2014) [pdf]",
        "score": 9,
        "link": "http:\/\/www.fhi.ox.ac.uk\/wp-content\/uploads\/FAIC.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17953587"
    },
    {
        "title": "Politics in the Facebook Era: Evidence from the 2016 US Presidential Elections [pdf]",
        "score": 9,
        "link": "https:\/\/warwick.ac.uk\/fac\/soc\/economics\/research\/centres\/cage\/manage\/publications\/389-2018_redoano.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18472189"
    },
    {
        "title": "A Minimal ZZStructure Navigator Using a ZigZag-Style Interface (2013) [pdf]",
        "score": 9,
        "link": "http:\/\/www.lord-enki.net\/ZigZagProject.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17708111"
    },
    {
        "title": "Rewrite Combinators in Haskell [pdf]",
        "score": 9,
        "link": "http:\/\/dev.stephendiehl.com\/rewrite.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18085353"
    },
    {
        "title": "Mata Hari with a Clockwork Eye, Alligators in the Sewer (1963) [pdf]",
        "score": 9,
        "link": "http:\/\/graphics8.nytimes.com\/packages\/pdf\/books\/Pynchon_V.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16782360"
    },
    {
        "title": "Facilitation Tools for Meetings and Workshops (2013) [pdf]",
        "score": 8,
        "link": "https:\/\/seedsforchange.org.uk\/tools.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18146906"
    },
    {
        "title": "The regress argument against Cartesian skepticism (2012) [pdf]",
        "score": 8,
        "link": "http:\/\/individual.utoronto.ca\/jmwilson\/Wilson-The-Regress-Argument-Against-Cartesian-Skepticism.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17992102"
    },
    {
        "title": "Resource management: Linux kernel Namespaces and  cgroups (2013) [pdf]",
        "score": 8,
        "link": "http:\/\/www.haifux.org\/lectures\/299\/netLec7.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18768992"
    },
    {
        "title": "Counter Culture: Towards a History of Greek Numeracy (2002) [pdf]",
        "score": 8,
        "link": "http:\/\/worrydream.com\/refs\/Netz%20-%20Counter%20Culture%20-%20Towards%20a%20History%20of%20Greek%20Numeracy.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18554695"
    },
    {
        "title": "Collapsing a Reflective Tower (2016) [pdf]",
        "score": 8,
        "link": "http:\/\/lampwww.epfl.ch\/~amin\/doc\/lms-black.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18751084"
    },
    {
        "title": "AI and International Trade [pdf]",
        "score": 8,
        "link": "http:\/\/www.nber.org\/papers\/w24254.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16316635"
    },
    {
        "title": "Making \u201cPush on Green\u201d a Reality (2014) [pdf]",
        "score": 8,
        "link": "https:\/\/www.usenix.org\/system\/files\/login\/articles\/login_1410_05_klein.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16956505"
    },
    {
        "title": "Land Surveying in Ancient Egypt [pdf]",
        "score": 8,
        "link": "https:\/\/www.fig.net\/resources\/proceedings\/fig_proceedings\/cairo\/papers\/wshs_02\/wshs02_02_paulson.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17215332"
    },
    {
        "title": "Ramanujan graphs in cryptography [pdf]",
        "score": 7,
        "link": "https:\/\/eprint.iacr.org\/2018\/593.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17316494"
    },
    {
        "title": "Precise and Scalable Detection of Double-Fetch Bugs in OS Kernels [pdf]",
        "score": 7,
        "link": "https:\/\/www-users.cs.umn.edu\/~kjlu\/papers\/deadline.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18158229"
    },
    {
        "title": "WireGuard: Next Generation Kernel Network Tunnel [pdf]",
        "score": 7,
        "link": "https:\/\/www.wireguard.com\/papers\/wireguard.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17690598"
    },
    {
        "title": "A New Refutation of Time (1947) [pdf]",
        "score": 7,
        "link": "https:\/\/www.gwern.net\/docs\/borges\/1947-borges-anewrefutationoftime.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16483740"
    },
    {
        "title": "Method and apparatus for controlling electric currents (1925) [pdf]",
        "score": 7,
        "link": "https:\/\/patentimages.storage.googleapis.com\/fa\/5d\/33\/ed2769d48fac4d\/US1745175.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16473456"
    },
    {
        "title": "Physicians give patients an average of 11 seconds before cutting them off [pdf]",
        "score": 7,
        "link": "https:\/\/link.springer.com\/content\/pdf\/10.1007%2Fs11606-018-4540-5.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17582008"
    },
    {
        "title": "Kodak Professional digital camera systems 1987-2004 [pdf]",
        "score": 7,
        "link": "http:\/\/www.nikonweb.com\/files\/DCS_Story.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17606171"
    },
    {
        "title": "Hardware Multithreaded Transactions [pdf]",
        "score": 7,
        "link": "http:\/\/liberty.princeton.edu\/Publications\/asplos18_hmtx.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17860871"
    },
    {
        "title": "Life Beyond Distributed Transactions: An Apostate\u2019s Opinion [pdf]",
        "score": 7,
        "link": "http:\/\/adrianmarriott.net\/logosroot\/papers\/LifeBeyondTxns.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16113344"
    },
    {
        "title": "A User-Centred Approach to Functions in Excel (2003)",
        "score": 7,
        "link": "https:\/\/www.microsoft.com\/en-us\/research\/wp-content\/uploads\/2016\/07\/excel.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16562300"
    },
    {
        "title": "The Flatness of U.S. States [pdf]",
        "score": 6,
        "link": "http:\/\/www.disruptivegeo.com\/blog\/wp-content\/uploads\/2014\/08\/FlatMap_GeographicalReview_DobsonCampbell_2013Nov.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17433904"
    },
    {
        "title": "Throwhammer: Rowhammer Attacks Over the Network and Defenses [pdf]",
        "score": 6,
        "link": "https:\/\/www.cs.vu.nl\/~herbertb\/download\/papers\/throwhammer_atc18.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17038628"
    },
    {
        "title": "Mozilla grant for machine learning projects [pdf]",
        "score": 6,
        "link": "https:\/\/blog.mozilla.org\/wp-content\/uploads\/2018\/06\/2018-Mozilla-Awards-Application-Guide_-Creative-Media-Awards.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17336411"
    },
    {
        "title": "The C Object System [pdf]",
        "score": 6,
        "link": "http:\/\/ldeniau.web.cern.ch\/ldeniau\/html\/cos-dls09-draft.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18775826"
    },
    {
        "title": "Experience with Viruses on Unix systems (1989) [pdf]",
        "score": 6,
        "link": "https:\/\/www.usenix.org\/legacy\/publications\/compsystems\/1989\/spr_duff.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17036297"
    },
    {
        "title": "On Library Correctness Under Weak Memory Consistency [pdf]",
        "score": 6,
        "link": "http:\/\/www.soundandcomplete.org\/papers\/Libraries-POPL-2019.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18356196"
    },
    {
        "title": "Graph algorithms via SuiteSparse:GraphBLAS: triangle counting and K-truss (2018) [pdf]",
        "score": 6,
        "link": "http:\/\/faculty.cse.tamu.edu\/davis\/GraphBLAS\/HPEC18\/Davis_HPEC18.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18088111"
    },
    {
        "title": "Empirical Studies of Programming Knowledge (1984) [pdf]",
        "score": 6,
        "link": "https:\/\/www.ics.uci.edu\/~redmiles\/inf233-FQ07\/oldpapers\/SollowayEhrlich.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17950597"
    },
    {
        "title": "Higher-order truths about Chmess (2006) [pdf]",
        "score": 6,
        "link": "https:\/\/ase.tufts.edu\/cogstud\/dennett\/papers\/chmess.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17947238"
    },
    {
        "title": "Robert Pirsig on The Scientific Method (1974) [pdf]",
        "score": 6,
        "link": "https:\/\/kkh.ltrr.arizona.edu\/kkh\/natsgc\/PDFs-2013\/Robert-Pirsig-On-Scientific-Method.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18415687"
    },
    {
        "title": "The Mythical Matched Modules (2009) [pdf]",
        "score": 6,
        "link": "https:\/\/www.cl.cam.ac.uk\/research\/srg\/netos\/papers\/2009-kell2009mythical.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18634017"
    },
    {
        "title": "It Takes $4.2M Net Worth to Be Considered Wealthy in Silicon Valley [pdf]",
        "score": 5,
        "link": "https:\/\/aboutschwab.com\/images\/uploads\/inline\/Charles-Schwab-Modern-Wealth-Index-Bay-Area-Press-Release.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17175091"
    },
    {
        "title": "Interviews with John Carmack [~1997-2008] [pdf]",
        "score": 5,
        "link": "http:\/\/fabiensanglard.net\/fd_proxy\/doom3\/pdfs\/johnc-interviews.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17939673"
    },
    {
        "title": "Forensic Analysis and Anonymisation of Printed Documents [pdf]",
        "score": 5,
        "link": "http:\/\/delivery.acm.org\/10.1145\/3210000\/3206019\/p127-richter.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17405586"
    },
    {
        "title": "An Architecture for  Analysis [pdf]",
        "score": 5,
        "link": "https:\/\/www.cs.ucsb.edu\/~jmcmahan\/research\/top_picks_18.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18086159"
    },
    {
        "title": "The Dangers of Key Reuse: Practical Attacks on IPsec IKE [pdf]",
        "score": 5,
        "link": "https:\/\/www.ei.rub.de\/media\/nds\/veroeffentlichungen\/2018\/08\/13\/sec18-felsch.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17760502"
    },
    {
        "title": "Computer Vision for autonomous navigation(1988) [pdf]",
        "score": 5,
        "link": "https:\/\/www.ri.cmu.edu\/pub_files\/pub3\/hebert_martial_1988_3\/hebert_martial_1988_3.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17538949"
    },
    {
        "title": "SPIRAL: Extreme Performance Portability [pdf]",
        "score": 5,
        "link": "http:\/\/users.ece.cmu.edu\/~franzf\/papers\/08510983_Spiral_IEEE_Final.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18468065"
    },
    {
        "title": "Zener diodes have coupled quantum noise that travels at c [pdf]",
        "score": 5,
        "link": "http:\/\/vixra.org\/pdf\/1603.0389v2.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18181898"
    },
    {
        "title": "Loop Recognition in C++\/Java\/Go\/Scala (2011) [pdf]",
        "score": 5,
        "link": "https:\/\/days2011.scala-lang.org\/sites\/days2011\/files\/ws3-1-Hundt.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17680790"
    },
    {
        "title": "Teasing, Gossip, and Local Names on Rapanui (1979) [pdf]",
        "score": 5,
        "link": "https:\/\/scholarspace.manoa.hawaii.edu\/bitstream\/10125\/19211\/1\/AP-v22n1-41-60.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18298741"
    },
    {
        "title": "Reconciling High-Level Optimizations\/Low-Level Code with Twin Memory Allocation [pdf]",
        "score": 5,
        "link": "http:\/\/sf.snu.ac.kr\/publications\/llvmtwin.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17463850"
    },
    {
        "title": "Documented Global Lightning Fatalities [pdf]",
        "score": 4,
        "link": "https:\/\/my.vaisala.net\/Vaisala%20Documents\/Scientific%20papers\/2016%20ILDC%20ILMC\/Ron%20Holle.%20Number%20of%20Documented%20Global%20Lightning%20Fatalities.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17195459"
    },
    {
        "title": "Resistance to the Use of Anesthesia in the Mid-19th Century (2005) [pdf]",
        "score": 4,
        "link": "https:\/\/www.docdroid.net\/V0s9uDp\/meyer2015.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17805757"
    },
    {
        "title": "The modality of mortality in domain names: an in-depth study of domain lifetimes [pdf]",
        "score": 4,
        "link": "https:\/\/www.farsightsecurity.com\/assets\/media\/download\/VB2018-study.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=18607150"
    },
    {
        "title": "Scientific Uses of the MANIAC (1986) [pdf]",
        "score": 4,
        "link": "https:\/\/dasher.wustl.edu\/chem430\/reading\/jstatphys-43-731-86.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17535138"
    },
    {
        "title": "Frieze Groups (1996) [pdf]",
        "score": 4,
        "link": "http:\/\/www.glassner.com\/wp-content\/uploads\/2014\/04\/CG-CGA-PDF-96-05-Frieze-Groups-May96.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16791452"
    },
    {
        "title": "Fast Programmable Match-Action Processing in Hardware for SDN (2013) [pdf]",
        "score": 4,
        "link": "http:\/\/yuba.stanford.edu\/~grg\/docs\/sdn-chip-sigcomm-2013.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=17497395"
    },
    {
        "title": "Ivan Sutherland: Technology and Courage (1996) [pdf]",
        "score": 3,
        "link": "http:\/\/cseweb.ucsd.edu\/~wgg\/smli_ps-1.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16918796"
    },
    {
        "title": "Simon Browne: the soul-murdered theologian (1996) [pdf]",
        "score": 3,
        "link": "https:\/\/www.gwern.net\/docs\/psychology\/1996-berman.pdf",
        "commentsLink": "https:\/\/news.ycombinator.com\/item?id=16355887"
    }
];
