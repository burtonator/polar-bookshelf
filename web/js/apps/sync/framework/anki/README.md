
# deckNameAndIDs

```bash
curl -X POST "http://127.0.0.1:8765" -H 'Content-Type: application/json' -d'
{
    "action": "deckNamesAndIds",
    "version": 6
}

'
```

```json
{
  "result": {
    "9 GeB - History::Invitation to History 2  -  Post-WWI, Weimar, Nazis, WWII": 1524633157461,
    "root::Career::Computer Science::Bitcoin::Mastering Bitcoin": 1526324995243,
    "root::Career::Book: The Startup of You (Reid Hoffman)": 1525372712326,
    "root::Career::Mathematics::Probability and Statistics": 1526236662859,
    "root::Career::Computer Science::Cryptocurrencies::Encryption": 1526324995589,
    "root::Career::Marketing and Sales": 1524500949940,
    "root::Career::Psychology": 1524873358997,
    "9 GeB - History::Extra: The Weimar Republic": 1524633157459,
    "root::Career::Computer Science::Cryptocurrencies": 1526324995582,
    "root::Career::Computer Science::GoLang": 1526324995613,
    "Text Export 4": 1525710947142,
    "Duolingo English to German (birdie222)": 1524632932785,
    "root::Career": 1524792096504,
    "root::German::Deutsch_practice": 1522611897039,
    "root::Career::Computer Science::Ethereum::Etherium Whitepaper": 1526324995382,
    "root::Career::Computer Science::Ethereum::Consensys Best Practices": 1526613749665,
    "Art of War": 1524633087883,
    "root::German::Deutsch_practice::W08": 1522611897044,
    "root::Career::Philosophy::Poor Richards Almanack": 1524428828706,
    "Duolingo German to English (birdie222)": 1524633052607,
    "root::Career::Mathematics": 1523545121876,
    "root::Career::Computer Science::IPFS Whitepaper": 1526586231425,
    "root::Career::Productivity::Spaced Repetition": 1523545209226,
    "root::German::Deutsch_practice::W03": 1522611897041,
    "root::German::Deutsch_practice::W01": 1522611897047,
    "root::German::Deutsch_practice::W06": 1522611897046,
    "root::German::Deutsch_practice::W07": 1522611897043,
    "root::German::Deutsch_practice::W04": 1522611897042,
    "root::German::Deutsch_practice::W05": 1522611897045,
    "Randomized Study Deck::German 10k Sentences Easy to Hard 3 Fields [1/2]": 1524985091321,
    "root::Career::Psychology::Bicameral Mind": 1524873486292,
    "root::German::German core words": 1524663392351,
    "root::Career::Computer Science::Filecoin": 1526324995543,
    "root::Career::Mathematics::Notation": 1523545129836,
    "root::German::Deutsch_practice::W02": 1522611897040,
    "root::Career::Startups": 1525367808645,
    "Wikipedia: Statistics": 1525712218211,
    "root::Career::Productivity": 1523545179675,
    "Test Deck": 1533950433080,
    "root::Career::Computer Science::ICO": 1526324995605,
    "Randomized Study Deck": 1523575548350,
    "root::Career::Computer Science::Ethereum": 1526324995375,
    "root::Career::Computer Science::Effective Go": 1526324995490,
    "root::German::Duolingo (German)": 1526350664532,
    "root::Career::Economics": 1523991390746,
    "root::German": 1524792050266,
    "root::German::German Top 4027 Words with Example Sentence Audio from Natives": 1525644109653,
    "German": 1524839781334,
    "9 GeB - History": 1524633157458,
    "root::Career::Philosophy": 1524428807468,
    "root::Career::Life Hacks": 1524843805989,
    "Custom Study Session": 1522792418785,
    "Wikipedia: Mathematical Notation": 1526151738233,
    "root::Career::Business": 1525026640015,
    "Wikipedia: Game Theory": 1525731487189,
    "root::Career::Computer Science::Bitcoin": 1526324995220,
    "root::Career::Computer Science": 1523544740317,
    "root": 1,
    "root::Career::People": 1525275730305
  },
  "error": null
}

```

# createDeck

# addNote

# findNotes

- we add a custom field for the polar ID so that we can update the metadata.. 


# TODO: 

    - how do we delete flashcards that have been deleted in Polar?
    - how do we delete polar decks from anki?
    - how do we rename decks? 

- FIXME: just need addNote and updateNote now.



curl -X POST "http://127.0.0.1:8765" -H 'Content-Type: application/json' -d'
{"action":"findNotes","version":6,"params":{"query":"tag:polar_guid:12fakzucrT"}}'

# DEBUG 


curl -X POST "http://127.0.0.1:8765" -H 'Content-Type: application/json' -d'
{
  "action": "canAddNotes",
  "version": 6,
  "params": {
    "notes": [
      {
        "guid": "1GzMun2Wkk",
        "deckName": "Steli Efti explains how to price a product, sell it to customers, and build a sales team.",
        "modelName": "Basic",
        "fields": {
          "Front": "<p>Is this a test ?&nbsp;&nbsp;&nbsp;&nbsp;</p>.",
          "Back": "<p>Yes. I believe it is a test again.</p><p><br></p><p><img src=\"13NVnYEZjCY6dkTsxakr.png\" style=\"width: 303.094px;\"><br></p>"
        },
        "tags": [
          "sales",
          "startups",
          "polar_guid:1GzMun2Wkk"
        ]
      }
    ]
  }
}
'


FUCK ME... the can add notes thing is bullshit... 
