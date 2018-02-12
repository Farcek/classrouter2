import { IMiddlewareFactory } from '../middleware/interface';
export interface IActionOptions {
    path?: string | string[];
    befores?: IMiddlewareFactory[];
}
export declare const Get: (options?: IActionOptions | undefined) => ClassDecorator;
export declare const Post: (options?: IActionOptions | undefined) => ClassDecorator;
export declare const Put: (options?: IActionOptions | undefined) => ClassDecorator;
export declare const Delete: (options?: IActionOptions | undefined) => ClassDecorator;
export declare const All: (options?: IActionOptions | undefined) => ClassDecorator;
