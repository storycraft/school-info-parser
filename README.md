[![NPM](https://nodei.co/npm/school-info-parser.png)](https://www.npmjs.com/package/school-info-parser)  
[![CodeFactor](https://www.codefactor.io/repository/github/storycraft/school-info-parser/badge)]

학교 일정 & 급식 정보 파서
======================

간단한 nodejs 파서  

# API 문서

**기존 코드는 deprecated 되었습니다. api.md 문서를 참고해서 고쳐 주세요.**
[API 문서](api.md) 참고  

# 사용 예

    //급식 정보 파싱
    const SCHOOL_CODE = 'N100000589';

    let schoolInfoParser = require('school-info-parser');
    let parser = new schoolInfoParser.MenuParser(schoolInfoParser.SchoolLocation['충청남도'],SCHOOL_CODE,schoolInfoParser.SchoolType['MIDDLE']);

    parser.getDailyMenu(new Date()).then((info) => console.log(info));
