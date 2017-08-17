'use strict';

const fs = require('fs');
const path = require('path');
const request = require('request-promise');

class Api {
  constructor(apikey) {
    if (!apikey || typeof apikey !== 'string' || apikey.length === 0) {
      throw Error('Api class expects a valid apikey');
    }
    this.apikey = apikey;
  }

  /**
   * @param {Number} adultCount - The number of adults going on the trip.
   * @param {String} maxPrice - The max price for the trip. Note - Must be prefixed with currency i.e. EUR.
   * @param {Number} solutions - The number of possible routes the API should return.
   * @param {String} origin - The origin airport code.
   * @param {String} destination - The destination airport code.
   * @param {String} date - The date of the flight... '2016-12-14'
   * @param {Object} options - Optional parameters
   * @param {String} options.write - Location to save full query response JSON
   * @returns {Promise}
   */
  async query(adultCount, maxPrice, solutions, origin, destination, date, options = {}) {
    const url = `https://www.googleapis.com/qpxExpress/v1/trips/search?key=${this.apikey}`;

    const queryBody = Api._getQueryBody(adultCount, maxPrice, solutions, origin, destination, date);
    const queryRequest = { method: 'POST', url, body: queryBody, json: true };
    const queryResponseBody = await Api._queryPromise(queryRequest);
    const queryResponseProcessed = Api._processQueryResponse(queryResponseBody);

    if (options.write) {
      // Save backup req and response as timestamp.json
      const writePath = path.resolve(options.write, `${Date.now()}.json`);
      fs.writeFileSync(writePath, JSON.stringify({ request: queryRequest, response: queryResponseProcessed }), 'utf8');
    }

    return queryResponseProcessed;
  }


  /**
   * Process the query response body to get prettified information
   * @param {Object} body - The response body from the query request
   * @returns {Array} flights - The available flights for the query
   * @private
   */
  static _processQueryResponse(body) {
    const tripOptions = body.trips.tripOption;
    const flights = tripOptions.map((tripOption) => {
      const airline = tripOption.slice[0].segment[0].flight.carrier;
      const price = tripOption.saleTotal;
      return { airline, price };
    }) || [];

    return flights;
  }

  /**
   * Returns a promise which resolves to the response body
   * @param {Object} queryRequest - The request object made to the QPX api
   * @returns {Promise} Promise with query response body
   * @private
   */
  static async _queryPromise(queryRequest) {
    const response = await request(queryRequest);
    const { body } = response;

    if (body.error) throw(body.error);

    return body;
  }

  /**
   * Constructs the body for the QPX query
   * Refer to Api.query for details about params
   * @see Api.query
   * @param {Number} adultCount
   * @param {String} maxPrice
   * @param {Number} solutions
   * @param {String} origin
   * @param {String} destination
   * @param {String} date
   * @private
   */
  static _getQueryBody(adultCount, maxPrice, solutions, origin, destination, date) {

    return {
      request: {
        passengers: { adultCount },
        maxPrice,
        solutions,
        slice: [ { origin, destination, date } ]
      }
    };
  }
}

module.exports = Api;
