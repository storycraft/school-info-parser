const SCHOOL_CODE = 'N100000589';
let schoolInfoParser = require('./school-info-parser.js');
console.log('asd');
console.log(schoolInfoParser.SchoolMenuParser);
let parser = schoolInfoParser.SchoolMenuParser(schoolInfoParser.SchoolLocation['충청남도'],SCHOOL_CODE,schoolInfoParser.SchoolType['MIDDLE']);
parser.getMonthlyMenu(new Date()).then((info) => console.log(info));
