import { HttpMethod, Paramtype } from "./common";
import express from 'express';

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
    ErrorClass: Classtype;
}


// response filter


export interface IFilterParam {
    actionResult: any
    expressRes: express.Response
    expressReq: express.Request
    handled: boolean
}

export interface IResponseFilter {
    filter(param: IFilterParam): void | Promise<void>
}


export interface ILogger {
    error: (message: string, attr?: Object) => void;
    warn: (message: string, attr?: Object) => void;
    info: (message: string, attr?: Object) => void;
    verbose: (message: string, attr?: Object) => void;
    debug: (message: string, attr?: Object) => void;
    write: (level: string, message: string, attr?: Object) => void;
}