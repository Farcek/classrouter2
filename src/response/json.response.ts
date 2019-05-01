import { IResponseFilter, IFilterParam } from '../interface'
import { HttpException } from '../exception';
export class JsonResponseFilter implements IResponseFilter {
    filter(param: IFilterParam) {
        let { actionResult, expressRes } = param;
        if (actionResult instanceof HttpException) {
            expressRes.status(actionResult.status).json(actionResult.toJSON());
        } else {
            expressRes.json(actionResult);
        }
        param.handled = true;
    }
}