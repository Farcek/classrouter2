import { HttpMethod } from '../common/http-method.enum';
import { ParamMetadata, ArgumentMetadata } from '../param/metadata';
import { IMiddlewareFactory } from '../middleware/interface';
export declare class ActionMetadata {
    constructor();
    method: HttpMethod;
    paths: string[];
    properties: ParamMetadata[];
    actionArguments: ArgumentMetadata[];
    errorArguments: ArgumentMetadata[];
    beforeMiddlewares: IMiddlewareFactory[];
}
export declare function createActionMetadata(target: object): ActionMetadata;
export declare function getActionMetadata(target: object): ActionMetadata;
export declare function getOrCreateActionMetadata(target: object): ActionMetadata;
