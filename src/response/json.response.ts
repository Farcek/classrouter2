import { IResponseFilter, IFilterParam } from '../interface'
export class JsonResponseFilter implements IResponseFilter {
    filter(param: IFilterParam){
        let { actionResult, expressRes } = param;
        expressRes.json(actionResult);
        param.handled = true;
    }
}