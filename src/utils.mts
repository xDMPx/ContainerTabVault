import { instanceOfState, State } from "./interfaces.mjs";
import browser from "webextension-polyfill";

export async function getState(): Promise<State> {
    let { state }: { [key: string]: unknown | undefined } = (await browser.storage.local.get("state"));

    if (state !== undefined && instanceOfState(state)) {
        return state;
    }
    else {
        const state = {
            tabs: new Map(),
            closeTabs: false,
            openTabsInNewWindow: false,
        }
        return state;
    }
}

export async function setState(state: State) {
    await browser.storage.local.set({ state: state });
}

export async function getTabs(): Promise<string[]> {
    const state = await getState();
    const tabs = [...state.tabs.entries()];

    const a = tabs.map(([k, v]) => {
        const tabsInWorkspace = v.map((t) => `${t.url};${t.cookieStoreId}`).join('\n');
        return `${k}:\n${tabsInWorkspace}`;
    });

    return a;
}
