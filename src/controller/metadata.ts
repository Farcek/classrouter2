import { HttpMethod } from '../common/http-method.enum'
import { Paramtype } from '../common/paramtype.enum'
import { Metaname } from '../common/metaname';
import { IControllerType } from './interface';
import { IActionType } from '../action/interface';
import { IMiddlewareFactory } from '../middleware/interface';




export class ControllerMetadata {
    path: string = '/'
    actions: IActionType[] = []
    childControllers: IControllerType[] = []
    //parentController: IControllerType | null

    beforeMiddlewares: IMiddlewareFactory[] = []
}


export function createControllerMetadata(target: object) {
    if (Reflect.hasMetadata(Metaname.Action, target)) {
        throw new Error(`already created ControllerMetadata. targer object "${target}"`);
    }
    let meta = new ControllerMetadata();
    Reflect.defineMetadata(Metaname.Controller, meta, target);
    return meta;
}
export function getControllerMetadata(target: object) {
    let meta: ControllerMetadata = Reflect.getOwnMetadata(Metaname.Controller, target);
    if (meta) {
        return meta;
    }
    throw new Error(`not found ControllerMetadata. targer object "${target}"`);
}