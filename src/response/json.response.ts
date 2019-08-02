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

            if ((err as any).status) {
                expressRes.status((err as any).status).json(err.toJson());
            } else {
                expressRes.status(500).json(err.toJson());
            }
        } else {
            expressRes.json(actionResult);
        }
        param.handled = true;
    }
}