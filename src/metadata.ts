import { Classtype, OController, OActionClass, OAction, OActionMethod, OPropertyParam, OArgumentParam, OErrorArgument, OErrorMethod, OActionclassMethod } from "./interface";
import { $metaname, HttpMethod, Paramtype } from "./common";




export class Rootmeta {
    controllers: { [name: string]: ControllerMeta } = {};

    registerController(controller: Classtype, rootname: string): void {
        let meta = new ControllerMeta(controller, rootname);

        this.controllers[meta.localname] = meta;
    }

    toMetajson(): any {
        return {
            controllers: Object.entries(this.controllers).map(([name, meta]) => {
                return { name, meta: meta.toMetajson() };
            })
        }
    }
}
export class ControllerMeta {
    private fullname: string;
    public localname: string;

    private option: OController;

    controllers: { [name: string]: ControllerMeta } = {};
    classActions: { [name: string]: ActionClassMeta } = {};
    methodActions: { [name: string]: ActionMethodMeta } = {};


    public errorMethods: { meta: MethodMeta, instanceOf?: Classtype, when?: { (errorType: any): boolean } }[] = [];

    get path() {
        return this.option.path;
    }

    get Controllerclass() {
        return this.ref;
    }

    get befores() {
        return this.option.befores || []
    }

    constructor(private ref: Classtype, private basename: string) {
        let option: OController = Reflect.getMetadata($metaname.controller, ref);
        if (option && option.name) {
            this.option = option;
            this.fullname = [basename, this.localname = option.name].filter(v => v).join('.');

            // controllers
            if (option.controllers) {
                for (let child of option.controllers) {
                    let m = new ControllerMeta(child, this.fullname);
                    this.controllers[m.localname] = m;
                }
            }


            // class actions
            if (option.actions) {
                for (let actionClass of option.actions) {
                    let m = new ActionClassMeta(actionClass, this.fullname);
                    this.classActions[m.localname] = m;
                }
            }

            // method actions
            let actionMethods: OActionMethod[] = Reflect.getMetadata($metaname.actionMethod, ref);
            if (actionMethods && Array.isArray(actionMethods)) {
                for (let actionMethod of actionMethods) {
                    let m = new ActionMethodMeta(this, this.fullname, actionMethod);
                    this.methodActions[m.localname] = m;
                }
            }

            // error handles
            let errorMethods: OErrorMethod[] = Reflect.getMetadata($metaname.errorMethod, ref);
            if (errorMethods && Array.isArray(errorMethods)) {
                for (let p of errorMethods) {
                    this.errorMethods.push({
                        instanceOf: p.instanceOf,
                        when: p.when,
                        meta: new MethodMeta(ref, p.methodname)
                    });
                }
            }

        } else {
            console.log(basename, '->', ref)
            throw new Error('Controller meta todorhoilogdoogui bna. ');
        }
    }

    toMetajson(): any {
        return {
            localname: this.localname, fullname: this.fullname, basename: this.basename,
            path: this.option.path,

            controllers: Object.entries(this.controllers).map(([name, meta]) => {
                return { name, meta: meta.toMetajson() };
            }),

            classActions: Object.entries(this.classActions).map(([name, meta]) => {
                return { name, meta: meta.toMetajson() };
            }),
            methodActions: Object.entries(this.methodActions).map(([name, meta]) => {
                return { name, meta: meta.toMetajson() };
            }),
        }
    }

}

export class ActionClassMeta {
    public fullname: string;
    public localname: string;

    private option: OActionClass;
    public properyParams: PropertyParamMeta[] = [];

    public actionMethod: MethodMeta;
    public errorMethods: { meta: MethodMeta, instanceOf?: Classtype, when?: { (err: any): boolean } }[] = [];
    public errorHandle1?: string;

    get httpMethod() {
        return this.option.httpMethod;
    }

    get path() {
        let f = this.option.option.path;
        return Array.isArray(f) ? f : [f];
    }

    get Actionclass() {
        return this.ref;
    }
    get methodname() {
        return this.option.actionname;
    }

    get befores() {
        return this.option.option.befores || []
    }

    get errorHandle2() {
        return this.option.option.errorHandle;
    }

    constructor(private ref: Classtype, private basename: string) {
        let option: OActionClass = Reflect.getMetadata($metaname.actionClass, ref);
        if (option) {
            this.option = option;
            this.fullname = [basename, this.localname = option.actionname].filter(v => v).join('.');

            let actionMethodOption: OActionclassMethod = Reflect.getMetadata($metaname.actionClassMethodname, ref);
            if (!actionMethodOption) {
                throw Error("action method not found");
            }
            this.errorHandle1 = actionMethodOption.errorHandle;
            this.actionMethod = new MethodMeta(ref, actionMethodOption.methodname);

            // propery params
            let propertyParams: OPropertyParam[] = Reflect.getMetadata($metaname.paramProperty, ref);
            if (propertyParams && Array.isArray(propertyParams)) {
                for (let p of propertyParams) {
                    this.properyParams.push(new PropertyParamMeta(ref, p))
                }
            }


            let errorMethods: OErrorMethod[] = Reflect.getMetadata($metaname.errorMethod, ref);
            if (errorMethods && Array.isArray(errorMethods)) {
                for (let p of errorMethods) {
                    this.errorMethods.push({
                        instanceOf: p.instanceOf,
                        when: p.when,
                        meta: new MethodMeta(ref, p.methodname)
                    });
                }
            }
        } else {
            console.log('Action meta todorhoilogdoogui bna.')
            console.log(basename, '->', ref)
            throw new Error('Action meta todorhoilogdoogui bna. ');
        }
    }

