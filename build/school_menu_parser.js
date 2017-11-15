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
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(date, schoolLocation, schoolCode, schoolType) {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return (0, _http_request2.default)(GLOBAL_URL, 'GET', '/' + MONTHLY_MENU_URL + '?domainCode=' + schoolLocation + '&contEducation=' + schoolLocation + '&schulCode=' + schoolCode + '&schulCrseScCode=' + schoolType + '&schYm=' + date.getFullYear() + (date.getMonth() + 1));

          case 2:
            return _context4.abrupt('return', _context4.sent);

          case 3:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function getRawDatabase(_x7, _x8, _x9, _x10) {
    return _ref4.apply(this, arguments);
  };
}();

//html 데이터 변경시 수정 필요


var parseMenuData = function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(date, schoolLocation, schoolCode, schoolType) {
    var monthDB, lunchInfo, raw, $, content, lunchTable, child, i, divs, object, allergyBox, children, allergyInfo;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            //월 식단 리셋
            monthDB = {};
            lunchInfo = monthDB.info = {};


            monthDB.lastCache = new Date().getTime(); //마지막 캐싱 일자 기록

            _context5.next = 5;
            return getRawDatabase(date, schoolLocation, schoolCode, schoolType);

          case 5:
            raw = _context5.sent;
            $ = _cheerio2.default.load(raw);
            content = $('div .sub_con').eq(0); //맨 처음 div

            lunchTable = content.find('td');
            child = lunchTable.children();

            for (i = 0; i < child.length; i++) {
              divs = child[i].children;

              if (divs.length > 1) {
                //미 완성 급식 데이터 처리
                object = parseToObject(divs);

                lunchInfo[object.day] = object;
              }
            }

            //알레르기 수집파트 시작
            allergyBox = content.children('div')[0]; //알러지 정보는 달력 뒤 div 박스

            children = allergyBox.children;
            allergyInfo = '';

            for (i = 0; i < children.length; i++) {
              if (children[i] && children[i].type == 'text' && children[i].data) allergyInfo += '\n' + children[i].data; //자동 줄 바꿈
            }
            monthDB.allergyInfo = allergyInfo; //알러지 정보 저장

            return _context5.abrupt('return', monthDB);

          case 17:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function parseMenuData(_x11, _x12, _x13, _x14) {
    return _ref5.apply(this, arguments);
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

var GLOBAL_URL = 'stu.sen.go.kr'; /* 서울특별시 나이스 */
var MONTHLY_MENU_URL = 'sts_sci_md00_001.do';

//시간별 코드
var BREAKFAST = 'breakfast';
var LUNCH = 'lunch';
var DINNER = 'dinner';

var CACHE_INTERVAL = 86400000; //하루마다 월 메뉴 재 캐싱

var SchoolMenuParser = function () {
  function SchoolMenuParser(schoolLocation, schoolCode, schoolType) {
    _classCallCheck(this, SchoolMenuParser);

    this.cache = {};

    this.schoolLocation = schoolLocation;
    this.schoolCode = schoolCode;
    this.schoolType = schoolType;
  }

  _createClass(SchoolMenuParser, [{
    key: 'getDailyMenu',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(date, recache) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.getMonthlyMenu(date, recache)[date.getDate() + 1];

              case 2:
                return _context.abrupt('return', _context.sent);

              case 3:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getDailyMenu(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return getDailyMenu;
    }()
  }, {
    key: 'getMonthlyMenu',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(date, recache) {
        var month, schoolDB;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                month = date.getMonth() + 1; //현실상 세는 달로 수정

                schoolDB = this.cache[date.getFullYear()] || (this.cache[date.getFullYear()] = {});

                if (!(recache || !schoolDB[month] || Date.now() - schoolDB[month].lastCache > CACHE_INTERVAL)) {
                  _context2.next = 6;
                  break;
                }

                _context2.next = 5;
                return parseMenuData(date, this.schoolLocation, this.schoolCode, this.schoolType);

              case 5:
                schoolDB[month] = _context2.sent;

              case 6:
                return _context2.abrupt('return', schoolDB[month].info);

              case 7:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function getMonthlyMenu(_x3, _x4) {
        return _ref2.apply(this, arguments);
      }

      return getMonthlyMenu;
    }()
  }, {
    key: 'getAllergyInfo',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(date, recache) {
        var month, schoolDB;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                month = date.getMonth() + 1; //현실상 세는 달로 수정

                schoolDB = this.cache[date.getFullYear()] || (this.cache[date.getFullYear()] = {});

                if (!(recache || !schoolDB[month] || Date.now() - schoolDB[month].lastCache > CACHE_INTERVAL)) {
                  _context3.next = 5;
                  break;
                }

                _context3.next = 5;
                return this.getMonthlyMenu(date, recache);

              case 5:
                return _context3.abrupt('return', schoolDB[month].allergyInfo);

              case 6:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function getAllergyInfo(_x5, _x6) {
        return _ref3.apply(this, arguments);
      }

      return getAllergyInfo;
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

  return SchoolMenuParser;
}();

exports.default = function (schoolLocation, schoolCode, schoolType) {
  return new SchoolMenuParser(schoolLocation, schoolCode, schoolType);
};

function parseToObject(divs) {
  var object = {};
  var working = null;
  var day = divs[0].data;

  object.day = day;

  for (var i = 1; i < divs.length; i++) {
    if (divs[i].type == 'text' && divs[i].data && divs[i].data.trim() != '') {
      switch (divs[i].data) {
        case '[조식]':
          working = BREAKFAST;
          break;

        case '[중식]':
          working = LUNCH;
          break;

        case '[석식]':
          working = DINNER;
          break;

        default:
          if (!object[working]) object[working] = '';

          object[working] += divs[i].data + '\n';
          break;
      }
    }
  }

  return object;
}