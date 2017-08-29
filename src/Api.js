const fs = require('fs');
const path = require('path');
const moment = require('moment');
const request = require('request-promise');
const _ = require('lodash');

/**
 * Instantiates the object for interacting with Google QPX API
 * @class Api
 * @param {String} apikey - QPX api key
 * @param {Object} options - Optional parameters
 * @param {String} [options.backup] - Absolute path for location to save full query response and request in JSON
 */
function Api(apikey, options) {
  this.options = options;
  if (!apikey || typeof apikey !== 'string' || apikey.length === 0) {
    throw Error('Api class expects a valid apikey');
  }
  this.apikey = apikey;
}

// instance methods
/**
 * Perform a Google QPX query and get results processed for clarity
 * @see https://developers.google.com/qpx-express/v1/trips/search
 * @memberOf Api
 * @param {Object} q - Query object
 * @param {String} q.maxPrice - The max price for the trip. Note - Must be prefixed with currency i.e. EUR.
 * @param {String} q.origin - The origin airport code.
 * @param {String} q.destination - The destination airport code.
 * @param {String} q.date - The date of the flight... '2016-12-14'
 * @param {Number} [q.solutions=500] - The number of possible routes the API should return.
 * @param {Number} [q.adultCount=1] - The number of adults going on the trip.
 * @param {String} [q.saleCountry] - IATA country code representing the point of sale.
 * This determines the "equivalent amount paid" currency for the ticket.
 * @param {String} [q.preferredCabins] - Prefer solutions that book in this cabin for this slice.
 * Allowed values are COACH, PREMIUM_COACH, BUSINESS, and FIRST.
 * @returns {Promise}
 */
Api.prototype.query = async function query(q) {
  const defaultQ = {
    adultCount: 1,
    solutions: 500,
  };
  const url = `https://www.googleapis.com/qpxExpress/v1/trips/search?key=${this.apikey}`;

  const queryBody = Api._getQueryBody(_.defaultsDeep(q, defaultQ));
  const queryRequest = { method: 'POST', url, body: queryBody, json: true };
  const queryResponse = await Api._queryPromise(queryRequest);

  if (this.options.backup) {
    Api._saveQueryData(this.options.backup, queryRequest, queryResponse);
  }
  const queryResponseProcessed = Api._processQueryResponse(queryResponse);

  return queryResponseProcessed;
};


// static methods
/**
 * Save request and response data to json file for backup purposes
 * @param {String} savePath - Path to save file
 * @param {Object} req - Query request
 * @param {Object} res - Query response
 * @static
 * @memberOf Api
 * @private
 */
Api._saveQueryData = function (savePath, req, res) {
  // Save backup req and response as timestamp.json
  const writePath = path.resolve(savePath, `${moment().format('MM-DD-YYYY_h:mm:ssa')}.json`);
  fs.writeFileSync(writePath, JSON.stringify({ request, response: res }, null, 2), 'utf8');
};

/**
 * Process the query response to get prettified information
 * @param {Object} response - The response body from the query request
 * @returns {Array} flights - The available flights for the query
 * @throws Will throw an error if the response body contains the error key
 * @static
 * @memberOf Api
 * @private
 */
Api._processQueryResponse = function (response) {
  const { body } = response;
  if (body.error) {
    throw Error(body.error);
  }

  const tripOptions = body.trips.tripOption;
  const flights = tripOptions.map((tripOption) => {
    const airline = tripOption.slice[0].segment[0].flight.carrier;
    const price = tripOption.saleTotal;
    return { airline, price };
  }) || [];

  return flights;
};

/**
 * Returns a promise which resolves to the response body
 * @param {Object} queryRequest - The request object made to the QPX api
 * @returns {Promise} Promise with query response body
 * @throws Will throw an error if request-promise fails
 * @static
 * @memberOf Api
 * @private
 */
Api._queryPromise = async function (queryRequest) {
  try {
    const response = await request(queryRequest);
    return response;
  } catch (e) {
    throw e;
  }
};

/**
 * Constructs the body for the QPX query
 * Refer to Api.query for details about params
 * @see Api.query
 * @param {Object} q
 * @param {String} q.maxPrice
 * @param {Number} q.solutions
 * @param {String} q.origin
 * @param {String} q.destination
 * @param {String} q.date
 * @param {Number} [q.adultCount]
 * @param {String} [q.saleCountry]
 * @param {String} [q.preferredCabins]
 * @static
 * @memberOf Api
 * @private
 */
Api._getQueryBody = function ({
                                adultCount,
                                maxPrice,
                                solutions,
                                origin,
                                destination,
                                date,
                                saleCountry,
                                preferredCabins,
                              }) {
  return {
    request: {
      passengers: { adultCount },
      maxPrice,
      solutions,
      slice: [{ origin, destination, date, preferredCabins }],
      saleCountry,
    },
  };
};

module.exports = Api;
