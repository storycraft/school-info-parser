/*
  주의 : 이 문서를 보고 생기는 암은 책임지지 않습니다.
*/
import http from 'http';
import cheerio from 'cheerio';

const GLOBAL_URL = 'stu.sen.go.kr';/* 서울특별시 나이스 */
const MONTHLY_MENU_URL = 'sts_sci_md00_001.do';

const KNDCODE = '03';//???

//시간별 코드
const BREAKFAST = 'breakfast';
const LUNCH = 'lunch';
const DINNER = 'dinner';

//stu.cne.go.kr/sts_sci_md00_001.do?schulCode=N100000589&schulCrseScCode=3&schulKndScCode=03&schYm=201710
//2017년 10월 메뉴 받아오기
const CACHE_INTERVAL = 86400000;//하루마다 월 메뉴 재 캐싱

class SchoolMenuParser {
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

  async getDailyMenu(date,recache){
    return await this.getMonthlyMenu(date,recache)[date.getDate() + 1];
  }

  async getMonthlyMenu(date,recache){
    let month = date.getMonth() + 1;//현실상 세는 달로 수정
    let schoolDB = this.cache[date.getFullYear()] || (this.cache[date.getFullYear()] = {});

    if (recache || !schoolDB[month] || Date.now() - schoolDB[month].lastCache > CACHE_INTERVAL)
      this.cache[date.getFullYear()] = await parseMenuData(date,this.schoolLocation,this.schoolCode,this.schoolType);

    return schoolDB[month].schedules;
  }

  async getAllergyInfo(date,recache){
    let month = date.getMonth() + 1;//현실상 세는 달로 수정
    let schoolDB = this.cache[date.getFullYear()] || (this.cache[date.getFullYear()] = {});

    if (recache || !schoolDB[month] || Date.now() - schoolDB[month].lastCache > CACHE_INTERVAL)
      await this.getMonthlyMenu(date,recache);//재캐싱

    return schoolDB[month].allergyInfo;
  }
}

export default (schoolLocation,schoolCode,schoolType) => new schoolMenuParser(schoolLocation,schoolCode,schoolType);

/*
 *
 * HTML 파싱 부분
 *
 */
function getRawDatabase(date,schoolLocation,schoolCode,schoolType){
  return new Promise((resolve,reject) => {
    let req = http.request({
      'host': schoolLocation,
      'port': 80,
      'path': `/${MONTHLY_MENU_URL}?domainCode=${schoolLocation}&contEducation=${schoolLocation}&schulCode=${schoolCode}&schulCrseScCode=${schoolType}&schulKndScCode=${KNDCODE}&ay=${date.getFullYear()}&mm=${date.getMonth() + 1}`,
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
async function parseMenuData(date){
  var month = date.getMonth();
  //월 식단 리셋

  var monthDB = {};

  monthDB.lastCache = new Date().getTime();//마지막 캐싱 일자 기록

  let raw = await getRawDatabase(date);
  let $ = cheerio.load(raw);

  let content = $('div .sub_con').eq(0);//맨 처음 div
  let lunchTable = content.find('td');
  var child = lunchTable.children();
  for (var i = 0;i < child.length;i++){
    var divs = child[i].children;
    if (divs.length > 1){//미 완성 급식 데이터 처리
      var object = parseToObject(divs);
      monthDB[object.day] = object;
    }
  }

  //알레르기 수집파트 시작
  var allergyBox = content.children('div')[0].children;//알러지 정보는 달력 뒤 div 박스
  var allergyInfo = '';
  for (var i = 0;i < allergyBox.length;i++){
    if (allergyBox[i] && allergyBox[i].type == 'text' && allergyBox[i].data)
      allergyInfo += '\n' + allergyBox[i].data; //자동 줄 바꿈
  }
  monthDB.allergyInfo = allergyInfo;//알러지 정보 저장

  return monthDB;
}

//html 데이터 변경시 수정 필요
function parseToObject(divs){
  var object = {};
  var working = null;
  var day = divs[0].data;

  object.day = day;

  for (var i = 1;i < divs.length;i++){
    if (divs[i].type == 'text' && divs[i].data && divs[i].data.trim() != ''){
      switch (divs[i].data) {
        case '[조식]':
          working = object[BREAKFAST] = {};
          working.info = '';
          break;

        case '[중식]':
          working = object[LUNCH] = {};
          working.info = '';
          break;

        case '[석식]':
          working = object[DINNER] = {};
          working.info = '';
          break;

        default:
          if (working)
            working.info += divs[i].data + '\n';
          break;
      }
    }
  }

  return object;
}
