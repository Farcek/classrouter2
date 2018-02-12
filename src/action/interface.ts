export interface IAction {
    action(...args: any[]): any
    onError?(error: any, ...args: any[]): any
}
export interface IActionType {
    new(...args: any[]): IAction
}