/// <reference types="express" />
import * as express from 'express';
export interface IFilterParam {
    actionResult: any;
    expressRes: express.Response;
    expressReq: express.Request;
    handled: boolean;
}
export interface IResonse {
    contentType: string;
    statusCode: number;
    headers: {
        [key: string]: string;
    };
}
export interface IResponseFilter {
    filter(param: IFilterParam): void | Promise<void>;
}
