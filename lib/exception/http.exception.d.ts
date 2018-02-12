export declare abstract class HttpException extends Error {
    readonly name: string;
    readonly message: string;
    readonly status: number;
    constructor(name: string, message: string, status: number);
    toJSON(): any;
}
