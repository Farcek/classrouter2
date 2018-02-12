import { HttpMethod } from '../common/http-method.enum';
import { ActionMetadata, createActionMetadata, getOrCreateActionMetadata } from './metadata';
import { IMiddlewareFactory } from '../middleware/interface';


export interface IActionOptions {
    path?: string | string[],
    befores?: IMiddlewareFactory[]
}

function createActionDecoder(method: HttpMethod) {
    return (options?: IActionOptions): ClassDecorator => {
        return (target: object) => {
            let meta = getOrCreateActionMetadata(target);
            meta.method = method;
            if (options) {
                if (options.path && Array.isArray(options.path)) {
                    meta.paths = options.path;
                } else if (options.path && typeof options.path === 'string') {
                    meta.paths = [options.path];
                }

                if (options.befores && Array.isArray(options.befores)) meta.beforeMiddlewares = options.befores;
            }
        }
    }
}


export const Get = createActionDecoder(HttpMethod.Get);
export const Post = createActionDecoder(HttpMethod.Post);
export const Put = createActionDecoder(HttpMethod.Put);
export const Delete = createActionDecoder(HttpMethod.Delete);
export const All = createActionDecoder(HttpMethod.All);
