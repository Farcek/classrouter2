import { HttpMethod, Paramtype } from "./common";

export interface Classtype {
    new(...args: any[]): any
}

export interface IMiddleware {
    (req: any, res: any, next: any): any
}

export interface IMiddlewareFactory {
    (): IMiddleware
}

export interface IPipeTransform {
    transform(value: any): any
}

export interface OController {
    name: string
    path?: string
    actions?: Classtype[]
    controllers?: Classtype[]

    befores?: IMiddlewareFactory[]
}

export interface OAction {
    path: string | string[];

    /**
     * class action bol name requared
     */
    name?: string;


    errorHandle?: string;

    befores?: IMiddlewareFactory[]
}

export interface OActionclassMethod {
    methodname: string;
    errorHandle?: string;
}


export interface OActionClass {
    httpMethod: HttpMethod
    option: OAction;

    actionname: string;
}

export interface OActionMethod {
    httpMethod: HttpMethod
    option: OAction;
    methodname: string;
}



export interface OPropertyParam {
    property: string;
    fieldname: string[];

    paramType: Paramtype;

    pipes: IPipeTransform[];
}

export interface OArgumentParam {
    index: number;
    paramType: Paramtype;
    fieldname: string[];
    pipes: IPipeTransform[];
}


export interface OErrorArgument {
    index: number;
    ErrorClass: Classtype;
}

export interface OErrorMethod {
    methodname: string;
    instanceOf?: Classtype;
    when?: { (err: any): boolean };
}


// response filter


export interface IFilterParam {
    actionResult: any;
    expressRes: IExpressResponse;
    expressReq: IExpressRequest;
    handled: boolean;

    refilter: (result: any) => Promise<void>;
}

export interface IResponseFilter {
    filter(param: IFilterParam): void | Promise<void>
}
export interface IExpressRouter {
    use: (...args: any[]) => void;
    get: (...args: any[]) => void;
    post: (...args: any[]) => void;
    delete: (...args: any[]) => void;
    put: (...args: any[]) => void;
    head: (...args: any[]) => void;
}

export interface IExpressResponse {
    end: (...args: any[]) => void;
    status: (status: number) => IExpressResponse;
    json: (object: object) => void;
    redirect: (status: number, url: string) => void;
    contentType: (type: string) => IExpressResponse;
    header: (key: string, value: string) => IExpressResponse;
    render: (view: string, payload: object) => void;
    sendFile: (file: string, options: object) => void;
}
export interface IExpressRequest {
    body?: object;
    query?: object;
    params?: object;
    cookies?: object;
    headers?: object;
}
export interface IExpressNext {
    (error?: any): void
}

export interface ILogger {
    (level: 'error' | 'warn' | 'info' | 'verbose' | 'debug', message: string, attr?: object): void;
}

export interface IRouterBuilder {
    (): IExpressRouter;
}