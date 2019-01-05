const Cookies = require('./cookie')
const CryptoJS = require('./crypto-js')
const {
    sendSMSCode,
    login,
    csrfToken,
    sign,
    getCookie
} = require('./api') 

import getTrans from './pointTran'
// var sendSMSCode = window.sendSMSCode
// var login = window.login
// var csrfToken = window.csrfToken
// var sign = window.sign
// var getCookie = window.getCookie
// var Cookies = window.Cookies
// var CryptoJS = window.CryptoJS

let message = document.getElementById('message')
let btnLogout = document.getElementById('btnLogout')
let rec_status = document.getElementById('rec_status')
let rec_phone = document.getElementById('rec_phone')
let rec_loc = document.getElementById('rec_loc')
let rec_geoLoc = document.getElementById('rec_geoLoc')
let loginZone = document.getElementById('loginZone')
let phone = document.getElementById('phone')
let btnSendSMS = document.getElementById('btnSendSMS')
let code = document.getElementById('code')
let btnLogin = document.getElementById('btnLogin')
let btnSign = document.getElementById('btnSign')

// 初始化全局变量
localStorage.setItem('xrxsZhiChiParams', JSON.stringify({
    "partnerId": "a8633497bd2411e68d9500163e2ecffb"
}))
window.__oneApmKey__ = "[1d4IUc>3("
window.__tingyunLoaction__ = JSON.parse(localStorage.xrxsZhiChiParams || "{}").partnerId || "Yf&*#";
CryptoJS.a = CryptoJS.enc.Base64
CryptoJS.c = function (message, key) {
    return new CryptoJS.algo.HMAC.init(CryptoJS.algo.SHA1, key).finalize(message);
}



let code_id /* sms code_id*/, crsfToken /* crsf Token */

//发送验证
btnSendSMS.addEventListener('click', async () => {
    try {
        let result = await sendSMSCode(phone.value)
        result.status ? code_id = result.data['code_id'] : displayMessage(result)
    } catch (err) {
        message.innerText = err.message
    }
})

//模拟登陆
btnLogin.addEventListener('click', async () => {
    try {
        let result = await login(phone.value, code.value, code_id)
        if (result.status) {
            loginZone.style.display = 'none' //隐藏登陆区域
            btnSign.removeAttribute('disabled') //允许打卡

            //更新cookie过期时间，设置7天过期
            let QJYDSID = Cookies.get('QJYDSID')
            Cookies.remove('QJYDSID')
            Cookies.set('QJYDSID', QJYDSID, {
                expires: 30
            })

            //保存当前登陆手机号码
            localStorage.setItem('phone', phone.value)

            //显示登出
            btnLogout.style.display = 'inline'

            //显示登陆状态，设置的地址等
            setPanelInfo()

            //告知登陆成功
            alert(result.message || '登陆成功')


        } else {
            //显示错误消息
            displayMessage(result)
        }
    } catch (err) {
        message.innerText = err.message
    }
})

//登出
btnLogout.addEventListener('click', () => {
    //清除cookie
    Cookies.remove('QJYDSID')
    //清除不必要的消息
    clearInfo()
    //刷新页面
    setTimeout(function () {
        window.location.reload()
    }, 100)
})

//签到
btnSign.addEventListener('click', () => {
    try {
        executeSign()
    } catch (err) {
        message.innerText = `未知异常：` + JSON.stringify(err)
    }
})

//执行打卡
async function executeSign() {
    //获取 csrf Token
    let tokenRes = await csrfToken()
    if (tokenRes.status) {
        crsfToken = tokenRes.data.csrf
        //let result = await sign(116.27675861439648, 40.04732987671876, crsfToken)
        //获取转换后的经纬度
        let loc = getGeoLocation()
        //loc.lng = 119.27675861439648
        //loc.lat = 42.04732987671876
        //签到
        let result = await sign(loc.lng, loc.lat, crsfToken)
        result.status ? saveHistory() && alert('签到成功') : displayMessage(result)
    } else {
        displayMessage(tokenRes)
    }
}


//初始化页面
function init() {
    //检查登陆状态
    var qjydsid = getCookie('QJYDSID')
    if (!qjydsid) {
        loginZone.style.display = 'block'
    } else {
        loginZone.style.display = 'none'
        btnSign.removeAttribute('disabled') //允许打卡
    }

    //检查地址设置情况
    if (localStorage.getItem('lat') == null || localStorage.getItem('lng') == null) {
        window.location.href = '/point.html'
    }

    //设置登陆状态等信息
    setPanelInfo()

}

//获取经纬度
let tran = getTrans()

function getGeoLocation() {
    let lng = localStorage.getItem('lng'),
        lat = localStorage.getItem('lat'),
        //转换
        pp1 = tran.bd09togcj02(lng, lat),
        pp2 = tran.gcj02towgs84(pp1[0], pp1[1])

    return {
        lng: pp2[0],
        lat: pp2[1]
    }
}

//设置登陆状态，手机号码，经纬度等信息
function setPanelInfo() {
    var qjydsid = getCookie('QJYDSID')
    rec_status.innerText = qjydsid ? '已登陆' : '未登录' //登陆状态
    rec_phone.innerText = localStorage.getItem('phone') || '' //登陆的手机号码
    rec_loc.innerText = localStorage.getItem('loc') || '' //当前保存的地址
    rec_geoLoc.innerText = (localStorage.getItem('lng') || '') + ',' + (localStorage.getItem('lat') || '') //当前保存的经纬度信息
    btnLogout.style.display = qjydsid ? 'inline' : 'none' //登出按钮
}


//显示错误消息，必要时跳转到登陆页面
function displayMessage(result) {
    //登陆状态失效
    if (result.code && result.code == 4001) {
        Cookies.remove('QJYDSID')
        clearInfo()
        setTimeout(function () {
            window.location.reload();
        }, 100)
    }
    message.style.opacity = "1"
    message.innerText = result.message + (result.data && result.data.msg ? '|' + result.data.msg : '')
    setTimeout(() => {
        message.style.opacity = "0.5"
    }, 3000);
}

//清除不必要的信息
function clearInfo() {
    localStorage.removeItem('phone')
}

init()

function saveHistory() {
    let dataStr = localStorage.getItem('history'),
        data = dataStr ? JSON.parse(dataStr) : []

    if (!Array.isArray(data)) {
        data = []
    }

    let d = new Date(),
        date = d.toLocaleDateString(),
        time = d.toLocaleTimeString()
    dList = data.find(v => v.date === date)
    if (dList) {
        dList.records.unshift(time)
    } else {
        data.unshift({
            date,
            records: [time]
        })
    }

    localStorage.setItem('history', JSON.stringify(data.slice(0, 180)))
    return true
}
