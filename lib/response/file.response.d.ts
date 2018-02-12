import { IResonse } from './interface';
export declare class FileResponse implements IResonse {
    filename: string;
    contentType: string;
    statusCode: number;
    headers: {
        [key: string]: string;
    };
    constructor(filename: string);
}
