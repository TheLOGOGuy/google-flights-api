'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require('fs');
var request = require('request-promise');

var Api = function () {
  function Api(apikey) {
    (0, _classCallCheck3.default)(this, Api);

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


  (0, _createClass3.default)(Api, [{
    key: 'query',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(adultCount, maxPrice, solutions, origin, destination, date) {
        var options = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : {};
        var endPoint, data, queryRequest, queryResponse, writePath;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                endPoint = 'https://www.googleapis.com/qpxExpress/v1/trips/search?key=' + this.apikey;
                data = {};

                data.request.passengers.adultCount = adultCount;
                data.request.maxPrice = maxPrice;
                data.request.solutions = solutions;
                data.request.slice[0].origin = origin;
                data.request.slice[0].destination = destination;
                data.request.slice[0].date = date;

                queryRequest = { method: 'post', url: endPoint, body: data, json: true };
                _context.next = 11;
                return Api._queryPromise(queryRequest);

              case 11:
                queryResponse = _context.sent;
                writePath = options.write;

                if (writePath) {
                  fs.writeFileSync(writePath, (0, _stringify2.default)({ request: queryRequest, response: queryResponse }), 'utf8');
                }

                return _context.abrupt('return', queryResponse);

              case 15:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function query(_x, _x2, _x3, _x4, _x5, _x6) {
        return _ref.apply(this, arguments);
      }

      return query;
    }()
  }], [{
    key: '_queryPromise',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(queryRequest) {
        var response, body, tripOptions;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return request(queryRequest);

              case 2:
                response = _context2.sent;
                body = response.body;

                if (!body.error) {
                  _context2.next = 6;
                  break;
                }

                throw body.error;

              case 6:
                tripOptions = body.trips.tripOption;
                return _context2.abrupt('return', tripOptions.map(function (tripOption) {
                  var airline = tripOption.slice[0].segment[0].flight.carrier;
                  var price = tripOption.saleTotal;
                  return { airline: airline, price: price };
                }));

              case 8:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function _queryPromise(_x8) {
        return _ref2.apply(this, arguments);
      }

      return _queryPromise;
    }()
  }]);
  return Api;
}();

module.exports = Api;