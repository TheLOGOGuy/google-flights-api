'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require('fs');
var path = require('path');
var moment = require('moment');
var request = require('request-promise');
// const _ = require('lodash');

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
 * @param [q.preferredCabins] - Prefer solutions that book in this cabin for this slice.
 * Allowed values are COACH, PREMIUM_COACH, BUSINESS, and FIRST.
 * @returns {Promise}
 */
Api.prototype.query = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(q) {
    var url, queryBody, queryRequest, queryResponse, queryResponseProcessed;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            url = 'https://www.googleapis.com/qpxExpress/v1/trips/search?key=' + this.apikey;
            queryBody = Api._getQueryBody(q);
            queryRequest = { method: 'POST', url: url, body: queryBody, json: true };
            _context.next = 5;
            return Api._queryPromise(queryRequest);

          case 5:
            queryResponse = _context.sent;


            if (this.options.backup) {
              Api._saveQueryData(this.options.backup, queryRequest, queryResponse);
            }
            queryResponseProcessed = Api._processQueryResponse(queryResponse);
            return _context.abrupt('return', queryResponseProcessed);

          case 9:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  function query(_x) {
    return _ref.apply(this, arguments);
  }

  return query;
}();

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
  var writePath = path.resolve(savePath, moment().format('MM-DD-YYYY_h:mm:ssa') + '.json');
  fs.writeFileSync(writePath, (0, _stringify2.default)({ request: request, response: res }, null, 2), 'utf8');
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
  var body = response.body;

  if (body.error) {
    throw Error(body.error);
  }

  var tripOptions = body.trips.tripOption;
  var flights = tripOptions.map(function (tripOption) {
    var airline = tripOption.slice[0].segment[0].flight.carrier;
    var price = tripOption.saleTotal;
    return { airline: airline, price: price };
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
Api._queryPromise = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(queryRequest) {
    var response;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return request(queryRequest);

          case 3:
            response = _context2.sent;
            return _context2.abrupt('return', response);

          case 7:
            _context2.prev = 7;
            _context2.t0 = _context2['catch'](0);
            throw _context2.t0;

          case 10:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[0, 7]]);
  }));

  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
}();

/**
 * Constructs the body for the QPX query
 * Refer to Api.query for details about params
 * @see Api.query
 * @param {Object} q
 * @param {Number} q.adultCount
 * @param {String} q.maxPrice
 * @param {Number} q.solutions
 * @param {String} q.origin
 * @param {String} q.destination
 * @param {String} q.date
 * @param {String} q.saleCountry
 * @param {String} q.preferredCabins
 * @static
 * @memberOf Api
 * @private
 */
Api._getQueryBody = function (_ref3) {
  var _ref3$adultCount = _ref3.adultCount,
      adultCount = _ref3$adultCount === undefined ? 1 : _ref3$adultCount,
      maxPrice = _ref3.maxPrice,
      _ref3$solutions = _ref3.solutions,
      solutions = _ref3$solutions === undefined ? 500 : _ref3$solutions,
      origin = _ref3.origin,
      destination = _ref3.destination,
      date = _ref3.date,
      saleCountry = _ref3.saleCountry,
      preferredCabins = _ref3.preferredCabins;

  return {
    request: {
      passengers: { adultCount: adultCount },
      maxPrice: maxPrice,
      solutions: solutions,
      slice: [{ origin: origin, destination: destination, date: date, preferredCabins: preferredCabins }],
      saleCountry: saleCountry
    }
  };
};

module.exports = Api;