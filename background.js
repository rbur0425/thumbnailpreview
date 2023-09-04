chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' && tab.url.includes("youtube.com/results") ) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js']
          }, () => {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError);
            }
          });
          
    }
});
