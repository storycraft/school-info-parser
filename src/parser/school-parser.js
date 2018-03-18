/**
 * @module src/parser/school-parser.js
 * @file virtual school parser
 * @author storycraft <storycraft@storyboard.ml>
 */

export default class SchoolParser {
   /**
    * @constructor create a SchoolParser
    *
    * @param  {String} schoolLocation schoolLocation Code
    * @param  {String} schoolCode     schoolCode
    * @param  {String} schoolType     schoolLocation Code
    *
    * @see {@link /src/schoolLocation.js} for schoolLocation Code
    * @see {@link https://www.meatwatch.go.kr/biz/bm/sel/schoolListPopup.do | schoolCode searcher} to search schoolCode
    * @see {@link /src/SchoolType.js} for schoolType Code
    */
   constructor(schoolLocation,schoolCode,schoolType){
     /** @access private */
     this.schoolLocation = schoolLocation;
     this.schoolCode = schoolCode;
     this.schoolType = schoolType;

   }

   /**
    * get SchoolCode - schoolCode of parser
    *
    * @return {String}  schoolCode
    */
   get SchoolCode(){
     return this.schoolCode;
   }

   /**
    * get SchoolLocation - SchoolLocation of parser
    *
    * @return {String}  SchoolLocation
    */
   get SchoolLocation(){
     return this.schoolLocation;
   }

   /**
    * get SchoolType - SchoolType of parser
    *
    * @return {String}  schoolType
    */
   get SchoolType(){
     return this.schoolType;
   }
 }

export class SchoolDataDeserializer {
  constructor(schoolParser){
    this.schoolParser = schoolParser;
  }

  get SchoolParser(){
    return this.schoolParser;
  }

  deserialize(){
    
  }
}