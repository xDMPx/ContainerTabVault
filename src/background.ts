import browser from "webextension-polyfill";
import { Message, MessageCommand, Tab } from "./interfaces.mjs";
import { setState, getState } from "./utils.mjs";

console.log(`ContainerTabVault; start => ${Date.now()}`);

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
        state.tabs = state_tabs;
        state.closeTabs = state.closeTabs;
        setState(state);
    }
    if (msg.command === MessageCommand.OpenSavedTabs) {
        const state = await getState();

        let opened_tabs: number[] = [];
        if (state.closeTabs === true) {
            opened_tabs = (await browser.tabs.query({}))
                .map((t) => t.id).filter((t) => t !== undefined);
        }

        const tabs = state.tabs;
        for (const tab of tabs) {
            browser.tabs.create({
                url: tab.url,
                cookieStoreId: tab.cookieStoreId
            });
        }

        browser.tabs.remove(opened_tabs)
    }
});
