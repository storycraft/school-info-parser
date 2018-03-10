const SCHOOL_CODE = 'N100000589';

import http from 'http';
import assert from 'assert';

import * as SchoolInfoParser from '../src/index.js';

describe('Schedule Parsing Test', () => {
  var schedule = new SchoolInfoParser.ScheduleParser(SchoolInfoParser.SchoolLocation['충청남도'],SCHOOL_CODE,SchoolInfoParser.SchoolType['MIDDLE']);

  it('should return schedule object', (done) => {
    schedule.getMonthlySchedule(new Date()).then((object) => {
      if (typeof(object) !== 'object')
        throw new Error('return value type is not Object');

      console.log('received data',object);
      done();
    });
  });
});
