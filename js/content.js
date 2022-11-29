/**
 * 南湖二楼开敞座位区 区域id: 101699071 座位id: 101699933-101700080
 * 南湖卡座 区域id: 101699071 座位id: 101700081-101700176
 * 南湖分馆一楼中庭开敞座位区 区域id: 101699069 座位id: 101699605-101699776
 * 南湖分馆一楼开敞座位区 区域id: 101699069 座位id: 101699777-101699932
 */
//content.js   manifest匹配地址的页面在刷新时会直接执行这里的代码
console.log('run')
function getNowFormatDate() {
    let date = new Date();
    let seperator1 = "-";
    let seperator2 = ":";
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let strDate = date.getDate();

    const addZero = (params) => {
        if (params >= 0 && params <= 9) return '0' + params
        else return params
    }

    let currentdate = year + seperator1 + addZero(month) + seperator1 + addZero(strDate)
            + " " + addZero(date.getHours()) + seperator2 + addZero(date.getMinutes())
            + seperator2 + addZero(date.getSeconds());
    return currentdate;
}

const Request = (url, options = {}) => {
  url = `${url}`;
  const isFile = options.body instanceof FormData;
  options.headers = isFile
    ? {}
    : {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };
  options.headers.Authorization = localStorage.getItem('token');

  if (options.body) {
    options.body = isFile ? options.body : JSON.stringify(options.body);
  }
  return fetch(url, options)
    .then((response) => {
      if (response.ok) {
        return response.json().then((res) => {
          console.log(res);
          return res;
        });
      } else {
        return response.json().then((res) => {
          return new Promise((_, reject) => {
            reject(res);
          });
        });
      }
    })
    .catch((e) => {
      console.log(`服务端错误：${e.message}`);
      throw e;
    });
};

const Reserve = (area, start, end, date) => {
    if(!area || ! start || !end) {
        alert('注意筛选条件');
        return
    }
    if (start.slice(0, 2) < end.slice(0, 2)) {
        let range = area.split('-')
        const s = start.slice(0, 2) + start.slice(-2)
        const e = end.slice(0, 2) + end.slice(-2)
        for (let i = +range[0]; i < +range[1]; ++i) {
            Request(
            `/ClientWeb/pro/ajax/reserve.aspx?dialogid=&dev_id=${i}&lab_id=&kind_id=&room_id=&type=dev&prop=&test_id=&term=&Vnumber=&classkind=&test_name=&start=${date + " " + start}&end=${date + " " +end}&start_time=${s}&end_time=${e}&up_file=&memo=&act=set_resv&_=`
            )
        }
    }
    else alert('请预约一个小时以上并注意合法时间！')
}

chrome.runtime.sendMessage(chrome.runtime.id, {//当页面刷新时发送到bg
    fromContent: 'init'
});
//接收到bg
chrome.runtime.onMessage.addListener(function(senderRequest, sender, sendResponse) {
    sendResponse('这里是content返回值');
    let LocalDB = senderRequest.LocalDB;
    if (senderRequest.type === 'now') {
      Reserve(LocalDB.Area, LocalDB.Start, LocalDB.End, LocalDB.Date)
    }
    else {
      let now = new Date(getNowFormatDate()).getTime();
      let end = new Date(getNowFormatDate().slice(0, 10) + ` 18:00:00`).getTime();
      setTimeout(() => {
        Reserve(LocalDB.Area, LocalDB.Start, LocalDB.End, LocalDB.Date)
      }, end - now)
      alert('预定成功！！')
    }
});



