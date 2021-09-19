function operate(elementSelector, retryCount, doOperation) {
    if (retryCount <= 0) return
    
    const element = document.querySelector(elementSelector);
    if (element) {
        doOperation(element);
        return
    }
    setTimeout(() => {
        operate(elementSelector, retryCount - 1, doOperation);
    }, 1000);
}

const OPERATION_RETRY = 60;
function createTask(title, explanation) {
    operate("button[aria-label='作成']", OPERATION_RETRY, element => {
        element.click();
    });
            
    operate("div[aria-controls='tabTask']", OPERATION_RETRY, element => {
        element.click();
    });

    operate("input[aria-label='タイトルを追加']", OPERATION_RETRY, element => {
        element.value = title;;
    });
    
    operate("textarea[aria-label='説明を追加']", OPERATION_RETRY, element => {
        element.textContent = explanation;
        //TODO change to other way of making place holder invisible
        element.parentElement.previousElementSibling.style.display='none';
    });
    
    operate("div[aria-label='終日']", OPERATION_RETRY, element => {
        element.click();
    });
}

var clickedElement;

document.addEventListener("contextmenu", function(event){
    clickedElement = event.target;
}, true);

const REQUEST_ACTION_CREATE_TASK = "createTask";
const REQUEST_ACTION_GET_LINK = "getLink";

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    switch (request.action) {
        case REQUEST_ACTION_CREATE_TASK:
            createTask(request.title, request.explanation);
            sendResponse({response: "finished"});
            break;
        case REQUEST_ACTION_GET_LINK:
            sendResponse({title: clickedElement.innerText, url: clickedElement.href});
            break;
        default:
            sendResponse({response: "unmatched"});
    }
});
