/*
  주의 : 이 문서를 보고 생기는 암은 책임지지 않습니다.
*/
import request from './http_request.js';
import cheerio from 'cheerio';

const GLOBAL_URL = 'stu.sen.go.kr';/* 서울특별시 나이스*/
const SCHEDULE_MONTH_URL = 'sts_sci_sf01_001.do';

const KNDCODE = '03';//?????

const CACHE_INTERVAL = 86400000;//하루마다 월 일정 재 캐싱

const START_MONTH = 3;
const END_MONTH = 2;

const SUMMER_VACTION = '여름방학';
const WINTER_VACTION = '겨울방학';

class SchoolScheduleParser {
  constructor(schoolLocation,schoolCode,schoolType){
    this.cache = {};

    this.schoolLocation = schoolLocation;
    this.schoolCode = schoolCode;
    this.schoolType = schoolType;
  }

  get SchoolCode(){
    return this.schoolCode;
  }

  get SchoolType(){
    return this.schoolType;
  }

  async getMonthlySchedule(date,recache){
    let month = date.getMonth() + 1;//현실상 세는 달로 수정
    let schoolDB = this.cache[date.getFullYear()] || (this.cache[date.getFullYear()] = {});

    if (recache || !schoolDB[month] || Date.now() - schoolDB[month].lastCache > CACHE_INTERVAL)
      schoolDB[month] = await parseScheduleData(date,this.schoolLocation,this.schoolCode,this.schoolType);

    return schoolDB[month].schedules;
  }
}

export default (schoolLocation,schoolCode,schoolType) => new SchoolScheduleParser(schoolLocation,schoolCode,schoolType);

/*
 *
 * HTML 파싱 부분
 *
 */

async function getRawDatabase(date,schoolLocation,schoolCode,schoolType){
  return await request(GLOBAL_URL,'GET',`/${SCHEDULE_MONTH_URL}?domainCode=${schoolLocation}&contEducation=${schoolLocation}&schulCode=${schoolCode}&schulKndScCode=${KNDCODE}&schulCrseScCode=${schoolType}&ay=${date.getFullYear()}&mm=${date.getMonth() + 1}`);
}

//html 데이터 변경시 수정 필요
async function parseScheduleData(date,schoolLocation,schoolCode,schoolType){
  var monthDB = {};
  monthDB.lastCache = new Date().getTime();//마지막 캐싱 일자 기록

  var scheduleObject = (monthDB.schedules = {});

  let raw = await getRawDatabase(date,schoolLocation,schoolCode,schoolType);
  let $ = cheerio.load(raw);

  var contents = $('#contents .sub_con table tbody tr td div');//내부 div 목록
  var firstDay = new Date(date.setDate(1)).getDay();//첫날 인덱스 구하기
  let length = new Date(date.setDate(0)).getDate();//달 길이 구하기
  for (let i = 0;i < length;i++){
    var content = contents.get(i + firstDay);
    if (content)
      scheduleObject[i + 1] = parseTable(scheduleObject,content);//세는 일로 표시
  }
  return monthDB;
}

//html 데이터 변경시 수정 필요
function parseTable(scheduleObject,tableData){
  var children = tableData.children;
  var day = 0;
  var scheduleList = [];
  for (var i = 0;i < children.length;i++){
    var data = children[i];
    if(data.type == 'tag' && data.name == 'a'){
      scheduleList.push(data.children[1]/*\n 문자로 인해 밀림*/.children[0].data/*텍스트 파트*/);
    }
  }
  return scheduleList;
}
