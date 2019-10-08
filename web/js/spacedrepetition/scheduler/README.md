
- New cards are always answered first.  Based on what you answer they go to learning.

- ease is permanently linked to the card

- Learning phase just has simple jump intervals

     1, 10, is the default (minutes)
     
     you are presented the card at minutes 1.  If you got it right you jump to 10
     if you fail at ten you jump back to one.  If you succeed at ten it jumps
     to review and then it gets scheduled using the ease and interval algorithm.

- how do I schedule lapses... ?

- Then it gets set as a 'graduating interval' and that should be set to 
  some value probably 1-2x the last learning interval

Definitions:

  - review cards..cards that re schedule to be reviewed

- New refers to cards that you have downloaded or entered in, but have never been studied before.

- Learning refers to cards that were seen for the first time recently, and are still being learnt.

- To Review refers to cards that were previously learnt, and now need to be reviewed so you don’t forget them.



- anki questions:
    - what is mark?
    - what is bury?
    - what is suspend?
    - what is a leach

    AGAIN <1m 
    GOOD <10m
    EASY 4d

    - I need some metrics on a card
        nrReviews
        added
        firstReview

    - the full history of each card?

    - while anki has initial intervals.. 
    
    - https://www.reddit.com/r/Anki/comments/4elur1/can_someone_explain_what_graduating_interval/

# Anki Scheduler

Anki’s algorithm is based on the SuperMemo 2 algorithm. For info on SM-2, please

see http://www.supermemo.com/english/ol/sm2.htm

Anki’s algorithm differs from SM-2 in some respects. Notably:

SM-2 defines an initial interval of 1 day then 6 days. With Anki, you have full
control over the length of the initial learning steps. Anki understands that it
can be necessary to see a new card a number of times before you’re able to
memorize it, and those initial "failures" don’t mean you need to be punished by
being shown the failed card many times over the course of a few days.
Performance during the learning stage does not reflect performance in the
retaining stage.

Anki uses 4 choices for answering review cards, not 6. There is only one fail
choice, not 3. The reason for this is that failure comprises a small amount of
total reviews, and thus adjusting a card’s ease can be sufficiently done by
simply varying the positive answers.

Answering cards later than scheduled will be factored into the next interval
calculation, so you receive a boost to cards that you were late in answering but
still remembered.

Like SM-2, Anki’s failure button resets the card interval by default. But the
user can choose to have the card’s interval reduced instead of being reset
completely. Also, you can elect to review failed mature cards on a different
day, instead of the same day.

Remembered easily not only increments the ease factor, but adds an extra bonus
to the current interval calculation. Thus, answering remembered easily is a
little more aggressive than the standard SM-2 algorithm.

Successive failures while cards are in learning do not result in further
decreases to the card’s ease. A common complaint with the standard SM-2
algorithm is that repeated failings of a card cause the card to get stuck in
"low interval hell". In Anki, the initial acquisition process does not influence
a card’s ease.

You can also check out sched.py in Anki’s source code for the scheduling code.
Here is a summary (see the deck options section for the options that are
mentioned in italics).

If you press…

Again

The card is placed into relearning mode, the ease is decreased by 20 percentage
points (that is, 20 is subtracted from the ease value, which is in units of
percentage points), and the current interval is multiplied by the value of new
interval (this interval will be used when the card exits relearning mode).

Hard

The card’s ease is decreased by 15 percentage points and the current interval is
multiplied by 1.2.

Good

The current interval is multiplied by the current ease. The ease is unchanged.

Easy

The current interval is multiplied by the current ease times the easy bonus and
the ease is increased by 15 percentage points.

For Hard, Good, and Easy, the next interval is additionally multiplied by the
interval modifier. If the card is being reviewed late, additional days will be
added to the current interval, as described here.

There are a few limitations on the scheduling values that cards can take. Eases
will never be decreased below 130%; SuperMemo’s research has shown that eases
below 130% tend to result in cards becoming due more often than is useful and
annoying users. Intervals will never be increased beyond the value of maximum
interval. Finally, all new intervals (except Again) will always be at least one
day longer than the previous interval.

Note

After you select an ease button, Anki also applies a small amount of random
“fuzz” to prevent cards that were introduced at the same time and given the same
ratings from sticking together and always coming up for review on the same day.
This fuzz does not appear on the interval buttons, so if you’re noticing a
slight discrepancy between what you select and the intervals your cards actually
get, this is probably the cause.


Deck Options

Deck options are accessed by selecting a deck on the Decks screen, and then
clicking Options at the bottom of the screen.

