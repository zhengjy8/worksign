const CryptoJS = require('./crypto-js')
// const CryptoJS = window.CryptoJS
import { fetch } from 'whatwg-fetch'
//发送 sms code
async function sendSMSCode(phone) {
  var fd = new FormData();
  fd.append('mobile', phone);

  return fetch('/api/site/ajax-send-sms-code/login', {
    method: 'POST',
    // headers: {
    //   'Origin': 'https://e.xinrenxinshi.com',
    //   'Referer': 'https://e.xinrenxinshi.com/index'
    // },
    credentials: 'include',
    body: fd
  }).then(res => res.json())

}

let resultDemo = {
  "code": 0,
  "message": "验证码发送成功",
  "status": true,
  "data": {
    "code_id": 108104 //登陆的时候需要使用
  }
}

//login 
async function login(mobile, verify_code, verify_code_id, type = 1) {
  var fd = new FormData();
  fd.append('mobile', mobile);
  fd.append('verify_code', verify_code);
  fd.append('verify_code_id', verify_code_id);
  fd.append('type', 1);

  return fetch('/api/site/ajax-login', {
    method: 'POST',
    // headers: {
    //   'Origin': 'https://e.xinrenxinshi.com',
    //   'Referer': 'https://e.xinrenxinshi.com/index'
    // },
    credentials: 'include',
    body: fd
  }).then(res => res.json())
}

resultDemo = {
  "code": 0,
  "message": "登录成功",
  "status": true,
  "data": {
    "sessionId": "bf3e386528ad40",
    "url": "/index"
  }
}

// csrf Token
async function csrfToken() {
  return fetch('/api/env/ajax-common', {
    // headers: {
    //   'Origin': 'https://e.xinrenxinshi.com',
    //   'Referer': 'https://e.xinrenxinshi.com/index'
    // },
    credentials: 'include',
  }).then(res => res.json())
}

//成功
resultDemo = {
  "code": 0,
  "message": "获取成功",
  "status": true,
  "data": {
    "csrf": "==",
    "skin": 4
  }
}

//失败
resultDemo = {
  code: 4001,
  data: "/site/logon",
  message: "请先登录",
  status: false
}

//签到
// app.sdsds.js 4428
// "timestamp=1520250455999&accuracy=1999&latitude=22.396438205993736&longitude=114.10950785348682"
async function sign(longitude, latitude, crsfToken) {

  //key = "[!]+K.&`d"
  //CryptoJS.algo.HMAC.   

  const timestamp = Date.now(),
    p1 = [{
      longitude: longitude
    }, {
      latitude: latitude
    }, {
      accuracy: 1999
    }, {
      timestamp: timestamp
    }],
    p2 = {
      a: "c0$=[Z#4s)",
      overtimeCompensationRuleArray: ["无补偿", "调休假", "加班费"],
      p: "[!]+K.&`d",
      s: "N)&*,[!]("
    },
    p3 = CryptoJS;
  // var signature = window.tdefault(p1, p2, p3)

  var l = "timestamp=" + timestamp + "&accuracy=" + "1999" + "&latitude=" + latitude + "&longitude=" + longitude;
  var signature = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA1(l, "[!]+K.&`d"));

  console.log('%c'+ signature, "color:yellow");

  return fetch('/api/attendance/ajax-sign', {
    method: 'POST',
    headers: {
      // 'Origin': 'https://e.xinrenxinshi.com',
      // 'Referer': 'https://e.xinrenxinshi.com/index',
      'X-CSRF-TOKEN': crsfToken,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({
      longitude,
      latitude,
      signature,
      accuracy: 1999,
      timestamp: timestamp
    })
  }).then(res => res.json())
}



//取Cookie的值  
function getCookie(name) {
  var arg = name + "=";
  var alen = arg.length;
  var clen = document.cookie.length;
  var i = 0;
  while (i < clen) {
    var j = i + alen;
    if (document.cookie.substring(i, j) == arg) return getCookieVal(j);
    i = document.cookie.indexOf(" ", i) + 1;
    if (i == 0) break;
  }
  return null;
}
//写入到Cookie  
//name:cookie名称  value:cookie值   
function setCookie(name, value) {
  var Days = 30;
  var exp = new Date();
  exp.setTime(exp.getTime() + 60 * 2000); //过期时间 2分钟  
  document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

function getCookieVal(offset) {
  var endstr = document.cookie.indexOf(";", offset);
  if (endstr == -1) endstr = document.cookie.length;
  return unescape(document.cookie.substring(offset, endstr));
}


// var obj = {
//   sendSMSCode: sendSMSCode,
//   login: login,
//   csrfToken: csrfToken,
//   sign: sign,
//   getCookie: getCookie
// }

// Object.assign(window,obj)

module.exports = {
  sendSMSCode,
  login,
  csrfToken,
  sign,
  getCookie
}