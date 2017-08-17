# Google Flights Api
Forked from https://github.com/adhorrig/google-flights-wrapper

## Installation

```
npm install google-flights-api
```

## Usage

```javascript
const API_KEY = '1234';
const options =  { write: __dirname + '/data'};
const qpx = require('google-flights-api')(API_KEY, options);

qpx.query("1", "EUR5000", "1", "DUB", "GDN", "2016-12-14").then((data) => {
  //data looks like: [ { airline: 'SK', price: 'EUR71.10' } ]
}).catch(console.error);
```

## Api Class Parameters
```
apikey: Your api key for qpx
options.write: Path to save a backup of the query request and response
```
## Api Query Parameters:

```
adultCount: The number of adults going on the trip.
maxPrice: The max price for the trip. Note: Must be prefixed with currency i.e. EUR.
solutions: The number of possible routes the API should return.
origin: The origin airport code.
destination: The destination airport code.
date: The date of the flight.
```
