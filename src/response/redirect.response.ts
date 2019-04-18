import { IResponseFilter, IFilterParam } from '../interface'



export class RedirectResponse {


    statusCode: number


    constructor(public uri: string, temp: boolean = true) {
        this.statusCode = temp ? 302 : 301
    }
}

export class RedirectResponseFilter implements IResponseFilter {
    filter(params: IFilterParam) {
        let { actionResult, expressRes } = params;
        if (actionResult instanceof RedirectResponse) {
            expressRes.redirect(actionResult.statusCode, actionResult.uri);
            params.handled = true;
        }
    }
}