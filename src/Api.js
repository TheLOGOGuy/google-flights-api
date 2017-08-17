'use strict';

const fs = require('fs');
const path = require('path');
const moment = require('moment');
const request = require('request-promise');

class Api {
  /**
   * @param {String} apikey - QPX api key
   * @param {Object} options - Optional parameters
   * @param {String} options.backup - Absolute path for location to save full query response and request in JSON
   * @param options
   */
  constructor(apikey, options = {}) {
    this.options = options;
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
   * @returns {Promise}
   */
  async query(adultCount, maxPrice, solutions, origin, destination, date) {
    const url = `https://www.googleapis.com/qpxExpress/v1/trips/search?key=${this.apikey}`;

    const queryBody = Api._getQueryBody(adultCount, maxPrice, solutions, origin, destination, date);
    const queryRequest = { method: 'POST', url, body: queryBody, json: true };
    const queryResponse = await Api._queryPromise(queryRequest);

    if (this.options.backup) {
      Api._saveQueryData(this.options.backup, queryRequest, queryResponse)
    }
    const queryResponseProcessed = Api._processQueryResponse(queryResponse);

    return queryResponseProcessed;
  }

  /**
   * Save request and response data to json file for backup purposes
   * @param {String} path - Path to save file
   * @param {Object} request - Query request
   * @param {Object} response - Query response
   * @private
   */
  static _saveQueryData(path, request, response) {
    // Save backup req and response as timestamp.json
    const writePath = path.resolve(path, `${moment().format('MM-DD-YYYY_h:mm:ssa')}.json`);
    fs.writeFileSync(writePath, JSON.stringify({ request, response}, null, 2), 'utf8');
  }

  /**
   * Process the query response to get prettified information
   * @param {Object} response - The response body from the query request
   * @returns {Array} flights - The available flights for the query
   * @throws
   * @private
   */
  static _processQueryResponse(response) {
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
  }

  /**
   * Returns a promise which resolves to the response body
   * @param {Object} queryRequest - The request object made to the QPX api
   * @returns {Promise} Promise with query response body
   * @throws
   * @private
   */
  static async _queryPromise(queryRequest) {
    try {
      const response = await request(queryRequest);
      return response;
    } catch(e) {
      throw e;
    }
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
