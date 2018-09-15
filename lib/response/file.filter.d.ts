import { IResponseFilter, IFilterParam } from './interface';
export declare class FileResponseFilter implements IResponseFilter {
    root?: string | undefined;
    constructor(root?: string | undefined);
    filter(params: IFilterParam): void;
}
