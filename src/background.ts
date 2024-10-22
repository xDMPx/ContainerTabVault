import browser from "webextension-polyfill";

console.log(`ContainerTabVault; start => ${Date.now()}`);

browser.tabs.onCreated.addListener(async (tab: browser.Tabs.Tab) => {
    console.log(tab);
})
