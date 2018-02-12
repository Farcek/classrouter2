import { IResponseFilter, IFilterParam } from './interface'
import { ViewResponse } from './view.response'

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