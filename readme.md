# Google Flights Api

## Installation

```
npm install google-flights-api
```

## Usage

```javascript
const API_KEY = '1234';
const options =  { write: __dirname + '/data'};
const qpx = require('google-flights-api')(API_KEY, options);

const q = {
   adultCount: 1, 
   maxPrice: 'EUR5000', 
   solutions: 1, 
   origin: 'DUB',
   destination: 'GDN', 
   date: '2016-12-14'
};
qpx.query(q).then((data) => {
  //data looks like: [ { airline: 'SK', price: 'EUR71.10' } ]
}).catch(console.error);
```
## Documentation

<a name="Api"></a>

## Api
**Kind**: global class  

* [Api](#Api)
    * [new Api(apikey, [options])](#new_Api_new)
    * [.query](#Api+query) ⇒ <code>Promise</code>
    * [.rawQuery](#Api+rawQuery) ⇒ <code>Promise</code>

<a name="new_Api_new"></a>

### new Api(apikey, [options])
Instantiates the object for interacting with Google QPX API


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| apikey | <code>String</code> |  | QPX api key |
| [options] | <code>Object</code> | <code>{}</code> | Optional parameters |
| [options.backup] | <code>String</code> |  | Absolute path for location to save full query response and request in JSON |

<a name="Api+query"></a>

### api.query ⇒ <code>Promise</code>
Perform a Google QPX query and get results processed for clarity

**Kind**: instance property of [<code>Api</code>](#Api)  
**Returns**: <code>Promise</code> - - Resolves to response object  
**See**

- https://developers.google.com/qpx-express/v1/trips/search#request
- https://developers.google.com/qpx-express/v1/trips/search#response


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| q | <code>Object</code> |  | Query object |
| q.maxPrice | <code>String</code> |  | The max price for the trip. Note - Must be prefixed with currency i.e. EUR. |
| q.origin | <code>String</code> |  | The origin airport code. |
| q.destination | <code>String</code> |  | The destination airport code. |
| q.date | <code>String</code> \| <code>Number</code> |  | The date of the flight... moment will attempt to parse the date to YYYY-MM-DD                                                e.g. '2016-12-14' or ms timestamp will work |
| [q.solutions] | <code>Number</code> | <code>500</code> | The number of possible routes the API should return. |
| [q.adultCount] | <code>Number</code> | <code>1</code> | The number of adults going on the trip. |
| [q.childCount] | <code>Number</code> | <code>0</code> | The number of children going on the trip. |
| [q.infantInLapCount] | <code>Number</code> | <code>0</code> | The number of passengers that are infants travelling in the lap of an adult. |
| [q.infantInSeatCount] | <code>Number</code> | <code>0</code> | The number of passengers that are infants each assigned a seat. |
| [q.seniorCount] | <code>Number</code> | <code>0</code> | The number of passengers that are senior citizens. |
| [q.maxStops] | <code>Number</code> | <code>∞</code> | The maximum number of stops the passenger(s)                                                are willing to accept in this slice. |
| [q.maxConnectionDuration] | <code>Number</code> | <code>∞</code> | The longest connection between two legs, in minutes. |
| [q.earliestTime] | <code>String</code> | <code>00:00</code> | The earliest time of day in HH:MM format for departure. |
| [q.latestTime] | <code>String</code> | <code>23:59</code> | The latest time of day in HH:MM format for departure. |
| [q.saleCountry] | <code>String</code> |  | IATA country code representing the point of sale.                                                This determines the "equivalent amount paid" currency for the ticket. |
| [q.ticketingCountry] | <code>String</code> |  | IATA country code representing the point of ticketing. |
| [q.refundable] | <code>String</code> |  | Return only solutions with refundable fares. |
| [q.preferredCabin] | <code>String</code> | <code>Any</code> | Allowed values are COACH, PREMIUM_COACH, BUSINESS, and FIRST. |
| [q.permittedCarrier] | <code>Array</code> | <code>Any</code> | A list of 2-letter IATA airline designators to filter your results. |
| [q.prohibitedCarrier] | <code>Array</code> | <code>None</code> | A list of 2-letter IATA airline designators. Exclude results that match. |
| [q.alliance] | <code>String</code> |  | Slices with only the carriers in this alliance should be returned;                                                do not use this field with permittedCarrier.                                                Allowed values are ONEWORLD, SKYTEAM, and STAR. |

<a name="Api+rawQuery"></a>

### api.rawQuery ⇒ <code>Promise</code>
Perform a Google QPX query, no processing will be done on the query or response so it must follow the api format

**Kind**: instance property of [<code>Api</code>](#Api)  
**See**: https://developers.google.com/qpx-express/v1/trips/search#request  

| Param | Type | Description |
| --- | --- | --- |
| q | <code>Object</code> | Query object |


## Contributing

### Updating docs
Docs are generated from JSDocs via `npm run docs`

## Credits
Forked from [adhorrig's](https://github.com/adhorrig), [google-flight-wrapper](https://github.com/adhorrig/google-flights-wrapper)

