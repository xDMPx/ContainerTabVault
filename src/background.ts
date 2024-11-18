import browser from "webextension-polyfill";
import { Message, MessageCommand, Tab } from "./interfaces.mjs";
import { setState, getState } from "./utils.mjs";

console.log(`ContainerTabVault; start => ${Date.now()}`);

browser.runtime.onInstalled.addListener(async (details: browser.Runtime.OnInstalledDetailsType) => {
    if (details.reason === "update") {
        console.log("ContainerTabVault; state clear, but preserving saved workspaces");
        const old_state = await getState();
        const tabs = old_state.tabs;
        await browser.storage.local.clear();
        const state = await getState();
        state.tabs = tabs;
        await setState(state);
    }
});

browser.runtime.onMessage.addListener(async (_msg: unknown, _sender, _sendResponse) => {
    if (typeof _msg !== "object" || _msg === null) return;
    const msg = _msg as Message;
    console.log(`ContainerTabVault; onMessage => `);
    console.log(msg);

    if (msg.command === MessageCommand.SaveOpenedTabs) {
        const tabs = (await browser.tabs.query({ currentWindow: true }));
        const state_tabs = tabs.map((t) => {
            const url = (t?.url?.startsWith("about:")) ? undefined : t?.url;
            const tab: Tab = { url: url, cookieStoreId: t.cookieStoreId! };
            return tab;
        });
        const state = await getState();
        const last_index = [...state.tabs.keys()].map((k) => +k.slice(0, k.indexOf(';')))
            .filter((x: number) => !Number.isNaN(x))
            .sort().pop() || 0;

        state.tabs.set(`${last_index + 1};Workspace ${last_index + 1}`, state_tabs);
        setState(state);
    }
    if (msg.command === MessageCommand.OpenSavedTabs) {
        const state = await getState();
        const name = msg.savedWorkspaceName;
        if (name === undefined) return;

        let opened_tabs: number[] = [];
        if (state.closeTabs === true) {
            opened_tabs = (await browser.tabs.query({ currentWindow: true }))
                .map((t) => t.id).filter((t) => t !== undefined);
        }

        const tabs = state.tabs.get(name);
        if (tabs === undefined) return;

        const newWindowId = state.openTabsInNewWindow ? (await browser.windows.create()).id : undefined;

        const files: string[] = [];
        for (const tab of tabs) {
            if (tab.url?.startsWith("file://")) {
                files.push(tab.url);
                continue;
            };
            browser.tabs.create({
                url: tab.url,
                cookieStoreId: tab.cookieStoreId,
                windowId: newWindowId,
            });
        }

        if (files.length > 0) {
            const a = await browser.tabs.create({
                url: "files.html",
                windowId: newWindowId,
            });

            console.log(`ContainerTabVault; Generating files html => `);
            console.log(files);
            function insert_file_html() {
                browser.scripting.executeScript({
                    target: { tabId: a.id! },
                    func: (files: string[]) => {
                        for (const file of files) {
                            const a = document.createElement("a");
                            a.href = file;
                            a.text = decodeURI(file.substring(file.lastIndexOf('/') + 1));
                            document.body.getElementsByTagName("div").item(0)?.append(a);
                        }
                    },
                    args: [files]
                });
                browser.tabs.onUpdated.removeListener(insert_file_html);
            }

            browser.tabs.onUpdated.addListener(insert_file_html, { tabId: a.id! })
        }


        browser.tabs.remove(opened_tabs)
    }
    if (msg.command === MessageCommand.DeleteWorkspace) {
        const state = await getState();
        const name = msg.savedWorkspaceName;
        if (name === undefined) return;

        state.tabs.delete(name);

        setState(state);
    }
    if (msg.command === MessageCommand.RenameWorkspace) {
        const state = await getState();
        const name = msg.savedWorkspaceName;
        const new_name = msg.newWorkspaceName;
        if (name === undefined || new_name === undefined) return;
        const name_taken = [...state.tabs.keys()].map((k) => k.substring(k.indexOf(';') + 1)).find((k) => k == new_name.substring(new_name.indexOf(';') + 1));
        if (name_taken) return;

        const tabs = state.tabs.get(name);
        if (tabs !== undefined) {
            state.tabs.set(new_name, tabs);
            state.tabs.delete(name);
        }

        setState(state);
    }
});
