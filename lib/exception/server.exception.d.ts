import { HttpException } from './http.exception';
export declare class ServerException extends HttpException {
    constructor(message: string);
}
