export interface Message {
    command: MessageCommand,
}

export enum MessageCommand {
    SaveOpenedTabs,
    OpenSavedTabs
}

export interface State {
    tabs: Tab[]
}

export interface Tab {
    url: string | undefined,
    cookieStoreId: string
}
