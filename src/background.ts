import browser from "webextension-polyfill";
import { Message, MessageCommand, Tab } from "./interfaces.mjs";
import { setState, getState } from "./utils.mjs";

console.log(`ContainerTabVault; start => ${Date.now()}`);

browser.runtime.onInstalled.addListener(async (details: browser.Runtime.OnInstalledDetailsType) => {
    if (details.reason === "update") {
        console.log("state clear");
        await browser.storage.local.clear();
    }
});

browser.runtime.onMessage.addListener(async (_msg: unknown, _sender, _sendResponse) => {
    if (typeof _msg !== "object" || _msg === null) return;
    const msg = _msg as Message;

    if (msg.command === MessageCommand.SaveOpenedTabs) {
        const tabs = (await browser.tabs.query({}));
        const state_tabs = tabs.map((t) => {
            const url = (t?.url?.startsWith("about:")) ? undefined : t?.url;
            const tab: Tab = { url: url, cookieStoreId: t.cookieStoreId! };
            return tab;
        });
        const state = await getState();
        const last_index = [...state.tabs.keys()].map((k) => +k.slice(9)).sort().pop() || 0;
        state.tabs.set(`Workspace ${last_index + 1}`, state_tabs);
        setState(state);
    }
    if (msg.command === MessageCommand.OpenSavedTabs) {
        const state = await getState();
        const name = msg.savedWorkspaceName;
        if (name === undefined) return;

        let opened_tabs: number[] = [];
        if (state.closeTabs === true) {
            opened_tabs = (await browser.tabs.query({}))
                .map((t) => t.id).filter((t) => t !== undefined);
        }

        const tabs = state.tabs.get(name);
        if (tabs === undefined) return;

        for (const tab of tabs) {
            browser.tabs.create({
                url: tab.url,
                cookieStoreId: tab.cookieStoreId
            });
        }

        browser.tabs.remove(opened_tabs)
    }
});
