'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getData(host, method, path) {
  return new Promise((resolve, reject) => {
    let req = _http2.default.request({
      'host': host,
      'port': 80,
      'path': path,
      'method': method
    }, res => {
      if (res.statusCode == 302) {
        //자동 리다이랙트
        let url = _url2.default.parse(res.headers.location);
        getData(url.hostname, method, url.path).then(resolve).catch(reject);
      } else {
        var raw = '';
        res.on('data', chunk => raw += chunk);
        res.on('end', () => resolve(raw));
      }
    });
    req.on('error', reject);
    req.end();
  });
}

exports.default = getData;