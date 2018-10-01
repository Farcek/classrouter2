import { HttpMethod } from '../common/http-method.enum'
import { Paramtype } from '../common/paramtype.enum'
import { Metaname } from '../common/metaname';
import { ParamMetadata, ArgumentMetadata } from '../param/metadata'
import { IMiddlewareFactory } from '../middleware/interface';
import { ClassType } from '@napp/common';

const $ = {
    i: 0
}

export class ActionMetadata {
    constructor(public actionClass: ClassType) {
        
    }
    method: HttpMethod = HttpMethod.Get
    paths: string[] = ['/']

    properties: ParamMetadata[] = []
    actionArguments: ArgumentMetadata[] = []
    errorArguments: ArgumentMetadata[] = []
    beforeMiddlewares: IMiddlewareFactory[] = []
}


export function getActionMetadata(target: object) {
    let meta: ActionMetadata = Reflect.getOwnMetadata(Metaname.Action, target);
    if (meta) {
        return meta;
    }
    throw new Error(`not found ActionMetadata. targer object "${target}"`);
}

export function getOrCreateActionMetadata(target: ClassType) {
    let meta: ActionMetadata = Reflect.getOwnMetadata(Metaname.Action, target);
    if (meta) {
        return meta;
    }
    meta = new ActionMetadata(target);
    Reflect.defineMetadata(Metaname.Action, meta, target);
    return meta;
}