/**
 * @module src/parser/MenuParser.js
 * @file menu parser
 * @author storycraft <storycraft@storyboard.ml>
 */

import httpRequest from '../request/HttpRequest.js';
import SchoolParser from './SchoolParser.js';
import cheerio from 'cheerio';

const GLOBAL_URL = 'stu.sen.go.kr';/* 서울특별시 나이스 */
const MONTHLY_MENU_URL = 'sts_sci_md00_001.do';

//시간별 코드
const BREAKFAST = 'breakfast';
const LUNCH = 'lunch';
const DINNER = 'dinner';

const CACHE_INTERVAL = 86400000;//하루마다 월 메뉴 재 캐싱

class MenuParser extends SchoolParser {

  /**
   * @constructor create a MenuParser
   *
   * @param  {String} schoolLocation schoolLocation Code
   * @param  {String} schoolCode     schoolCode
   * @param  {String} schoolType     schoolLocation Code
   *
   * @see {@link /src/SchoolParser.js} for more information
   */
  constructor(schoolLocation,schoolCode,schoolType){
    super(schoolLocation,schoolCode,schoolType);
    this.cache = {};
  }

  /**
   * @async getDailyMenu - get daily menu and convert to object
   *
   * @param  {Date} = new Date()    date      date to parse
   * @param  {Boolean}              recache   recache data if true
   * @return {Object}                         structured menu object
   */
  async getDailyMenu(date = new Date(),recache){
    let menus = await this.getMonthlyMenu(date,recache);
    return menus[date.getDate()] || {};
  }

  /**
   * @async getMonthlyMenu - get monthly menu and convert to object
   *
   * @param  {Date} = new Date()    date      date to parse
   * @param  {Boolean}              recache   recache data if true
   * @return {Object}                         structured menu object
   */
  async getMonthlyMenu(date = new Date(),recache){
    let month = date.getMonth() + 1;//현실상 세는 달로 수정
    let schoolDB = this.cache[date.getFullYear()] || (this.cache[date.getFullYear()] = {});

    if (recache || !schoolDB[month] || Date.now() - schoolDB[month].lastCache > CACHE_INTERVAL)
      schoolDB[month] = await parseMenuData(date,super.SchoolLocation,super.SchoolCode,super.SchoolType);

    return schoolDB[month].info;
  }


  /**
   * @async getAllergyInfo - get allergy info
   *
   * @param  {Date} = new Date()    date      date to parse
   * @param  {Boolean}              recache   recache data if true
   * @return {String}                         allergry info text
   */
  async getAllergyInfo(date,recache){
    let month = date.getMonth() + 1;//현실상 세는 달로 수정
    let schoolDB = this.cache[date.getFullYear()] || (this.cache[date.getFullYear()] = {});

    if (recache || !schoolDB[month] || Date.now() - schoolDB[month].lastCache > CACHE_INTERVAL)
      await this.getMonthlyMenu(date,recache);//재캐싱

    return schoolDB[month].allergyInfo;
  }
}

export default MenuParser;

/*
 *
 * HTML 파싱 부분
 *
 */
async function getRawDatabase(date,schoolLocation,schoolCode,schoolType){
  return await httpRequest.get(GLOBAL_URL,`/${MONTHLY_MENU_URL}?domainCode=${schoolLocation}&contEducation=${schoolLocation}&schulCode=${schoolCode}&schulCrseScCode=${schoolType}&schYm=${date.getFullYear()}${date.getMonth() + 1}`);
}

//html 데이터 변경시 수정 필요
async function parseMenuData(date,schoolLocation,schoolCode,schoolType){
  //월 식단 리셋
  var monthDB = {};
  var lunchInfo = (monthDB.info = {});

  monthDB.lastCache = new Date().getTime();//마지막 캐싱 일자 기록

  let raw = await getRawDatabase(date,schoolLocation,schoolCode,schoolType);
  let $ = cheerio.load(raw);
  let content = $('div .sub_con').eq(0);//맨 처음 div
  let lunchTable = content.find('td');
  var child = lunchTable.children();
  for (var i = 0;i < child.length;i++){
    var divs = child[i].children;
    if (divs.length > 1){//미 완성 급식 데이터 처리
      var object = parseToObject(divs);
      lunchInfo[object.day] = object;
    }
  }

  //알레르기 수집파트 시작
  let allergyBox = content.children('div')[0];//알러지 정보는 달력 뒤 div 박스
  var children = allergyBox.children;
  var allergyInfo = '';
  for (var i = 0;i < children.length;i++){
    if (children[i] && children[i].type == 'text' && children[i].data)
      allergyInfo += '\n' + children[i].data; //자동 줄 바꿈
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
          working = BREAKFAST;
          break;

        case '[중식]':
          working = LUNCH;
          break;

        case '[석식]':
          working = DINNER;
          break;

        default:
          if (!object[working])
            object[working] = '';

            object[working] += divs[i].data + '\n';
          break;
      }
    }
  }

  return object;
}
