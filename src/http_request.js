import http from 'http';
import URL from 'url';

function getData(host,method,path){
   return new Promise((resolve,reject) => {
     let req = http.request({
       'host': host,
       'port': 80,
       'path': path,
       'method': method
     },(res) => {
       if (res.statusCode == 302) {//자동 리다이랙트
         let url = URL.parse(res.headers.location);
         getData(url.hostname,method,url.path).then(resolve).catch(reject);
       }
       else{
         var raw = '';
         res.on('data',(chunk) => raw += chunk);
         res.on('end',() => resolve(raw));
       }
     });
     req.on('error',reject);
     req.end();
   });
}

export default getData;
