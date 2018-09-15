import { HttpMethod } from '../common/http-method.enum';
import { ParamMetadata, ArgumentMetadata } from '../param/metadata';
import { IMiddlewareFactory } from '../middleware/interface';
import { ClassType } from '@napp/common';
export declare class ActionMetadata {
    actionClass: ClassType;
    constructor(actionClass: ClassType);
    method: HttpMethod;
    paths: string[];
    properties: ParamMetadata[];
    actionArguments: ArgumentMetadata[];
    errorArguments: ArgumentMetadata[];
    beforeMiddlewares: IMiddlewareFactory[];
}
export declare function getActionMetadata(target: object): ActionMetadata;
export declare function getOrCreateActionMetadata(target: ClassType): ActionMetadata;
