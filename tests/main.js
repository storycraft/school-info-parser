const SCHOOL_CODE = 'N100000589';
let schoolInfoParser = require('../build/school_info_parser.js');

let meal = schoolInfoParser.SchoolMenuParser(schoolInfoParser.SchoolLocation['충청남도'],SCHOOL_CODE,schoolInfoParser.SchoolType['MIDDLE']);
let schedule = schoolInfoParser.SchoolScheduleParser(schoolInfoParser.SchoolLocation['충청남도'],SCHOOL_CODE,schoolInfoParser.SchoolType['MIDDLE']);

let date = new Date();
meal.getMonthlyMenu(date).then(print);
schedule.getMonthlySchedule(date).then(print);

function print(info){
  console.log(info);
}
