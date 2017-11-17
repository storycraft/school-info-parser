const SCHOOL_CODE = 'N100000589';
let schoolInfoParser = require('../build/school_info_parser.js');

let meal = schoolInfoParser.SchoolMenuParser();
let schedule = schoolInfoParser.SchoolScheduleParser(schoolInfoParser.SchoolLocation['충청남도'],SCHOOL_CODE,schoolInfoParser.SchoolType['MIDDLE']);

let date = new Date();
meal.getDailyMenu(date).then(print);

function print(info){
  console.log(info);
}
