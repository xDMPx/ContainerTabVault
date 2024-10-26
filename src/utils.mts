import { State } from "./interfaces.mjs";

export async function getState(): Promise<State> {
    let { state }: { [key: string]: State | undefined } = await chrome.storage.local.get("state");
    if (state == undefined) {
        state = {
            tabs: [],
            closeTabs: false,
        }
    }

    return state;
}

export async function setState(state: State) {
    await chrome.storage.local.set({ state: state });
}

