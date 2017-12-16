const SCHOOL_CODE = 'N100000589';

import http from 'http';
import assert from 'assert';

import HttpRequest from '../src/request/HttpRequest.js';

describe('http request test', () => {
  it('should return google html text', (done) => {
    HttpRequest.get('google.com').then((object) => {
      if (typeof(object) !== 'string')
        throw new Error('return value type is not String');
      done();
    });
  });
});
