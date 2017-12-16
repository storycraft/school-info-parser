/**
 * @module src/SchoolInfoParser.js
 * @file school info parser
 * @author storycraft <storycraft@storyboard.ml>
 */

import SchoolParser from './parser/SchoolParser.js';
import MenuParser from './parser/MenuParser.js';
import ScheduleParser from './parser/ScheduleParser.js';

import SchoolType from './SchoolType.js';
import SchoolLocation from './SchoolLocation.js';

function deprecatedScheduleParser(schoolLocation,schoolCode,schoolType){
  return new ScheduleParser(schoolLocation,schoolCode,schoolType);
}

function deprecatedMenuParser(schoolLocation,schoolCode,schoolType){
  return new MenuParser(schoolLocation,schoolCode,schoolType);
}

export { SchoolParser, MenuParser, ScheduleParser, SchoolType, SchoolLocation, /*deprecated*/ deprecatedMenuParser as SchoolMenuParser,/*deprecated*/ deprecatedScheduleParser as SchoolScheduleParser };
