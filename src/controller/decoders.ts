
import { IActionType } from '../action/interface';
import { IControllerType } from './interface';
import { ControllerMetadata, createControllerMetadata } from './metadata';
import { IMiddlewareFactory } from '../middleware/interface';


export interface IControllerOption {
    path?: string
    actions?: IActionType[]
    controllers?: IControllerType[]

    befores?: IMiddlewareFactory[]
}

export function Controller(option: IControllerOption): ClassDecorator {
    return (target: object) => {
        let meta = createControllerMetadata(target);
        if (option.path) meta.path = option.path;
        if (Array.isArray(option.actions)) meta.actions = option.actions
        if (Array.isArray(option.controllers)) meta.childControllers = option.controllers
        if (Array.isArray(option.befores)) meta.beforeMiddlewares = option.befores
    }
}