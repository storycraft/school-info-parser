학교 일정 & 급식 정보 파서
======================

# API 문서

## 모듈 기본 사용법

  let schoolInfoParser = require('school-info-parser');

로 로드시

schoolInfoParser.SchoolMenuParser(schoolLocation,schoolCode,schoolType)

급식 파서 생성

schoolInfoParser.SchoolScheduleParser(schoolLocation,schoolCode,schoolType)

학사 일정 파서 생성

schoolInfoParser.SchoolType['ELEMENTARY','MIDDLE','HIGHT'];

SchoolType 각각 초,중,고

schoolInfoParser.SchoolLocation['도 이름'];

학교 위치를 불러옵니다.(각 도 별 파싱 위치가 다릅니다)

ex) schoolInfoParser.SchoolLocation['경기도'];

## SchoolMenuParser

getter schoolMenuParser.SchoolCode

해당 파서의 학교 코드

getter schoolMenuParser.SchoolType

해당 파서의 학교 타입

schoolMenuParser.getMonthlyMenu(Date)
schoolMenuParser.getMonthlyMenu(Date,recache)

해당 날짜의 월 급식 객체를 반환 합니다

schoolMenuParser.getDailyMenu(Date)
schoolMenuParser.getDailyMenu(Date,recache)

해당 날짜의 급식 객체를 반환 합니다

schoolMenuParser.getAllergyInfo(Date)
schoolMenuParser.getAllergyInfo(Date,recache)

해당 날짜의 월 급식 알러지 정보 문자열을 반환 합니다

recache가 true일시 재 캐싱합니다


## SchoolScheduleParser

getter schoolScheduleParser.SchoolCode

해당 파서의 학교 코드

getter schoolScheduleParser.SchoolType

해당 파서의 학교 타입

schoolScheduleParser.getMonthlySchedule(Date)
schoolScheduleParser.getMonthlySchedule(Date,recache)

해당 날짜의 월 일정 객체를 반환 합니다

recache가 true일시 재 캐싱합니다


# 사용 예

    const SCHOOL_CODE = 'N100000589';
    let schoolInfoParser = require('school-info-parser');
    let parser = schoolInfoParser.SchoolMenuParser(schoolInfoParser.SchoolLocation['충청남도'],SCHOOL_CODE,schoolInfoParser.SchoolType['MIDDLE']);
    parser.getDailyMenu(new Date()).then((info) => console.log(info));
