import * as React from 'react';
import {Logger} from 'polar-shared/src/logger/Logger';
import {IDocInfo} from 'polar-shared/src/metadata/IDocInfo';
import StatTitle from './StatTitle';
import {ResponsiveCalendar} from '@nivo/calendar';
import {HitMap} from 'polar-shared/src/util/HitMap';
import {Dictionaries} from 'polar-shared/src/util/Dictionaries';
import {ISODateTimeStrings} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {Reducers} from 'polar-shared/src/util/Reducers';
import {Numbers} from "polar-shared/src/util/Numbers";

const log = Logger.create();

export default class ReadingProgressTable extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
        };

    }

    public render() {

        const progressPerDay = new HitMap();

        for (const docInfo of this.props.docInfos || []) {

            for (const entry of Dictionaries.entries(docInfo.readingPerDay || {})) {
                progressPerDay.registerHit(entry.key, entry.value);
            }

        }

        const data = progressPerDay.toArray().map(current => {
            return {
                day: current.key,
                value: Numbers.toFixedFloat(current.value, 2)
            };
        });

        const domain = [0, data.map(current => current.value).reduce(Reducers.MAX, 0)];

        // compute the from and to year...

        const days = data.map(current => current.day).sort();

        const today = ISODateTimeStrings.toISODate(ISODateTimeStrings.create());

        const fromYear = ISODateTimeStrings.toISOYear(days.reduce(Reducers.FIRST, today));
        const toYear = ISODateTimeStrings.toISOYear(days.reduce(Reducers.LAST, today));

        // NOTE: we offset the days by 1 so that we don't fold into the next
        // year depending on timezones.

        const from = `${fromYear}-01-02`;
        const to = `${fromYear}-12-30`;

        return <div id="reading-progress-table">

            <StatTitle>Reading Progress</StatTitle>

            <div style={{height: '150px'}}>
                <div className="p-1 mr-auto ml-auto"
                     style={{height: '100%', width: '800px'}}>

                    <ResponsiveCalendar
                        data={data}
                        from={from}
                        to={to}
                        domain={domain}
                        emptyColor="#eeeeee"
                        colors={[
                            "rgba(0,0,255,0.1)",
                            "rgba(0,0,255,0.2)",
                            "rgba(0,0,255,0.3)",
                            "rgba(0,0,255,0.4)",
                            "rgba(0,0,255,0.5)",
                            "rgba(0,0,255,0.6)",
                            "rgba(0,0,255,0.7)",
                            "rgba(0,0,255,0.8)",
                            "rgba(0,0,255,0.9)",
                            "rgba(0,0,255,1.0)",
                        ]}
                        margin={{
                            "top": 20,
                            "right": 10,
                            "bottom": 10,
                            "left": 20
                        }}
                        yearSpacing={40}
                        monthBorderColor="#ffffff"
                        monthLegendOffset={10}
                        dayBorderWidth={2}
                        dayBorderColor="#ffffff"
                        //     legends={[
                        //         {
                        //             "anchor": "bottom",
                        //             "direction": "row",
                        //             "translateY": 36,
                        //             "itemCount": 4,
                        //             "itemWidth": 34,
                        //             "itemHeight": 36,
                        //             "itemDirection": "top-to-bottom"
                        //         }
                        //     ]}
                    />

                </div>

            </div>

            <div className="p-1 pl-5 pr-5 mr-auto ml-auto"
                 style={{height: '100%', width: '800px'}}>

                <p className="text-muted">
                    The number of pages read per day.  This is computed by using
                    the 'read' pagemarks from the documents you're tracking.  If
                    it seems like there are too many pages read per day try
                    changing the 'mode' of the pagemark to either 'previously
                    read' or 'ignored'.  This can happen when importing documents
                    you're previously read and create a large pagemark.
                </p>

            </div>

        </div>;

    }

    private getData(): any {

        return [
            {
                "day": "2010-03-04",
                "value": 387
            },
            {
                "day": "2010-05-17",
                "value": 46
            },
        ];

    }

    private getData2(): any {

        return [
            {
                "day": "2016-03-04",
                "value": 387
            },
            {
                "day": "2015-12-17",
                "value": 46
            },
            {
                "day": "2015-07-18",
                "value": 247
            },
            {
                "day": "2016-03-29",
                "value": 5
            },
            {
                "day": "2015-08-03",
                "value": 159
            },
            {
                "day": "2016-04-16",
                "value": 17
            },
            {
                "day": "2016-02-22",
                "value": 128
            },
            {
                "day": "2015-10-08",
                "value": 145
            },
            {
                "day": "2016-03-03",
                "value": 215
            },
            {
                "day": "2015-08-02",
                "value": 311
            },
            {
                "day": "2016-03-12",
                "value": 221
            },
            {
                "day": "2016-07-12",
                "value": 255
            },
            {
                "day": "2015-08-31",
                "value": 368
            },
            {
                "day": "2016-07-15",
                "value": 379
            },
            {
                "day": "2015-06-19",
                "value": 255
            },
            {
                "day": "2016-07-06",
                "value": 218
            },
            {
                "day": "2016-01-30",
                "value": 51
            },
            {
                "day": "2015-10-10",
                "value": 340
            },
            {
                "day": "2015-09-09",
                "value": 174
            },
            {
                "day": "2016-01-29",
                "value": 203
            },
            {
                "day": "2016-02-18",
                "value": 209
            },
            {
                "day": "2016-07-19",
                "value": 138
            },
            {
                "day": "2015-12-03",
                "value": 14
            },
            {
                "day": "2016-02-01",
                "value": 313
            },
            {
                "day": "2015-12-06",
                "value": 155
            },
            {
                "day": "2015-10-02",
                "value": 133
            },
            {
                "day": "2016-07-02",
                "value": 128
            },
            {
                "day": "2015-04-14",
                "value": 128
            },
            {
                "day": "2016-05-03",
                "value": 300
            },
            {
                "day": "2015-09-21",
                "value": 289
            },
            {
                "day": "2016-04-18",
                "value": 51
            },
            {
                "day": "2016-02-27",
                "value": 338
            },
            {
                "day": "2016-06-23",
                "value": 397
            },
            {
                "day": "2016-05-07",
                "value": 395
            },
            {
                "day": "2015-09-01",
                "value": 380
            },
            {
                "day": "2015-06-04",
                "value": 268
            },
            {
                "day": "2016-08-08",
                "value": 144
            },
            {
                "day": "2015-11-12",
                "value": 129
            },
            {
                "day": "2016-02-19",
                "value": 344
            },
            {
                "day": "2015-06-23",
                "value": 399
            },
            {
                "day": "2015-11-30",
                "value": 93
            },
            {
                "day": "2016-05-08",
                "value": 262
            },
            {
                "day": "2016-08-05",
                "value": 392
            },
            {
                "day": "2016-04-17",
                "value": 92
            },
            {
                "day": "2016-06-14",
                "value": 330
            },
            {
                "day": "2016-03-25",
                "value": 151
            },
            {
                "day": "2015-09-25",
                "value": 207
            },
            {
                "day": "2016-02-25",
                "value": 87
            },
            {
                "day": "2016-03-30",
                "value": 117
            },
            {
                "day": "2016-03-23",
                "value": 228
            },
            {
                "day": "2016-07-13",
                "value": 93
            },
            {
                "day": "2015-05-17",
                "value": 73
            },
            {
                "day": "2015-09-03",
                "value": 316
            },
            {
                "day": "2015-05-26",
                "value": 141
            },
            {
                "day": "2016-05-11",
                "value": 240
            },
            {
                "day": "2016-01-16",
                "value": 11
            },
            {
                "day": "2016-01-31",
                "value": 23
            },
            {
                "day": "2015-07-11",
                "value": 194
            },
            {
                "day": "2016-03-20",
                "value": 106
            },
            {
                "day": "2015-06-06",
                "value": 272
            },
            {
                "day": "2015-05-24",
                "value": 71
            },
            {
                "day": "2015-12-19",
                "value": 81
            },
            {
                "day": "2015-12-12",
                "value": 343
            },
            {
                "day": "2016-01-21",
                "value": 383
            },
            {
                "day": "2015-09-05",
                "value": 58
            },
            {
                "day": "2016-06-17",
                "value": 209
            },
            {
                "day": "2016-06-11",
                "value": 205
            },
            {
                "day": "2015-11-11",
                "value": 226
            },
            {
                "day": "2016-07-23",
                "value": 308
            },
            {
                "day": "2015-07-02",
                "value": 209
            },
            {
                "day": "2015-04-10",
                "value": 164
            },
            {
                "day": "2016-05-14",
                "value": 122
            },
            {
                "day": "2015-04-12",
                "value": 179
            },
            {
                "day": "2015-07-09",
                "value": 14
            },
            {
                "day": "2016-05-25",
                "value": 40
            },
            {
                "day": "2015-06-24",
                "value": 337
            },
            {
                "day": "2016-05-27",
                "value": 290
            },
            {
                "day": "2015-11-09",
                "value": 245
            },
            {
                "day": "2015-07-19",
                "value": 372
            },
            {
                "day": "2015-08-29",
                "value": 317
            },
            {
                "day": "2015-08-19",
                "value": 263
            },
            {
                "day": "2016-02-23",
                "value": 337
            },
            {
                "day": "2015-09-02",
                "value": 149
            },
            {
                "day": "2015-05-01",
                "value": 298
            },
            {
                "day": "2015-07-05",
                "value": 330
            },
            {
                "day": "2016-06-12",
                "value": 217
            },
            {
                "day": "2016-03-02",
                "value": 40
            },
            {
                "day": "2015-11-25",
                "value": 289
            },
            {
                "day": "2016-04-05",
                "value": 5
            },
            {
                "day": "2015-08-21",
                "value": 263
            },
            {
                "day": "2015-04-16",
                "value": 135
            },
            {
                "day": "2016-04-03",
                "value": 334
            },
            {
                "day": "2015-08-22",
                "value": 390
            },
            {
                "day": "2016-01-26",
                "value": 154
            },
            {
                "day": "2015-11-20",
                "value": 93
            },
            {
                "day": "2016-07-24",
                "value": 170
            },
            {
                "day": "2016-06-03",
                "value": 313
            },
            {
                "day": "2015-10-27",
                "value": 372
            },
            {
                "day": "2016-06-09",
                "value": 265
            },
            {
                "day": "2015-12-09",
                "value": 311
            },
            {
                "day": "2016-05-28",
                "value": 362
            },
            {
                "day": "2016-01-20",
                "value": 113
            },
            {
                "day": "2015-09-13",
                "value": 171
            },
            {
                "day": "2016-04-23",
                "value": 109
            },
            {
                "day": "2016-04-04",
                "value": 251
            },
            {
                "day": "2015-10-03",
                "value": 139
            },
            {
                "day": "2015-10-12",
                "value": 349
            },
            {
                "day": "2016-06-20",
                "value": 328
            },
            {
                "day": "2016-06-21",
                "value": 156
            },
            {
                "day": "2016-03-08",
                "value": 313
            },
            {
                "day": "2016-06-15",
                "value": 186
            },
            {
                "day": "2015-04-24",
                "value": 143
            },
            {
                "day": "2016-03-14",
                "value": 278
            },
            {
                "day": "2016-02-04",
                "value": 98
            },
            {
                "day": "2015-06-01",
                "value": 340
            },
            {
                "day": "2015-09-11",
                "value": 213
            },
            {
                "day": "2015-04-02",
                "value": 155
            },
            {
                "day": "2015-12-13",
                "value": 358
            },
            {
                "day": "2015-08-18",
                "value": 53
            },
            {
                "day": "2016-03-16",
                "value": 79
            },
            {
                "day": "2015-06-12",
                "value": 208
            },
            {
                "day": "2016-03-05",
                "value": 306
            },
            {
                "day": "2015-04-13",
                "value": 0
            },
            {
                "day": "2016-07-07",
                "value": 123
            },
            {
                "day": "2016-03-01",
                "value": 176
            },
            {
                "day": "2016-05-23",
                "value": 148
            },
            {
                "day": "2016-04-29",
                "value": 159
            },
            {
                "day": "2015-08-26",
                "value": 55
            },
            {
                "day": "2015-09-28",
                "value": 255
            },
            {
                "day": "2015-06-08",
                "value": 161
            },
            {
                "day": "2015-11-18",
                "value": 248
            },
            {
                "day": "2016-06-05",
                "value": 76
            },
            {
                "day": "2016-01-07",
                "value": 111
            },
            {
                "day": "2015-10-19",
                "value": 361
            },
            {
                "day": "2016-05-13",
                "value": 27
            },
            {
                "day": "2016-04-01",
                "value": 219
            },
            {
                "day": "2016-07-16",
                "value": 364
            },
            {
                "day": "2015-09-12",
                "value": 128
            },
            {
                "day": "2016-05-12",
                "value": 215
            },
            {
                "day": "2015-06-26",
                "value": 197
            },
            {
                "day": "2016-01-03",
                "value": 289
            },
            {
                "day": "2015-07-15",
                "value": 209
            },
            {
                "day": "2016-03-28",
                "value": 214
            },
            {
                "day": "2016-05-01",
                "value": 338
            },
            {
                "day": "2016-02-12",
                "value": 48
            },
            {
                "day": "2016-02-26",
                "value": 358
            },
            {
                "day": "2015-07-22",
                "value": 186
            },
            {
                "day": "2015-11-21",
                "value": 322
            },
            {
                "day": "2016-07-25",
                "value": 60
            },
            {
                "day": "2015-09-18",
                "value": 344
            },
            {
                "day": "2016-04-28",
                "value": 324
            },
            {
                "day": "2015-11-27",
                "value": 176
            },
            {
                "day": "2015-10-16",
                "value": 42
            },
            {
                "day": "2016-01-22",
                "value": 52
            },
            {
                "day": "2015-12-22",
                "value": 137
            },
            {
                "day": "2015-11-14",
                "value": 201
            },
            {
                "day": "2016-04-02",
                "value": 285
            },
            {
                "day": "2016-07-01",
                "value": 198
            },
            {
                "day": "2015-08-12",
                "value": 277
            },
            {
                "day": "2016-02-17",
                "value": 185
            },
            {
                "day": "2015-07-25",
                "value": 42
            },
            {
                "day": "2016-08-11",
                "value": 185
            },
            {
                "day": "2015-05-25",
                "value": 158
            },
            {
                "day": "2015-10-05",
                "value": 342
            },
            {
                "day": "2016-07-29",
                "value": 67
            },
            {
                "day": "2016-03-06",
                "value": 253
            },
            {
                "day": "2015-12-15",
                "value": 71
            },
            {
                "day": "2016-03-18",
                "value": 43
            },
            {
                "day": "2016-05-16",
                "value": 244
            },
            {
                "day": "2016-04-10",
                "value": 119
            },
            {
                "day": "2016-05-09",
                "value": 188
            },
            {
                "day": "2016-06-18",
                "value": 77
            },
            {
                "day": "2015-06-09",
                "value": 79
            },
            {
                "day": "2016-01-04",
                "value": 255
            },
            {
                "day": "2016-02-02",
                "value": 219
            },
            {
                "day": "2015-08-27",
                "value": 38
            },
            {
                "day": "2015-12-16",
                "value": 355
            },
            {
                "day": "2016-05-26",
                "value": 27
            },
            {
                "day": "2015-08-25",
                "value": 126
            },
            {
                "day": "2015-09-17",
                "value": 272
            },
            {
                "day": "2015-07-27",
                "value": 280
            },
            {
                "day": "2015-09-08",
                "value": 268
            },
            {
                "day": "2015-09-22",
                "value": 150
            },
            {
                "day": "2015-11-15",
                "value": 94
            },
            {
                "day": "2016-01-24",
                "value": 121
            },
            {
                "day": "2015-11-17",
                "value": 224
            },
            {
                "day": "2016-07-31",
                "value": 395
            },
            {
                "day": "2016-07-09",
                "value": 17
            },
            {
                "day": "2016-02-07",
                "value": 49
            },
            {
                "day": "2015-08-09",
                "value": 3
            },
            {
                "day": "2016-06-01",
                "value": 288
            },
            {
                "day": "2015-10-01",
                "value": 267
            },
            {
                "day": "2016-05-15",
                "value": 399
            },
            {
                "day": "2016-02-24",
                "value": 184
            },
            {
                "day": "2015-10-07",
                "value": 172
            },
            {
                "day": "2015-10-28",
                "value": 140
            },
            {
                "day": "2015-05-04",
                "value": 256
            },
            {
                "day": "2015-05-09",
                "value": 305
            },
            {
                "day": "2015-05-14",
                "value": 233
            },
            {
                "day": "2016-04-30",
                "value": 258
            },
            {
                "day": "2015-09-26",
                "value": 57
            },
            {
                "day": "2015-12-28",
                "value": 14
            },
            {
                "day": "2016-08-03",
                "value": 182
            },
            {
                "day": "2015-05-11",
                "value": 241
            },
            {
                "day": "2015-11-24",
                "value": 36
            },
            {
                "day": "2015-11-05",
                "value": 48
            },
            {
                "day": "2016-01-15",
                "value": 166
            },
            {
                "day": "2016-02-14",
                "value": 75
            },
            {
                "day": "2015-05-12",
                "value": 172
            },
            {
                "day": "2015-10-23",
                "value": 243
            },
            {
                "day": "2016-08-07",
                "value": 65
            },
            {
                "day": "2016-06-29",
                "value": 391
            },
            {
                "day": "2016-04-07",
                "value": 41
            },
            {
                "day": "2016-08-10",
                "value": 239
            },
            {
                "day": "2015-05-30",
                "value": 334
            },
            {
                "day": "2015-12-14",
                "value": 138
            },
            {
                "day": "2016-01-19",
                "value": 386
            },
            {
                "day": "2015-07-08",
                "value": 316
            },
            {
                "day": "2015-10-17",
                "value": 174
            },
            {
                "day": "2015-10-06",
                "value": 33
            },
            {
                "day": "2015-04-18",
                "value": 168
            },
            {
                "day": "2015-04-30",
                "value": 345
            },
            {
                "day": "2015-08-20",
                "value": 42
            },
            {
                "day": "2015-06-20",
                "value": 342
            },
            {
                "day": "2016-03-21",
                "value": 152
            },
            {
                "day": "2015-08-15",
                "value": 294
            },
            {
                "day": "2016-01-25",
                "value": 125
            },
            {
                "day": "2016-06-24",
                "value": 237
            },
            {
                "day": "2016-08-09",
                "value": 272
            },
            {
                "day": "2015-08-11",
                "value": 15
            },
            {
                "day": "2015-08-05",
                "value": 41
            },
            {
                "day": "2015-08-13",
                "value": 305
            },
            {
                "day": "2015-08-30",
                "value": 254
            },
            {
                "day": "2015-12-30",
                "value": 200
            },
            {
                "day": "2015-06-07",
                "value": 223
            },
            {
                "day": "2015-12-20",
                "value": 242
            },
            {
                "day": "2016-05-31",
                "value": 364
            },
            {
                "day": "2015-06-14",
                "value": 237
            },
            {
                "day": "2015-11-19",
                "value": 187
            },
            {
                "day": "2015-10-26",
                "value": 296
            },
            {
                "day": "2015-11-10",
                "value": 148
            },
            {
                "day": "2015-07-12",
                "value": 295
            },
            {
                "day": "2016-02-09",
                "value": 269
            },
            {
                "day": "2016-08-02",
                "value": 49
            },
            {
                "day": "2015-12-31",
                "value": 58
            },
            {
                "day": "2016-01-01",
                "value": 241
            },
            {
                "day": "2015-11-02",
                "value": 393
            },
            {
                "day": "2016-07-04",
                "value": 101
            },
            {
                "day": "2015-04-07",
                "value": 256
            },
            {
                "day": "2016-07-26",
                "value": 300
            },
            {
                "day": "2016-03-13",
                "value": 17
            },
            {
                "day": "2016-05-29",
                "value": 289
            },
            {
                "day": "2016-04-14",
                "value": 32
            },
            {
                "day": "2015-04-11",
                "value": 320
            },
            {
                "day": "2015-05-19",
                "value": 68
            },
            {
                "day": "2016-01-09",
                "value": 180
            },
            {
                "day": "2016-07-28",
                "value": 300
            },
            {
                "day": "2015-10-09",
                "value": 266
            },
            {
                "day": "2015-09-04",
                "value": 394
            },
            {
                "day": "2015-06-28",
                "value": 20
            },
            {
                "day": "2016-04-24",
                "value": 157
            },
            {
                "day": "2015-07-20",
                "value": 330
            },
            {
                "day": "2015-11-26",
                "value": 175
            },
            {
                "day": "2016-06-08",
                "value": 225
            },
            {
                "day": "2016-01-11",
                "value": 165
            },
            {
                "day": "2016-04-13",
                "value": 44
            },
            {
                "day": "2015-08-07",
                "value": 80
            },
            {
                "day": "2015-07-04",
                "value": 307
            },
            {
                "day": "2016-06-04",
                "value": 111
            },
            {
                "day": "2016-06-30",
                "value": 101
            },
            {
                "day": "2016-07-11",
                "value": 210
            },
            {
                "day": "2016-06-10",
                "value": 183
            },
            {
                "day": "2016-03-11",
                "value": 231
            },
            {
                "day": "2016-03-22",
                "value": 395
            },
            {
                "day": "2015-11-13",
                "value": 283
            },
            {
                "day": "2015-10-15",
                "value": 375
            },
            {
                "day": "2016-03-15",
                "value": 51
            },
            {
                "day": "2016-02-15",
                "value": 388
            },
            {
                "day": "2016-04-21",
                "value": 209
            },
            {
                "day": "2015-06-27",
                "value": 96
            },
            {
                "day": "2016-02-06",
                "value": 62
            },
            {
                "day": "2016-04-22",
                "value": 281
            },
            {
                "day": "2015-09-30",
                "value": 123
            },
            {
                "day": "2015-12-21",
                "value": 103
            },
            {
                "day": "2015-06-17",
                "value": 190
            },
            {
                "day": "2015-05-15",
                "value": 384
            },
            {
                "day": "2015-04-17",
                "value": 41
            },
            {
                "day": "2016-04-26",
                "value": 246
            },
            {
                "day": "2015-09-07",
                "value": 205
            },
            {
                "day": "2015-10-29",
                "value": 369
            },
            {
                "day": "2016-07-17",
                "value": 239
            },
            {
                "day": "2016-03-09",
                "value": 164
            },
            {
                "day": "2015-07-10",
                "value": 174
            },
            {
                "day": "2016-02-08",
                "value": 57
            },
            {
                "day": "2015-06-11",
                "value": 154
            },
            {
                "day": "2016-01-12",
                "value": 95
            },
            {
                "day": "2015-09-29",
                "value": 274
            },
            {
                "day": "2016-02-29",
                "value": 381
            },
            {
                "day": "2015-12-29",
                "value": 361
            },
            {
                "day": "2016-06-26",
                "value": 108
            },
            {
                "day": "2015-09-19",
                "value": 4
            },
            {
                "day": "2015-10-22",
                "value": 68
            },
            {
                "day": "2015-06-22",
                "value": 56
            },
            {
                "day": "2015-12-05",
                "value": 59
            },
            {
                "day": "2015-05-05",
                "value": 265
            },
            {
                "day": "2015-11-04",
                "value": 202
            },
            {
                "day": "2015-04-09",
                "value": 135
            },
            {
                "day": "2015-12-08",
                "value": 275
            },
            {
                "day": "2016-05-17",
                "value": 70
            },
            {
                "day": "2016-07-21",
                "value": 27
            },
            {
                "day": "2016-08-01",
                "value": 66
            },
            {
                "day": "2016-01-18",
                "value": 75
            },
            {
                "day": "2015-05-22",
                "value": 342
            },
            {
                "day": "2016-06-28",
                "value": 211
            },
            {
                "day": "2016-06-02",
                "value": 203
            },
            {
                "day": "2015-09-16",
                "value": 328
            },
            {
                "day": "2015-07-16",
                "value": 234
            },
            {
                "day": "2015-05-16",
                "value": 120
            },
            {
                "day": "2016-07-14",
                "value": 91
            },
            {
                "day": "2015-09-06",
                "value": 80
            },
            {
                "day": "2015-04-20",
                "value": 371
            },
            {
                "day": "2016-07-08",
                "value": 286
            },
            {
                "day": "2015-06-03",
                "value": 289
            },
            {
                "day": "2016-05-18",
                "value": 38
            },
            {
                "day": "2015-11-23",
                "value": 364
            },
            {
                "day": "2015-08-10",
                "value": 253
            },
            {
                "day": "2015-07-31",
                "value": 226
            },
            {
                "day": "2015-06-30",
                "value": 141
            },
            {
                "day": "2016-06-25",
                "value": 41
            },
            {
                "day": "2016-03-26",
                "value": 11
            },
            {
                "day": "2015-12-23",
                "value": 382
            },
            {
                "day": "2015-11-28",
                "value": 56
            },
            {
                "day": "2016-05-02",
                "value": 185
            },
            {
                "day": "2016-03-27",
                "value": 193
            },
            {
                "day": "2015-12-11",
                "value": 266
            },
            {
                "day": "2015-11-22",
                "value": 58
            },
            {
                "day": "2015-06-18",
                "value": 100
            },
            {
                "day": "2016-04-11",
                "value": 41
            },
            {
                "day": "2016-06-27",
                "value": 118
            },
            {
                "day": "2016-02-03",
                "value": 257
            },
            {
                "day": "2015-10-21",
                "value": 296
            },
            {
                "day": "2015-11-07",
                "value": 144
            },
            {
                "day": "2015-11-08",
                "value": 349
            },
            {
                "day": "2015-07-29",
                "value": 336
            },
            {
                "day": "2015-08-16",
                "value": 205
            },
            {
                "day": "2015-07-07",
                "value": 357
            },
            {
                "day": "2015-12-26",
                "value": 164
            },
            {
                "day": "2015-08-06",
                "value": 300
            },
            {
                "day": "2015-08-01",
                "value": 231
            },
            {
                "day": "2016-05-19",
                "value": 288
            },
            {
                "day": "2015-04-23",
                "value": 87
            },
            {
                "day": "2016-06-06",
                "value": 249
            },
            {
                "day": "2015-04-21",
                "value": 367
            },
            {
                "day": "2015-09-20",
                "value": 272
            },
            {
                "day": "2015-05-02",
                "value": 189
            },
            {
                "day": "2015-08-24",
                "value": 206
            },
            {
                "day": "2015-08-08",
                "value": 180
            },
            {
                "day": "2015-05-21",
                "value": 288
            },
            {
                "day": "2015-07-30",
                "value": 167
            },
            {
                "day": "2015-04-27",
                "value": 297
            },
            {
                "day": "2016-07-10",
                "value": 79
            },
            {
                "day": "2015-05-13",
                "value": 52
            },
            {
                "day": "2016-07-03",
                "value": 237
            },
            {
                "day": "2015-10-04",
                "value": 369
            },
            {
                "day": "2015-09-23",
                "value": 340
            },
            {
                "day": "2015-12-07",
                "value": 40
            },
            {
                "day": "2016-07-30",
                "value": 256
            },
            {
                "day": "2016-03-10",
                "value": 2
            },
            {
                "day": "2016-02-28",
                "value": 356
            },
            {
                "day": "2015-07-03",
                "value": 355
            },
            {
                "day": "2016-07-27",
                "value": 185
            },
            {
                "day": "2016-07-18",
                "value": 85
            },
            {
                "day": "2015-04-05",
                "value": 173
            },
            {
                "day": "2015-12-10",
                "value": 338
            },
            {
                "day": "2015-04-08",
                "value": 157
            },
            {
                "day": "2016-01-06",
                "value": 125
            },
            {
                "day": "2015-04-25",
                "value": 66
            },
            {
                "day": "2015-06-10",
                "value": 108
            },
            {
                "day": "2016-02-05",
                "value": 372
            },
            {
                "day": "2016-02-21",
                "value": 211
            },
            {
                "day": "2016-05-04",
                "value": 242
            },
            {
                "day": "2015-04-04",
                "value": 316
            },
            {
                "day": "2015-07-13",
                "value": 382
            },
            {
                "day": "2016-01-05",
                "value": 387
            },
            {
                "day": "2015-07-21",
                "value": 115
            },
            {
                "day": "2016-02-16",
                "value": 167
            },
            {
                "day": "2015-05-07",
                "value": 139
            },
            {
                "day": "2016-07-22",
                "value": 317
            },
            {
                "day": "2015-07-14",
                "value": 119
            },
            {
                "day": "2016-05-22",
                "value": 184
            },
            {
                "day": "2016-05-20",
                "value": 235
            }
        ];

    }

}

export interface IProps {
   readonly docInfos?: ReadonlyArray<IDocInfo>;
}

export interface IState {

}
