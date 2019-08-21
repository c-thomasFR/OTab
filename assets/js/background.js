chrome.browserAction.onClicked.addEventListener(function ()
{
	chrome.tabs.create({'url':"chrome://newtab"});
});