Anki allows you to share options between different decks, to make updating
options in many decks at once easy. To do this, options are grouped into an
options group. By default, all newly created decks use the same options group,
and decks imported from previous versions of Anki have separate option groups.
If you’d like to alter the settings on one deck but not other decks, click the
gears icon in the top right and add a new options group.

Please only change options that you fully understand, as inappropriate
adjustments may render Anki less effective.

Note

Options are not retroactive. For example, if you change an option that controls
the delay after failing a card, cards that you failed prior to changing the
option will have the old delay, not the new one.

New Cards

Steps controls the number of learning repetitions, and the delay between them.
Please see the learning section for an overview of how the steps work.

Steps over a day (1440 minutes) are supported as well - if you want, you can
define a schedule like 10 minutes, 1 day, 3 days and then finally 7 days before
the card becomes a review card.

Note

If there’s nothing else to study, Anki will show cards up to 20 minutes early by
default. The amount of time to look ahead is configurable in the preferences.
One thing to be aware of is that the due counts will differ between the deck
screen and study screens in this case. The deck screen will not count cards that
are not ready, but the study screen will. This is done so that you can tell
which decks need your attention.

Note

Anki treats small steps and steps that cross a day boundary differently. With
small steps, the cards are shown as soon as the delay has passed, in preference
to other waiting cards like reviews. This is done so that you can answer the
card as closely to your requested delay as possible. In contrast, cards that
cross a day boundary are scheduled on a per-day basis like reviews are. When you
return to study the next day, the per-day learning cards will not be shown
first, as that can make the first half of a review session frustratingly
difficult. Instead, the cards will be shown after reviews are completed. They
are included in the review count rather than the learning count, due to the way
they are handled internally. Order controls whether Anki should add new cards
into the deck randomly, or in order. When you change this option, Anki will
re-sort the decks using the current option group. One caveat with random order
mode: if you review many of your new cards and then add more new cards, the
newly added material is statistically more likely to appear than the previously
remaining cards. To correct this, you can change the order to ordered mode and
back again to force a re-sort.

Note

When you select random order, Anki will randomize your notes, keeping the cards
of a given note close together. The cards of a given note are shown in the order
their card types appear in, so that siblings are introduced consistently -
otherwise you could end up in a state where some notes had all their cards
introduced and other notes had only one or two. Please see the "bury related"
option below for more info. New cards/day tells Anki how many new cards you’d
like introduced on each day you open the program. Missed days will not cause the
cards to pile up. The limit applies to the current deck and subdecks. This means
if "French" has a limit of 20 cards and "French::Lesson 1" and "French::Lesson
2" both have limits of 15 cards, you’ll get 15 cards from lesson 1 but only 5
cards from lesson 2.

Note

Studying new cards will temporarily increase the number of reviews you need to
do a day, as freshly learnt material needs to be repeated a number of times
before the delay between repetitions can increase appreciably. If you are
consistently learning 20 new cards a day, you can expect your daily reviews to
be roughly about 200 cards/day. You can decrease the reviews required by
introducing fewer new cards each day, or by turning off new card display until
your review burden decreases. More than one Anki user has excitedly studied
hundreds of new cards over their first few days of using the program, and then
become overwhelmed by the reviews required. Graduating interval is the delay
between answering Good on a card with no steps left, and seeing the card again.

Easy interval is the delay between answering easy on a learning card and seeing
it in review mode for the first time.

Starting ease controls the easiness that cards start out with. It is set when a
card graduates from learning for the first time. It defaults to 250%, meaning
that once you’ve finished learning a card, answering "Good" on subsequent
reviews will increase the delay by approximately 2.5x (eg if the last delay was
10 days, the next delay would be 25 days). Based upon how you rate the card in
subsequent reviews, the easiness may increase or decrease from what it starts
out as.

Turning off bury related… will prevent Anki from burying siblings, and instead
Anki will just try to avoid showing siblings directly after one another in the
same session. For this to work, your new cards/day setting needs to be large
enough for the cards of multiple notes to be included.

Reviews

Maximum reviews/day allows you to set an upper limit on the number of reviews to
show each day. When this limit is reached, Anki will not show any more review
cards for the day, even if there are some waiting. If you study consistently,
this setting can help to smooth out occasional peaks in due card counts, and can
save you from a heart attack when returning to Anki after a week off. When
reviews have been hidden due to this option, a message will appear in the
congratulations screen, suggesting you consider increasing the limit if you have
time.

