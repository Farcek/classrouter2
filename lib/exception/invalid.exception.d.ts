import { HttpException } from './http.exception';
export declare class InvalidMessageException extends HttpException {
    constructor(message: string);
}
export interface IInvalidProperties {
    [key: string]: string[];
}
export declare class InvalidPropertiesException extends HttpException {
    readonly properties: IInvalidProperties;
    constructor(properties: IInvalidProperties);
}
