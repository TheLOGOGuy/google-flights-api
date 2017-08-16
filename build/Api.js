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
    value: function (_query) {
      function query(_x, _x2, _x3, _x4, _x5, _x6) {
        return _query.apply(this, arguments);
      }

      query.toString = function () {
        return _query.toString();
      };

      return query;
    }(function (adultCount, maxPrice, solutions, origin, destination, date) {
      var options = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : {};

      var endPoint = 'https://www.googleapis.com/qpxExpress/v1/trips/search?key=' + this.apikey;

      var data = {};
      data.request.passengers.adultCount = adultCount;
      data.request.maxPrice = maxPrice;
      data.request.solutions = solutions;
      data.request.slice[0].origin = origin;
      data.request.slice[0].destination = destination;
      data.request.slice[0].date = date;

      return Api._queryPromise(endPoint, query, options);
    })
  }], [{
    key: '_queryPromise',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(endPoint, data, options) {
        var response, body, writePath, tripOptions;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return request({ method: 'post', url: endPoint, body: data, json: true });

              case 2:
                response = _context.sent;
                body = response.body;
                writePath = options.write;

                if (writePath) {
                  fs.writeFileSync(writePath, (0, _stringify2.default)({ request: data, response: response }), 'utf8');
                }

                if (!body.error) {
                  _context.next = 8;
                  break;
                }

                throw body.error;

              case 8:
                tripOptions = body.trips.tripOption;
                return _context.abrupt('return', tripOptions.map(function (tripOption) {
                  var airline = tripOption.slice[0].segment[0].flight.carrier;
                  var price = tripOption.saleTotal;
                  return { airline: airline, price: price };
                }));

              case 10:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function _queryPromise(_x8, _x9, _x10) {
        return _ref.apply(this, arguments);
      }

      return _queryPromise;
    }()
  }]);
  return Api;
}();

module.exports = Api;