[![NPM](https://nodei.co/npm/school-info-parser.png)](https://www.npmjs.com/package/school-info-parser)

학교 일정 & 급식 정보 파서
======================

간단한 nodejs 파싱 모듈

# API 문서

[api.md](api.md) 문서 참고

# 사용 예

    const SCHOOL_CODE = 'N100000589';

    let schoolInfoParser = require('school-info-parser');
    let parser = new schoolInfoParser.SchoolMenuParser(schoolInfoParser.SchoolLocation['충청남도'],SCHOOL_CODE,schoolInfoParser.SchoolType['MIDDLE']);

    parser.getDailyMenu(new Date()).then((info) => console.log(info));
