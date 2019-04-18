import { IResponseFilter, IFilterParam } from '../interface'

export class FileResponse  {

    contentType?: string
    statusCode?: number
    headers?: { [key: string]: string }

    constructor(public filename: string) {

    }
}
export class FileResponseFilter implements IResponseFilter {

    constructor(public root?: string) {

    }

    filter(params: IFilterParam) {
        let { actionResult, expressRes } = params;
        if (actionResult instanceof FileResponse) {

            if (actionResult.contentType) {
                expressRes.contentType(actionResult.contentType);
            }

            if (actionResult.statusCode) {
                expressRes.status(actionResult.statusCode)
            }

            if (actionResult.headers) {
                Object.keys(actionResult.headers).map(key => {
                    expressRes.header(key, actionResult.headers[key]);
                });
            }
            
            expressRes.sendFile(actionResult.filename, {
                root: this.root
            });

            params.handled = true;
        }
    }
}