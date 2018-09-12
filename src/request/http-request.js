/**
 * @module src/request/http-request.js
 * @file http request helper module
 * @author storycraft <storycraft@storyboard.ml>
 */

import http from 'http';
import https from 'https';
import URL from 'url';

class HttpRequest {
  constructor(){
    throw new ReferenceError();
  }

  /**
   * @static createHttpRequest - create http request from given url
   *
   * @param  {String}   host            host url
   * @param  {String}   method = 'GET'  request method
   * @param  {String}   path = '/'      host path
   * @param  {Number}   port = 80       request port
   * @param  {Function} onResponse      response callback (res)
   * @return {Object}                   http ClientRequest object
   */
  static createHttpRequest(host,method = 'GET',path = '/',port = 80,onResponse){
    if (!host)
      throw new Error('host cannot be null');

    return http.request({
      'host': host,
      'port': port,
      'path': path,
      'method': method
    },onResponse);
  }

  /**
   * @static createHttpsRequest - create https request from given url
   *
   * @param  {String}   host            host url
   * @param  {String}   method = 'GET'  request method
   * @param  {String}   path = '/'      host path
   * @param  {Number}   port = 443       request port
   * @param  {Function} onResponse      response callback (res)
   * @return {Object}                   https ClientRequest object
   */
  static createHttpsRequest(host,method = 'GET',path = '/',port = 443,onResponse){
    if (!host)
      throw new Error('host cannot be null');

    return https.request({
      'host': host,
      'port': port,
      'path': path,
      'method': method
    },onResponse);
  }

  /**
   * @static getHttp - send http get request from given url
   *
   * @param  {String} host   host url
   * @param  {String} path   host path
   * @return {String}        raw response String
   */
  static getHttp(host,path){
    return new Promise((resolve,reject) => {
      var onResponse = (res) => {
        if (res.statusCode == 302) {//request again if response status is redirect
          let url = URL.parse(res.headers.location);
          HttpRequest.getHttp(url.hostname,url.path).then(resolve).catch(reject);
          return;
        }

         var raw = '';
         res.on('data',(chunk) => raw += chunk);
         res.on('end',() => resolve(raw));
      };

      let req = HttpRequest.createHttpRequest(host,'GET',path,80,onResponse);

      req.on('error',reject);
      req.end();
    });
 }

 /**
   * @static getHttps - send https get request from given url
   *
   * @param  {String} host   host url
   * @param  {String} path   host path
   * @return {String}        raw response String
   */
  static getHttps(host,path){
    return new Promise((resolve,reject) => {
      var onResponse = (res) => {
        if (res.statusCode == 302) {//request again if response status is redirect
          let url = URL.parse(res.headers.location);
          HttpRequest.getHttps(url.hostname,url.path).then(resolve).catch(reject);
          return;
        }

         var raw = '';
         res.on('data',(chunk) => raw += chunk);
         res.on('end',() => resolve(raw));
      };

      let req = HttpRequest.createHttpsRequest(host,'GET',path,443,onResponse);

      req.on('error',reject);
      req.end();
    });
 }
}

export default HttpRequest;
