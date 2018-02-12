import { IActionType } from '../action/interface';
import { IControllerType } from './interface';
import { IMiddlewareFactory } from '../middleware/interface';
export interface IControllerOption {
    path?: string;
    actions?: IActionType[];
    controllers?: IControllerType[];
    befores?: IMiddlewareFactory[];
}
export declare function Controller(option: IControllerOption): ClassDecorator;
