import { instanceOfState, State } from "./interfaces.mjs";
import browser from "webextension-polyfill";

export async function getState(): Promise<State> {
    let { state }: { [key: string]: unknown | undefined } = (await browser.storage.local.get("state"));
    if (instanceOfState(state)) {
        return state;
    }
    else {
        const state = {
            tabs: [],
            closeTabs: false,
        }
        return state;
    }

}

export async function setState(state: State) {
    await browser.storage.local.set({ state: state });
}

