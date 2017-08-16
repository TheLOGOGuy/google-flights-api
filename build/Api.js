'use strict';

const fs = require('fs');
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
   * @param {String} date - The date of the flight... "2016-12-14"
   * @param {Object} options - Optional parameters
   * @param {String} options.write - Location to save full query response JSON
   * @returns {Promise}
   */
  query(adultCount, maxPrice, solutions, origin, destination, date, options = {}) {
    const endPoint = `https://www.googleapis.com/qpxExpress/v1/trips/search?key=${this.apikey}`;

    const data = {};
    data.request.passengers.adultCount = adultCount;
    data.request.maxPrice = maxPrice;
    data.request.solutions = solutions;
    data.request.slice[0].origin = origin;
    data.request.slice[0].destination = destination;
    data.request.slice[0].date = date;

    return Api._queryPromise(endPoint, query, options);
  }

  static async _queryPromise(endPoint, data, options) {
    const response = await request({ method: 'post', url: endPoint, body: data, json: true });
    const { body } = response;

    const writePath = options.write;
    if (writePath) {
      fs.writeFileSync(writePath, JSON.stringify({ request: data, response }), 'utf8');
    }

    if (body.error) throw body.error;

    const tripOptions = body.trips.tripOption;
    return tripOptions.map(tripOption => {
      const airline = tripOption.slice[0].segment[0].flight.carrier;
      const price = tripOption.saleTotal;
      return { airline, price };
    });
  }
}

module.exports = Api;