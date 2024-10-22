export interface Message {
    command: MessageCommand,
}

export enum MessageCommand {
    DuplicateTab
}
