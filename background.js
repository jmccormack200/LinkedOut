const linkedInNewsfeed = 'https://www.linkedin.com/feed/'
const linkedInJobs = 'https://www.linkedin.com/jobs/'

chrome.runtime.onInstalled.addListener(async () => {
    chrome.action.setBadgeText({
      text: 'ON'
    });
  });


chrome.tabs.onActivated.addListener(checkTab);

eventList = ['onBeforeNavigate', 'onCommitted', 'onCompleted','onHistoryStateUpdated'];

eventList.forEach(function(e) {
    chrome.webNavigation[e].addListener(async data => {
        await checkTab();
    });
});

async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

async function checkTab() {
    let tab = await getCurrentTab()
    let url = tab.url
    let currentState = await chrome.action.getBadgeText({ tabId: tab.id });
    if (url != null && url.startsWith(linkedInNewsfeed) && currentState === 'ON') {
        setTimeout(() => {
            chrome.tabs.update({url: linkedInJobs});
         }, 500);
    }
};

chrome.action.onClicked.addListener(async (tab) => {
    const prevState = await chrome.action.getBadgeText({ tabId: tab.id });

    // Next state will always be the opposite
    const nextState = prevState === 'ON' ? 'OFF' : 'ON'

    // Set the action badge to the next state
    await chrome.action.setBadgeText({
        tabId: tab.id,
        text: nextState,
    });
    if (tab.url.startsWith(linkedInNewsfeed) && nextState === 'ON') {
        chrome.tabs.update({url: linkedInJobs});
    }
});
