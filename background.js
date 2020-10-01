function openPage() {
  chrome.runtime.openOptionsPage();
}

chrome.browserAction.onClicked.addListener(openPage);
openPage();