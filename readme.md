<a name="Api"></a>

## Api
**Kind**: global class  

* [Api](#Api)
    * [new Api(apikey, options)](#new_Api_new)
    * [.query](#Api+query) ⇒ <code>Promise</code>

<a name="new_Api_new"></a>

### new Api(apikey, options)
Instantiates the object for interacting with Google QPX API


| Param | Type | Description |
| --- | --- | --- |
| apikey | <code>String</code> | QPX api key |
| options | <code>Object</code> | Optional parameters |
| [options.backup] | <code>String</code> | Absolute path for location to save full query response and request in JSON |

<a name="Api+query"></a>

### api.query ⇒ <code>Promise</code>
Perform a Google QPX query and get results processed for clarity

**Kind**: instance property of [<code>Api</code>](#Api)  
**See**: https://developers.google.com/qpx-express/v1/trips/search  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| q | <code>Object</code> |  | Query object |
| q.maxPrice | <code>String</code> |  | The max price for the trip. Note - Must be prefixed with currency i.e. EUR. |
| q.origin | <code>String</code> |  | The origin airport code. |
| q.destination | <code>String</code> |  | The destination airport code. |
| q.date | <code>String</code> |  | The date of the flight... '2016-12-14' |
| [q.solutions] | <code>Number</code> | <code>500</code> | The number of possible routes the API should return. |
| [q.adultCount] | <code>Number</code> | <code>1</code> | The number of adults going on the trip. |
| [q.saleCountry] | <code>String</code> |  | IATA country code representing the point of sale. This determines the "equivalent amount paid" currency for the ticket. |
| [q.preferredCabins] |  |  | Prefer solutions that book in this cabin for this slice. Allowed values are COACH, PREMIUM_COACH, BUSINESS, and FIRST. |

