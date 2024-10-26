export interface Message {
    command: MessageCommand,
}

export enum MessageCommand {
    SaveOpenedTabs,
    OpenSavedTabs
}

export interface State {
    tabs: Tab[]
    closeTabs: boolean,
}

export interface Tab {
    url: string | undefined,
    cookieStoreId: string
}
