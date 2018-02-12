import { IResonse } from './interface';
export declare class ViewResponse implements IResonse {
    viewname: string;
    data: any;
    contentType: string;
    statusCode: number;
    headers: {
        [key: string]: string;
    };
    constructor(viewname: string, data: any);
}
