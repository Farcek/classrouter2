import { IResponseFilter, IFilterParam } from '../interface'
import { Exception, IHttpException, convertException } from '@napp/exception';
export class JsonResponseFilter implements IResponseFilter {
    filter(param: IFilterParam) {
        let { actionResult, expressRes } = param;
        let err: any = actionResult;
        if (err instanceof Error) {
            err = convertException(actionResult);
        }

        if (err instanceof Exception) {
            let err: IHttpException = <any>actionResult;
            if (err.status) {
                expressRes.status(err.status).json(actionResult.toJson());
            } else {
                expressRes.status(500).json(actionResult.toJson());
            }
        } else {
            expressRes.json(actionResult);
        }
        param.handled = true;
    }
}