Easy bonus allows you to set the difference in intervals between answering Good
and Easy on a card. For instance, with the default value of 130%, Easy will give
an interval that is 1.3 times the Good interval.

Interval modifier allows you to apply a multiplication factor to the intervals
Anki generates. At its default of 100% it does nothing; if you set it to 80% for
example, intervals will be generated at 80% of their normal size (so a 10 day
interval would become 8 days). You can thus use the multiplier to make Anki
present cards more or less frequently than it would otherwise, trading study
time for retention or vice versa.

For moderately difficult material, the average user should find they remember
approximately 90% of mature cards that come up for review. You can find out your
own performance by opening the graphs/statistics for a deck and looking at the
Answer Buttons graph - mature retention is the correct% on the right side of the
graph. If you haven’t been studying long you may not have any mature cards yet.
As performance with new cards and younger cards can vary considerably, it’s a
good idea to wait until you have a reasonable amount of mature reviews before
you start drawing conclusions about your retention rate.

On the SuperMemo website, they suggest that you can find an appropriate
multiplier for a desired retention rate. Their formula boils down to:

log(desired retention%) / log(current retention%)

Imagine we have a current retention rate of 85% and we want to increase it to
90%. We’d calculate the modifier as:

log(90%) / log(85%) = 0.65

You can use Google to calculate it for you.

If you plug the resulting 65% into the interval modifier, you should find over
time that your retention moves closer to your desired retention.

One important thing to note however is that the tradeoff between time spent
studying and retention is not linear: we can see here that to increase our
retention by 5 percentage points, we’d have to study 35% more frequently. If the
material you are learning is very important then it may be worth the extra
effort – that’s something you’ll need to decide for yourself. If you’re simply
worried that you’re forgetting too much, you may find investing more time into
the initial learning stage and/or making mnemonics gives you more gain for less
effort.

One final thing to note is that Anki forces a new interval to be at least 1 day
longer than it was previously so that you don’t get stuck reviewing with the
same interval forever. If your goal is to repeat a card once a day for multiple
days, you can do that by setting more learning mode steps instead of by
adjusting this modifier.

Maximum interval allows you to place an upper limit on the time Anki will wait
to reshow a card. The default is 100 years; you can decrease this to a smaller
number if you’re willing to trade extra study time for higher retention.

Hard interval specifies what the next interval will be when you press the Hard
button. The percentage is relative to the previous interval, eg with a default
120%, a card with a 10 day interval will be given 12 days. This option is only
available when the experimental scheduler is enabled in the preferences.

Turning off bury related… will prevent Anki from burying siblings, and instead
Anki will just try to avoid showing siblings directly after one another in the
same session.

Note

Review cards are always shown in random order. If you wish to see them in a
different order, you can use a filtered deck. More specifically, Anki randomizes
reviews by grabbing batches of 50 cards in the order that they exist in the
database, randomizing each batch, then putting them together. This means that
there is a slight bias towards older cards being shown first, but it prevents
individual cards from showing up in a predictable order.

Lapses

When you forget a review card, it is said to have lapsed. The default behaviour
for lapsed reviews is to reset the interval to 1 (ie, make it due tomorrow), and
put it in the learning queue for a refresher in 10 minutes. This behaviour can
be customized with the options listed below.

If you leave the steps blank, Anki will not place the card back in the learning
queue, and it will be rescheduled as a review with its new interval determined
by the settings below.

Note

The new interval is determined when you answer "Again" to a review card, not
when the card finishes its relearning steps. For this reason, the "Good" and
"Easy" buttons during relearing do not alter the interval again - they only
control which step you are on. If there is only a single step (the default), the
"Easy" button will be hidden, since it would accomplish the same thing as the
"Good" button. If you have 2 or more steps, "Easy" is not hidden, to allow you
to graduate cards from the queue before all of their steps are finished. New
interval controls how much Anki should reduce the previous interval. It reduces
the previous interval to the percentage you specify. If a card had a 200 day
interval, the default of 0% would reduce the interval to 0 (but see the next
option). If you set this option to 50%, the card would have its interval reduced
to 100 days instead.

Minimum interval allows you to apply a minimum limit to the above option. The
default setting says that lapses should be reviewed one day later. The interval
must be 1 day or more.

The leech options control the way Anki handles leeches. Please see the leech
section for more information.


Learning

When learning new cards, or when relearning cards that you have forgotten, Anki
will show you the cards one or more times to help you memorize them. Each time
is called a learning step. By default there are two steps: 1 minute and 10
minutes. You can change the number of steps and the delays between them in the
deck options.

