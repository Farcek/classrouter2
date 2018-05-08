import { HttpMethod } from '../common/http-method.enum'
import { Paramtype } from '../common/paramtype.enum'
import { Metaname } from '../common/metaname';
import { IPipeTransform } from '../pipe/interface'
import { ParamMetadata, ArgumentMetadata } from '../param/metadata'
import { IMiddlewareFactory } from '../middleware/interface';

const $ = {
    i: 0
}

export class ActionMetadata {
    constructor() {
        console.log('action meta' + $.i++)
    }
    method: HttpMethod = HttpMethod.Get
    paths: string[] = ['/']

    properties: ParamMetadata[] = []
    actionArguments: ArgumentMetadata[] = []
    errorArguments: ArgumentMetadata[] = []
    beforeMiddlewares: IMiddlewareFactory[] = []
}

export function createActionMetadata(target: object) {
    if (Reflect.hasMetadata(Metaname.Action, target)) {
        throw new Error(`already created ActionMetadata. targer object "${target}"`);
    }
    let meta = new ActionMetadata();
    Reflect.defineMetadata(Metaname.Action, meta, target);
    return meta;
}
export function getActionMetadata(target: object) {
    let meta: ActionMetadata = Reflect.getOwnMetadata(Metaname.Action, target);
    if (meta) {
        return meta;
    }
    throw new Error(`not found ActionMetadata. targer object "${target}"`);
}

export function getOrCreateActionMetadata(target: object) {
    let meta: ActionMetadata = Reflect.getOwnMetadata(Metaname.Action, target);
    if (meta) {
        return meta;
    }
    meta = new ActionMetadata();
    Reflect.defineMetadata(Metaname.Action, meta, target);
    return meta;
}