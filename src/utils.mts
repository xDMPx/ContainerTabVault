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

