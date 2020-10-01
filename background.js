function openPage() {
  const url = browser.runtime.getURL("public/index.html");
  browser.tabs.create({
    url,
  });
}
browser.browserAction.onClicked.addListener(openPage);
openPage();