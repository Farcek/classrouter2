import { IResponseFilter, IFilterParam } from './interface'
import { RedirectResponse } from './redirect.response'

export class RedirectResponseFilter implements IResponseFilter {
    filter(params: IFilterParam) {
        let { actionResult, expressRes } = params;
        if (actionResult instanceof RedirectResponse) {
            expressRes.redirect(actionResult.statusCode, actionResult.uri);
            params.handled = true;
        }
    }
}