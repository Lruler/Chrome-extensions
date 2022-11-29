/*
 * @Date: 2022-08-10 12:01:11
 * @LastEditors: Lq
 * @LastEditTime: 2022-08-10 18:59:53
 * @FilePath: \learnningNotes\chorme\extensions\background.js
 */
//background.js
chrome.runtime.onInstalled.addListener(() => {
    DBdata("clear");//清除插件保存的本地数据
});

//插件用的数据都存储在storage.local中
function DBdata(mode,callback,data){//操作本地存储的函数
    if(mode=="set"){//保存本地数据
        chrome.storage.local.set({LocalDB: data});
    }else if(mode=="get"){//获取
        chrome.storage.local.get('LocalDB', function(response) {
            typeof callback == 'function' ? callback(response) : null;
        });
    }else if(mode=="clear"){//清空
        chrome.storage.local.clear();
    }
}
//监听popup发来的内容receivedMsg
chrome.runtime.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(receivedMsg) {
        if (receivedMsg.isReady) {
            DBdata('get',function(res){//从本地取数据
                chrome.tabs.query({
                    active: true,
                    currentWindow: true
                }, function (tabs) {
                    chrome.tabs.sendMessage(
                        tabs[0].id, 
                        { LocalDB: res.LocalDB, type: receivedMsg.type}, 
                        function (res) {});	
                });
            });
        }
        else {
            // 初始化页面
            if(receivedMsg.fromPopup && receivedMsg.fromPopup=='init'){
                DBdata('get',function(res){
                    port.postMessage(res.LocalDB); //发送到popup
                });
            }
            else{ //如果不是，则说明是收到来自popup手动点击设置的数据，存入以用于popup打开时展示
                DBdata('get', function(res) {
                    let temp = {...res.LocalDB, ...receivedMsg}
                    DBdata('set','',temp)
                })
            }
        }
    })
});

  
//监听Content发来的内容receivedMsg
chrome.runtime.onMessage.addListener(function(senderRequest, sender, sendResponse) {
	sendResponse({msg: '接收到content'});
});
