import browser from "webextension-polyfill";
import { Message, MessageCommand, State, Tab } from "./interfaces.mjs";

console.log(`ContainerTabVault; start => ${Date.now()}`);

async function getState(): Promise<State> {
    let { state }: { [key: string]: State | undefined } = await chrome.storage.local.get("state");
    if (state == undefined) {
        state = {
            tabs: []
        }
    }

    return state;
}

async function setState(state: State) {
    await chrome.storage.local.set({ state: state });
}

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
        const state: State = { tabs: state_tabs };
        setState(state);
    }
    if (msg.command === MessageCommand.OpenSavedTabs) {
        const state = await getState();
        const tabs = state.tabs;
        for (const tab of tabs) {
            browser.tabs.create({
                url: tab.url,
                cookieStoreId: tab.cookieStoreId
            });
        }
    }
});
