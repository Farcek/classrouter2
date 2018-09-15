import { IControllerType } from './interface';
import { IActionType } from '../action/interface';
import { IMiddlewareFactory } from '../middleware/interface';
export declare class ControllerMetadata {
    name: string;
    path: string;
    actions: IActionType[];
    childControllers: IControllerType[];
    beforeMiddlewares: IMiddlewareFactory[];
}
export declare function createControllerMetadata(target: object): ControllerMetadata;
export declare function getControllerMetadata(target: object): ControllerMetadata;
