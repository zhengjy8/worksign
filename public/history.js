(function () {
    let dataStr = localStorage.getItem('history'),
        data = dataStr ? JSON.parse(dataStr) : null

    if (!data) {
        list.innerHTML = '<li>没有打卡记录</li>'
    }

    let htmlStr = ''
    if (Array.isArray(data)) {
        data.forEach(d => {
            htmlStr += `
                <li class="date"'>${d.date}</li>                    
            `
            if(d.records){
                htmlStr += d.records.map(r=>`<li>${r}</li>`).join('')
            }
        })

        list.innerHTML = htmlStr
    }

})()