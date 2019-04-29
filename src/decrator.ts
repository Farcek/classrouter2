import { Classtype, OController, OAction, IPipeTransform, OActionMethod, OActionClass, OArgumentParam, OPropertyParam, OErrorMethod, OActionclassMethod } from "./interface";
import { HttpMethod, Paramtype, $metaname } from "./common";
import { injectable } from "inversify";
import { ReflectClassmeta, decoratorFactoryClass, DecoratorType, decoratorFactoryMethodAndClass, decoratorFactoryMethod, decoratorFactoryArgumentAndProperty } from "@napp/reflect";

export function Controller(option: OController) {
    return decoratorFactoryClass<void>((target, decoratorOption) => {
        if (decoratorOption.decoratorType == DecoratorType.class) {
            injectable()(target);
            Reflect.defineMetadata($metaname.controller, option, target);
        }
    });
}



//#region  http methods

function httpAction(method: HttpMethod, option: OAction) {

    return decoratorFactoryMethodAndClass<void>((target, decoratorOption) => {
        if (decoratorOption.decoratorType == DecoratorType.method && decoratorOption.method) {
            // method
            let meta: OActionMethod = {
                httpMethod: method,
                methodname: decoratorOption.method.name,
                option
            };

            let params: OActionMethod[] = Reflect.getMetadata($metaname.actionMethod, target.constructor);
            if (Array.isArray(params)) {
                params.push(meta);
            } else {
                Reflect.defineMetadata($metaname.actionMethod, [meta], target.constructor);
            }
        } else if (decoratorOption.decoratorType == DecoratorType.class) {
            // class
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
        } else {
            throw new Error('the decrator used to Class or Method');
        }
    });
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

export function Action(opt?: { errorHandle?: string }) {

    return decoratorFactoryMethod<void>((target, decoratorOption) => {
        if (decoratorOption.decoratorType == DecoratorType.method && decoratorOption.method) {
            let option: OActionclassMethod = {
                errorHandle: opt && opt.errorHandle,
                methodname: decoratorOption.method.name
            };
            Reflect.defineMetadata($metaname.actionClassMethodname, option, target.constructor);
        } else {
            throw new Error('the decrator used to only Method');
        }
    });
}

//#endregion

//#region Params
function createParamDecoder(paramType: Paramtype) {
    return (fieldname?: string | string[] | IPipeTransform, ...pipes: IPipeTransform[]) => {
        return decoratorFactoryArgumentAndProperty<void>((target: Object, decoratorOption) => {
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



            if (decoratorOption.decoratorType == DecoratorType.argument && decoratorOption.argument) {
                let parameterIndex = decoratorOption.argument.index;
                let property = decoratorOption.argument.method;
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

            } else if (decoratorOption.decoratorType == DecoratorType.property && decoratorOption.property) {
                let property = decoratorOption.property.name;

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
            } else {
                throw new Error('the decrator used to Property or Argument');
            }
        });
    }
}


export const BodyParam = createParamDecoder(Paramtype.Body);
export const PathParam = createParamDecoder(Paramtype.Path);
export const QueryParam = createParamDecoder(Paramtype.Query);
export const HeaderParam = createParamDecoder(Paramtype.Header);
export const CookieParam = createParamDecoder(Paramtype.Cookie);
export const RequestParam = createParamDecoder(Paramtype.Request);

////#endregion


export function ErrorHandle(opt: { instanceOf?: Classtype, when?: { (errorType: Classtype): boolean } }) {
    return decoratorFactoryMethod<void>((target: Object, decoratorOption) => {
        if (decoratorOption.decoratorType == DecoratorType.method && decoratorOption.method) {
            let m: OErrorMethod = {
                instanceOf: opt.instanceOf,
                when: opt.when,
                methodname: decoratorOption.method.name
            };

            if (!(m.instanceOf || m.when)) {
                console.log("instanceOf or when Param requared", target)
                throw new Error('instanceOf or when Param requared')
            }



            let params: OErrorMethod[] = Reflect.getMetadata($metaname.errorMethod, target.constructor);
            if (Array.isArray(params)) {
                params.push(m);
            } else {
                Reflect.defineMetadata($metaname.errorMethod, [m], target.constructor);
            }
        } else {
            throw new Error('the decrator used to only Method');
        }

    });
}