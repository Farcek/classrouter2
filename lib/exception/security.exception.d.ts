import { HttpException } from './http.exception';
export declare class AuthenticationException extends HttpException {
    constructor();
}
export declare class AuthorizationException extends HttpException {
    constructor(message: string);
}
