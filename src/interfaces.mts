export interface Message {
    command: MessageCommand,
    savedWorkspaceName: string | undefined,
}

export enum MessageCommand {
    SaveOpenedTabs,
    OpenSavedTabs
}

export interface State {
    tabs: Map<string, Tab[]>,
    closeTabs: boolean,
}

export interface Tab {
    url: string | undefined,
    cookieStoreId: string
}

export function instanceOfState(object: any): object is State {
    return 'tabs' in object;
}
