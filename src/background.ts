import browser from "webextension-polyfill";
import { Message, MessageCommand } from "./interfaces.mjs";

console.log(`ContainerTabVault; start => ${Date.now()}`);

browser.runtime.onMessage.addListener(async (_msg: unknown, _sender, _sendResponse) => {
    if (typeof _msg !== "object" || _msg === null) return;
    const msg = _msg as Message;

    if (msg.command === MessageCommand.DuplicateTab) {
        const tab = (await browser.tabs.query({ active: true, lastFocusedWindow: true })).pop();
        const url = (tab?.url?.startsWith("about:")) ? undefined : tab?.url;
        browser.tabs.create({
            url: url,
            cookieStoreId: tab?.cookieStoreId
        })
    }
});
