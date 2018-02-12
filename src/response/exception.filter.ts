import { IResponseFilter, IFilterParam } from './interface'
import { HttpException } from '../exception/http.exception'


export class ExceptionResponseFilter implements IResponseFilter {
    filter(params: IFilterParam) {
        let { actionResult, expressRes } = params;

        if (actionResult instanceof HttpException) {

            expressRes.status(actionResult.status);
            expressRes.json(actionResult);
            params.handled = true;
        }
    }
}

