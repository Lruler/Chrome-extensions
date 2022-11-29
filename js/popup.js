const select = document.querySelector('.area');
const date = document.querySelector('.date')
const start = document.querySelector('.start');
const end = document.querySelector('.end');
const now = document.querySelector('.now')
const reserve = document.querySelector('.reserve')

window.bgCommunicationPort = chrome.runtime.connect();

document.addEventListener("DOMContentLoaded", () => {
    bgCommunicationPort.postMessage({fromPopup:'init'});
    bgCommunicationPort.onMessage.addListener(function(receivedPortMsg) {//监听background
        if (!receivedPortMsg) return
        if (receivedPortMsg.Area) {
            let options = document.getElementsByTagName('option');
                for (let i = 0; i < options.length; ++i) {
                    if (options[i].value === receivedPortMsg.Area) {
                        options[i].selected = true
                    }
                }
            start.value = receivedPortMsg.Start;
            end.value = receivedPortMsg.End;
            date.value = receivedPortMsg.Date
        }
    });
});

select.addEventListener('change', (e) => {
    bgCommunicationPort.postMessage({ //发送到bg,键值可以自由设置
        Area: e.target.value,//内容
    });
})

date.addEventListener('change', (e) => {
    bgCommunicationPort.postMessage({
        Date: e.target.value
    })
})

start.addEventListener('change', (e) => {
    bgCommunicationPort.postMessage({
        Start: e.target.value
    })
})

end.addEventListener('change', (e) => {
    bgCommunicationPort.postMessage({
        End: e.target.value
    })
})

now.addEventListener('click', () => {
    bgCommunicationPort.postMessage({
        isReady: true,
        type: 'now'
    })
})

reserve.addEventListener('click', () => {
    bgCommunicationPort.postMessage({
        isReady: true,
        type: 'reserve'
    })
})