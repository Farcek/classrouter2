import { IResponseFilter, IFilterParam } from '../interface'
import { Exception, ExceptionConvert } from '@napp/exception';
export class JsonResponseFilter implements IResponseFilter {
    filter(param: IFilterParam) {
        let { actionResult, expressRes } = param;
        let err: any = actionResult;
        if (err instanceof Error) {
            err = ExceptionConvert(actionResult);
        }

        if (err instanceof Exception) {

            let status = err.getDataValue('status');

            if (typeof status === 'number' && status > 99 && status < 600) {
                expressRes.status(status).json(err.toJson());
            } else {
                expressRes.status(500).json(err.toJson());
            }
        } else {
            expressRes.json(actionResult);
        }
        param.handled = true;
    }
}