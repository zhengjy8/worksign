import { fetch } from 'whatwg-fetch'

let defaultCity = document.getElementById('defaultCity')
let address = document.getElementById('address')
let btnSearch = document.getElementById('btnSearch')
let list = document.getElementById('list')

let city = '全国'

const AK_KEY = '9I4LVb4ltQLGsx1GrsljWcCf', //'KPx7nDiVnDGqlWjCnZ6cd6rAsimIpzV3'0,
    //API_DOMAIN = 'http://api.map.baidu.com'
    API_DOMAIN = '/bapi'

//定位城市
async function locate() {
    return fetch(`${API_DOMAIN}/location/ip?ak=${AK_KEY}`).then(res => res.json())
}

//搜索
async function search(keyWords, city) {
    //return fetch(`${API_DOMAIN}/place/v2/search?q=${encodeURIComponent(keyWords)}&region=${encodeURIComponent(city)}&output=json&ak=${AK_KEY}`).then(res=>res.json())
    return fetch(`${API_DOMAIN}/place/v2/suggestion?q=${encodeURIComponent(keyWords)}&region=${encodeURIComponent(city)}&city_limit=true&output=json&ak=${AK_KEY}`).then(res => res.json())

}

function locate2old() {

    return new Promise((resolve, reject) => {
        let scriptEl = document.createElement('script')
        scriptEl.src = 'http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js'
        document.body.appendChild(scriptEl)
        scriptEl.onload = function () {
            //var remote_ip_info = {"ret":1,"start":-1,"end":-1,"country":"\u4e2d\u56fd","province":"\u5317\u4eac","city":"\u5317\u4eac","district":"","isp":"","type":"","desc":""};
            resolve(remote_ip_info)
        }
    })

}


function IPCallBack(data) {
    window.cityData = data
    return data
}


function locate2() {
    return new Promise((resolve, reject) => {
        let scriptEl = document.createElement('script')
        scriptEl.src = 'http://whois.pconline.com.cn/ipJson.jsp'
        document.body.appendChild(scriptEl)
        scriptEl.onload = function () {
            resolve(window.cityData)
        }
    })
}

//初始化
 function init() {
    // let result = await locate()
    // result.content.address_detail.city
    city = '成都市'
    defaultCity.innerText = city
    btnSearch.removeAttribute('disabled')
}

//搜索
btnSearch.addEventListener('click', async () => {
    let results = await search(address.value, city)
    render(results.result)
})

//执行搜索
// async function executeSearch() {
//     var ev = window.event || arguments.callee.caller.arguments[0];
//     if (ev.keyCode == 13) {
//         let results = await search(address.value, city)
//         render(results.result)
//     }
// }

//渲染
function render(results) {
    list.innerHTML = ''
    let htmlStr = ''
    results.forEach(v => {
        if (v.location) {
            htmlStr += `<li data-lat = "${v.location.lat}" data-lng = "${v.location.lng}" data-loc='${v.name}|${v.district}'>${v.name} <br/>${v.district}</li>`
        }
    })
    list.innerHTML = htmlStr
}

//选择地址
list.addEventListener('click', ev => {
    if (ev.target.tagName == 'LI') {
        let el = ev.target
        localStorage.setItem('lat', el.getAttribute('data-lat'));
        localStorage.setItem('lng', el.getAttribute('data-lng'));
        localStorage.setItem('loc', el.getAttribute('data-loc'))
        console.log(localStorage)

        window.location.href = '/index.html'
    }
})

init()