There are three rating buttons when learning:

Again moves the card back to the first step.

Good moves the card to the next step. If the card was on the final step, the
card is converted into a review card (it graduates). By default, once the card
has reached the end of the learning steps, the card will be shown again the next
day, then at increasingly long delays (see the next section).

Easy immediately converts the card into a review card, even if there were steps
remaining. By default, the card will be shown again 4 days later, and then at
increasingly long delays. The easy button will not be shown if you are in
relearning mode and it would give the same interval as “good.”

When cards are seen for the first time, they start at step one. This means
answering Good on a card for the first time will show it one more time in 10
minutes, and the initial 1 minute step will be skipped. If you push Again,
though, the card will come back in 1 minute.

You can use the 1, 2 and 3 keys on your keyboard to select a particular button,
where 1 is Again. Pressing the spacebar will select Good.

If there are no other cards to show you, Anki will show learning cards again
even if their delay has not elapsed completely. If you’d prefer to wait the full
learning delay, you can change this behaviour in the preferences.

Reviewing

When a card has been previously learnt and is ready to be reviewed again, there
are four buttons to rate your answer:

Again marks your answer as incorrect and asks Anki to show the card more
frequently in the future. The card is said to have lapsed. Please see the lapses
section for more information about how lapsed reviews are handled.

Hard shows the card at a slightly longer delay than last time, and tells Anki to
show the card more frequently in the future.

Good tells Anki that the last delay was about right, and the card easiness
doesn’t need to be adjusted down or up. At the default starting easiness, the
card will be shown again approximately 2 1/2 times longer than the previous
time, so if you had waited 10 days to see the card previously, the next delay
would be about 25 days.

Easy tells Anki you found the delay too short. The card will be scheduled
further into the future than Good, and Anki will schedule the card less
frequently in the future. Because Easy rapidly increases the delay, it’s best
used for only the easiest of cards. Usually you should find yourself answering
Good instead.

As with learning cards, you can use 1-4 on the keyboard to select an answer.
Pressing the spacebar will select Good.

Due Counts and Time Estimates

When only the question is shown, Anki shows three numbers like 12 + 34 + 56 at
the bottom of the screen. These represent the new cards, cards in learning, and
cards to review. If you’d prefer not to see the numbers, you can turn them off
in Anki’s preferences.

Note

The numbers count reviews needed to finish all the cards in that queue, not the
number of cards. If you have multiple steps configured for lapsed cards, the
number will increase by more than one when you fail a card, since that card
needs to be shown several times. When the answer is shown, Anki shows an
estimate of the next time a card will be shown above each button. If you’d
prefer not to see the estimates, you can disable them in Anki’s preferences.

Note

Anki additionally adds a small amount of random variation to the next due times,
in order to prevent cards that were introduced together and always rated the
same from always staying next to each other. This variation is not shown on the
time estimates but will be applied after selecting the button. Editing and More

You can click the Edit button in the bottom left to edit the current note. When
you finish editing, you’ll be returned to study. The editing screen works very
similarly to the add notes screen.

At the bottom right of the review screen is a button labeled More. This button
provides some other operations you can do on the current card or note:

Mark Note

Adds a “marked” tag to the current note, so it can be easily found in the
browser. This is useful when you want to take some action on the note at a later
date, such as looking up a word when you get home. Marked cards also show a
small star in the upper-right-hand corner during reviews.

Bury Card / Note

Hides a card or all of the note’s cards from review until the next day. (If you
want to unbury cards before then, you can click the “unbury” button on the deck
overview screen.) This is useful if you cannot answer the card at the moment or
you want to come back to it another time. Burying can also happen automatically
for cards of the same note. If cards were in learning when they are buried, they
are moved back to the new card queue or review queue prior to being buried.

Suspend Card / Note

Hides a card or all of the note’s cards from review until they are manually
unsuspended (by clicking the suspend button in the browser). This is useful if
you want to avoid reviewing the note for some time, but don’t want to delete it.
If cards were in learning when they are suspended, they are moved back to the
new card queue or review queue prior to being suspended.

Delete Note

Deletes the note and all of its cards.

Options

Edit the options for the current deck.

Replay Audio

If the card has audio on the front or back, play it again.

Record Own Voice

Record from your microphone for the purposes of checking your pronunciation.
This recording is temporary and will go away when you move to the next card. If
you want to add audio to a card permanently, you can do that in the edit window.

Replay Own Voice

Replay the previous recording of your voice (presumably after showing the
answer).
