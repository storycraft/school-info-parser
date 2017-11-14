/*
  주의 : 이 문서를 보고 생기는 암은 책임지지 않습니다.
*/
import http from 'http';
import cheerio from 'cheerio';

const GLOBAL_URL = 'stu.sen.go.kr';/* 서울특별시 나이스*/
const SCHEDULE_MONTH_URL = 'sts_sci_sf01_001.do';

const KNDCODE = '03';//???

const CACHE_INTERVAL = 86400000;//하루마다 월 일정 재 캐싱

const START_MONTH = 3;
const END_MONTH = 2;

const SUMMER_VACTION = '여름방학';
const WINTER_VACTION = '겨울방학';

//온양중학교 10월 일정
//http://stu.cne.go.kr/sts_sci_sf00_001.do?schulCode=N100000589&schulCrseScCode=3&schulKndScCode=03&ay=2017&sem=2

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

export default (schoolCode,schoolType) => new SchoolScheduleParser(schoolCode,schoolType);

/*
 *
 * HTML 파싱 부분
 *
 */
function getRawDatabase(date,schoolLocation,schoolCode,schoolType){
  return new Promise((resolve,reject) => {
    let req = http.request({
      'host': GLOBAL_URL,
      'port': 80,
      'path': `/${SCHEDULE_MONTH_URL}?domainCode=${schoolLocation}&contEducation=${schoolLocation}&schulCode=${schoolCode}&schulCrseScCode=${schoolType}&schulKndScCode=${KNDCODE}&ay=${date.getFullYear()}&mm=${date.getMonth() + 1}`,
      'method': 'GET'
    },(res) => {
      var raw = '';
      res.on('data',(chunk) => raw += chunk);
      res.on('end',() => resolve(raw));
      res.on('error',(e) => reject(e));
    });

    req.end();
  });
}

//html 데이터 변경시 수정 필요
async function parseScheduleData(date){
  var month = date.getMonth() + 1;//세는 달로 표시
  var monthDB = {};
  monthDB.lastCache = new Date().getTime();//마지막 캐싱 일자 기록

  var scheduleObject = (schoolDB.schedules = {});

  let raw = await getRawDatabase(date);
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
