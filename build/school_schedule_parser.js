'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       주의 : 이 문서를 보고 생기는 암은 책임지지 않습니다.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     */


/*
 *
 * HTML 파싱 부분
 *
 */

var getRawDatabase = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(date, schoolLocation, schoolCode, schoolType) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return (0, _http_request2.default)(GLOBAL_URL, 'GET', '/' + SCHEDULE_MONTH_URL + '?domainCode=' + schoolLocation + '&contEducation=' + schoolLocation + '&schulCode=' + schoolCode + '&schulKndScCode=' + KNDCODE + '&schulCrseScCode=' + schoolType + '&ay=' + date.getFullYear() + '&mm=' + (date.getMonth() + 1));

          case 2:
            return _context2.abrupt('return', _context2.sent);

          case 3:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function getRawDatabase(_x3, _x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

//html 데이터 변경시 수정 필요


var parseScheduleData = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(date, schoolLocation, schoolCode, schoolType) {
    var monthDB, scheduleObject, raw, $, contents, firstDay, length, i, content;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            monthDB = {};

            monthDB.lastCache = new Date().getTime(); //마지막 캐싱 일자 기록

            scheduleObject = monthDB.schedules = {};
            _context3.next = 5;
            return getRawDatabase(date, schoolLocation, schoolCode, schoolType);

          case 5:
            raw = _context3.sent;
            $ = _cheerio2.default.load(raw);
            contents = $('#contents .sub_con table tbody tr td div'); //내부 div 목록

            firstDay = new Date(date.setDate(1)).getDay(); //첫날 인덱스 구하기

            length = new Date(date.setDate(0)).getDate(); //달 길이 구하기

            for (i = 0; i < length; i++) {
              content = contents.get(i + firstDay);

              if (content) scheduleObject[i + 1] = parseTable(scheduleObject, content); //세는 일로 표시
            }
            return _context3.abrupt('return', monthDB);

          case 12:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function parseScheduleData(_x7, _x8, _x9, _x10) {
    return _ref3.apply(this, arguments);
  };
}();

//html 데이터 변경시 수정 필요


var _http_request = require('./http_request.js');

var _http_request2 = _interopRequireDefault(_http_request);

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GLOBAL_URL = 'stu.sen.go.kr'; /* 서울특별시 나이스*/
var SCHEDULE_MONTH_URL = 'sts_sci_sf01_001.do';

var KNDCODE = '03'; //?????

var CACHE_INTERVAL = 86400000; //하루마다 월 일정 재 캐싱

var START_MONTH = 3;
var END_MONTH = 2;

var SUMMER_VACTION = '여름방학';
var WINTER_VACTION = '겨울방학';

var SchoolScheduleParser = function () {
  function SchoolScheduleParser(schoolLocation, schoolCode, schoolType) {
    _classCallCheck(this, SchoolScheduleParser);

    this.cache = {};

    this.schoolLocation = schoolLocation;
    this.schoolCode = schoolCode;
    this.schoolType = schoolType;
  }

  _createClass(SchoolScheduleParser, [{
    key: 'getMonthlySchedule',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(date, recache) {
        var month, schoolDB;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                month = date.getMonth() + 1; //현실상 세는 달로 수정

                schoolDB = this.cache[date.getFullYear()] || (this.cache[date.getFullYear()] = {});

                if (!(recache || !schoolDB[month] || Date.now() - schoolDB[month].lastCache > CACHE_INTERVAL)) {
                  _context.next = 6;
                  break;
                }

                _context.next = 5;
                return parseScheduleData(date, this.schoolLocation, this.schoolCode, this.schoolType);

              case 5:
                schoolDB[month] = _context.sent;

              case 6:
                return _context.abrupt('return', schoolDB[month].schedules);

              case 7:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getMonthlySchedule(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return getMonthlySchedule;
    }()
  }, {
    key: 'SchoolCode',
    get: function get() {
      return this.schoolCode;
    }
  }, {
    key: 'SchoolType',
    get: function get() {
      return this.schoolType;
    }
  }]);

  return SchoolScheduleParser;
}();

exports.default = function (schoolLocation, schoolCode, schoolType) {
  return new SchoolScheduleParser(schoolLocation, schoolCode, schoolType);
};

function parseTable(scheduleObject, tableData) {
  var children = tableData.children;
  var day = 0;
  var scheduleList = [];
  for (var i = 0; i < children.length; i++) {
    var data = children[i];
    if (data.type == 'tag' && data.name == 'a') {
      scheduleList.push(data.children[1] /*\n 문자로 인해 밀림*/.children[0].data /*텍스트 파트*/);
    }
  }
  return scheduleList;
}