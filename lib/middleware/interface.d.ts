export interface IMiddleware {
    (req: any, res: any, next: any): any;
}
export interface IMiddlewareFactory {
    (): IMiddleware;
}