    toMetajson(): any {
        return {
            localname: this.localname, fullname: this.fullname, basename: this.basename,
            path: this.option.option.path,
            method: HttpMethod[this.option.httpMethod],

            properyParams: this.properyParams.map((meta) => {
                return meta.toMetajson();
            }),

            actionMethod: this.actionMethod.toMetajson(),

            errorMethods: this.errorMethods.map(({ meta, instanceOf, when }) => {
                return {
                    instanceOf: instanceOf ? instanceOf.name : undefined,
                    when: when ? true : false,
                    meta: meta.toMetajson()
                }
            }),
            errorHandle1: this.errorHandle1,
            errorHandle2: this.errorHandle2

        }
    }
}


export class MethodMeta {

    argumentParams: ArgumentParamMeta[] = [];

    constructor(ref: Classtype, public methodname: string) {
        if (!methodname) {
            console.log('Action method todorhoilogdoogui bna.')
            throw new Error('Action method todorhoilogdoogui bna. ');
        }

        // argument params
        let argumentParams: OArgumentParam[] = Reflect.getMetadata($metaname.paramArgument, ref, methodname);
        if (argumentParams && Array.isArray(argumentParams)) {
            for (let p of argumentParams) {
                this.argumentParams.push(new ArgumentParamMeta(ref, p))
            }
        }
    }

    toMetajson(): any {
        return {
            methodname: this.methodname,
            argumentsParams: this.argumentParams.map((meta) => {
                return meta.toMetajson();
            })
        }
    }
}

export class ActionMethodMeta {
    public fullname: string;
    public localname: string;

    methodMeta: MethodMeta;

    get httpMethod() {
        return this.option.httpMethod;
    }

    get path() {
        let f = this.option.option.path;
        return Array.isArray(f) ? f : [f];
    }

    get Controllerclass() {
        return this.controllerMeta.Controllerclass;
    }
    get errorMethods() {
        return this.controllerMeta.errorMethods;
    }

    get errorHandle() {
        return this.option.option.errorHandle;
    }
    get methodname() {
        return this.option.methodname;
    }

    get befores() {
        return this.option.option.befores || []
    }

    constructor(private controllerMeta: ControllerMeta, private basename: string, private option: OActionMethod) {
        this.fullname = [basename, this.localname = option.option.name || option.methodname].filter(v => v).join('.');

        this.methodMeta = new MethodMeta(controllerMeta.Controllerclass, option.methodname)
    }

    toMetajson(): any {
        return {
            localname: this.localname, fullname: this.fullname, basename: this.basename,
            path: this.option.option.path,
            method: HttpMethod[this.option.httpMethod],
            methodMeta: this.methodMeta.toMetajson(),
            errorHandle: this.errorHandle,
            errorMethods: this.errorMethods.map(({ meta, instanceOf, when }) => {
                return {
                    instanceOf: instanceOf ? instanceOf.name : undefined,
                    when: when ? true : false,
                    meta: meta.toMetajson()
                }
            }),
        }
    }
}


export class PropertyParamMeta {
    constructor(private ref: Classtype, private option: OPropertyParam) {

    }

    get paramtype() {
        return this.option.paramType;
    }

    get reqFieldnames() {
        return this.option.fieldname;
    }
    get pipes() {
        return this.option.pipes;
    }
    get propertyName() {
        return this.option.property;
    }

    toMetajson(): any {
        return {
            property: this.option.property, fieldname: this.option.fieldname, paramtype: Paramtype[this.option.paramType],
            pipes: Array.isArray(this.option.pipes) ? this.option.pipes.length : 0
        }
    }
}

export class ArgumentParamMeta {
    constructor(private ref: Classtype, private option: OArgumentParam) {

    }

    get paramtype() {
        return this.option.paramType;
    }

    get reqFieldnames() {
        return this.option.fieldname;
    }
    get pipes() {
        return this.option.pipes;
    }
    get argIndex() {
        return this.option.index;
    }

    toMetajson(): any {
        return {
            index: this.option.index, fieldname: this.option.fieldname, paramtype: Paramtype[this.option.paramType],
            pipes: Array.isArray(this.option.pipes) ? this.option.pipes.length : 0
        }
    }
}