export interface Message {
    command: MessageCommand,
    savedWorkspaceName: string | undefined,
    newWorkspaceName: string | undefined,
}

export enum MessageCommand {
    SaveOpenedTabs,
    OpenSavedTabs,
    DeleteWorkspace,
    RenameWorkspace,
}

export interface State {
    tabs: Map<string, Tab[]>,
    closeTabs: boolean,
    openTabsInNewWindow: boolean,
}

export interface Tab {
    url: string | undefined,
    cookieStoreId: string,
}

export function instanceOfState(object: any): object is State {
    return 'tabs' in object;
}
