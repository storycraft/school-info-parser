학교 일정 & 급식 정보 파서
======================

# 사용 예
    const SCHOOL_CODE = 'N100000589';
    let schoolInfoParser = require('../dist/school-info-parser.min.js');
    let parser = schoolInfoParser.SchoolMenuParser(schoolInfoParser.SchoolLocation['충청남도'],SCHOOL_CODE,schoolInfoParser.SchoolType['MIDDLE']);
    parser.getDailyMenu(new Date()).then((info) => console.log(info));