import { IResonse } from './interface';
export declare class RedirectResponse implements IResonse {
    uri: string;
    contentType: string;
    statusCode: number;
    headers: {
        [key: string]: string;
    };
    constructor(uri: string, temp?: boolean);
}
