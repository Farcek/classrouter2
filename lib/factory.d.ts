/// <reference types="express" />
import "reflect-metadata";
import { IControllerType } from "./controller/interface";
import { IActionType } from "./action/interface";
import { ActionMetadata } from "./action/metadata";
import { IPipeTransform } from "./pipe/interface";
import { IResponseFilter } from "./response/interface";
import { Paramtype } from "./common/paramtype.enum";
import { HttpException } from "./exceptions";
import * as express from "express";
export interface IFactoryOptions {
    basepath?: string;
    app: express.Application;
    controllerTypes: IControllerType[];
    responseFilters: IResponseFilter[];
}
export declare class ClassrouterFactory {
    app: express.Application;
    basepath?: string;
    controllerTypes: IControllerType[];
    responseFilters: IResponseFilter[];
    constructor(options: IFactoryOptions);
    log(...msg: any[]): void;
    logError(error: HttpException): void;
    setupController(ctrlType: IControllerType, parent: express.Router, basePath: string): Promise<void>;
    resolveValue(type: Paramtype, fieldname: string | null, req: express.Request): Promise<any>;
    transformValue(startValue: any, pipes: IPipeTransform[]): Promise<any>;
    result(actionResult: any, req: express.Request, res: express.Response): Promise<void>;
    errorParse(error: any): HttpException;
    actinHandle(actionType: IActionType, aMeta: ActionMetadata): Promise<(req: express.Request, res: express.Response) => void>;
    setupAction(actionType: IActionType, router: express.Router, basepath: string): Promise<void>;
    setupErrorhandle(): void;
    initlize(): Promise<void>;
}
