import { Classtype, OController, OAction, IPipeTransform, OActionMethod, OActionClass, OArgumentParam, OPropertyParam, OErrorMethod, OActionclassMethod } from "./interface";
import { HttpMethod, Paramtype, $metaname } from "./common";
import { injectable } from "inversify";


export function Controller(option: OController): ClassDecorator {
    return (target: Function) => {
        injectable()(target);
        Reflect.defineMetadata($metaname.controller, option, target);
    }
}

//#region  http methods

function httpAction(method: HttpMethod, option: OAction) {
    return (target: Function | Object, propertyKey?: string, descriptor?: any) => {
        
        if (propertyKey && descriptor) {
            let meta: OActionMethod = {
                httpMethod: method,
                methodname: propertyKey,
                option
            };




            let params: OActionMethod[] = Reflect.getMetadata($metaname.actionMethod, target.constructor);
            if (Array.isArray(params)) {
                params.push(meta);
            } else {
                Reflect.defineMetadata($metaname.actionMethod, [meta], target.constructor);
            }

        } else {
            if (option.name) {
                let meta: OActionClass = {
                    httpMethod: method, actionname: option.name,
                    option
                };

                Reflect.defineMetadata($metaname.actionClass, meta, target);
                injectable()(target);
            } else {
                //console.log(target, '->', option)
                throw new Error('name param requared');
            }

        }
    }
}

export function Get(option: OAction) {
    return httpAction(HttpMethod.Get, option);
}

export function Post(option: OAction) {
    return httpAction(HttpMethod.Post, option);
}
export function Delete(option: OAction) {
    return httpAction(HttpMethod.Delete, option);
}

export function Put(option: OAction) {
    return httpAction(HttpMethod.Put, option);
}

export function Head(option: OAction) {
    return httpAction(HttpMethod.Head, option);
}


export function Action(errorHandle?: string) {
    return (target: Object, propertyKey: string, descriptor: any) => {
        let option: OActionclassMethod = {
            errorHandle,
            methodname: propertyKey
        };
        Reflect.defineMetadata($metaname.actionClassMethodname, option, target.constructor);
    }
}

//#endregion

//#region Params
function createParamDecoder(paramType: Paramtype) {
    return (fieldname?: string | string[] | IPipeTransform, ...pipes: IPipeTransform[]) => {
        return (target: Object, property: string, parameterIndex?: number) => {

            let reqName: string[] = [];
            let _pipes: IPipeTransform[];

            if (fieldname && typeof fieldname === 'string') {
                reqName = [fieldname];
            }

            if (fieldname && Array.isArray(fieldname)) {
                reqName = fieldname;
            }


            if (fieldname && (fieldname as IPipeTransform).transform) {
                _pipes = [fieldname as IPipeTransform, ...pipes];
            } else {
                _pipes = pipes;
            }

            if (typeof parameterIndex === 'number') {
                let m: OArgumentParam = {
                    paramType,
                    index: parameterIndex,
                    fieldname: reqName,
                    pipes: _pipes
                };

                let params: OArgumentParam[] = Reflect.getMetadata($metaname.paramArgument, target.constructor, property);
                if (Array.isArray(params)) {
                    params.push(m);
                } else {
                    Reflect.defineMetadata($metaname.paramArgument, [m], target.constructor, property);
                }

            } else {
                let m: OPropertyParam = {
                    paramType,
                    property,
                    fieldname: reqName,
                    pipes: _pipes
                };

                let params: OPropertyParam[] = Reflect.getMetadata($metaname.paramProperty, target.constructor);
                if (Array.isArray(params)) {
                    params.push(m);
                } else {
                    Reflect.defineMetadata($metaname.paramProperty, [m], target.constructor);
                }
            }

        }
    }
}


export const BodyParam = createParamDecoder(Paramtype.Body);
export const PathParam = createParamDecoder(Paramtype.Path);
export const QueryParam = createParamDecoder(Paramtype.Query);
export const HeaderParam = createParamDecoder(Paramtype.Header);
export const CookieParam = createParamDecoder(Paramtype.Cookie);
export const RequestParam = createParamDecoder(Paramtype.Request);

////#endregion


export function ErrorHandle(errorType: Classtype) {
    return (target: Object, property: string) => {

        let m: OErrorMethod = {
            ErrorClass: errorType,
            methodname: property
        };

        let params: OErrorMethod[] = Reflect.getMetadata($metaname.errorMethod, target.constructor);
        if (Array.isArray(params)) {
            params.push(m);
        } else {
            Reflect.defineMetadata($metaname.errorMethod, [m], target.constructor);
        }

    }
}