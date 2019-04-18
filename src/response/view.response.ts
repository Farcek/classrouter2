import { IResponseFilter, IFilterParam } from "../interface";

export class ViewResponse {

    contentType?: string
    statusCode?: number
    headers?: { [key: string]: string }

    constructor(public viewname: string, public data: any) {

    }
}

export class ViewResponseFilter implements IResponseFilter {
    filter(params: IFilterParam) {
        let { actionResult, expressRes } = params;
        if (actionResult instanceof ViewResponse) {

            expressRes.contentType(actionResult.contentType || 'html');
            expressRes.status(actionResult.statusCode || 200)
            if (actionResult.headers) {
                Object.keys(actionResult.headers).map(key => {
                    expressRes.header(key, actionResult.headers[key]);
                });
            }
            expressRes.render(actionResult.viewname, actionResult.data || {});
            params.handled = true;
        }
    }
}