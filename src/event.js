const GOOGLE_CALENDAR_WEEK_URL = 'https://calendar.google.com/calendar/u/0/r/week';

function createTask(title, explanation) {
    chrome.tabs.create({ url: GOOGLE_CALENDAR_WEEK_URL }, tab => {
        setTimeout( () => {
            const options = {
                action: "createTask",
                title: title,
                explanation: explanation
            };
            chrome.tabs.sendMessage(tab.id, options, function (response) {});
        }, 2000 );
    });
}

chrome.browserAction.onClicked.addListener( function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (!tabs[0]) return;
        const currentTab = tabs[0];
        createTask(currentTab.title, currentTab.url);
    });
});

chrome.runtime.onInstalled.addListener(function() {
    const parent = chrome.contextMenus.create({
        id: "create_task_menu",
        title: "Create Task",
        type: "normal",
        contexts: ["link"]
    });
});
  
chrome.contextMenus.onClicked.addListener(function(item){
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (!tabs[0]) return;
        const currentTab = tabs[0];
        const options = {
            action: "getLink"
        };
        chrome.tabs.sendMessage(currentTab.id, options, function(response) {
            createTask(response.title, response.url);
        });
    });
});
