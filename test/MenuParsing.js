const SCHOOL_CODE = 'N100000589';

import http from 'http';
import assert from 'assert';

import * as SchoolInfoParser from '../src/index.js';

describe('Menu Parsing Test', () => {
  var menu = new SchoolInfoParser.MenuParser(SchoolInfoParser.SchoolLocation['충청남도'],SCHOOL_CODE,SchoolInfoParser.SchoolType['MIDDLE']);

  it('should return monthly menu object', (done) => {
    menu.getMonthlyMenu(new Date()).then((object) => {
      if (typeof(object) !== 'object')
        throw new Error('return value type is not Object');

      console.log('received data',object);
      done();
    });
  });

  it('should return daily menu object', (done) => {
    menu.getDailyMenu(new Date()).then((object) => {
      if (typeof(object) !== 'object')
        throw new Error('return value type is not Object');

      console.log('received data',object);
      done();
    });
  });

  it('should return allergry info text', (done) => {
    menu.getAllergyInfo(new Date()).then((allergryInfo) => {
      if (typeof(allergryInfo) !== 'string')
        throw new Error('return value type is not String');

      console.log('received data',allergryInfo);
      done();
    });
  });
});
