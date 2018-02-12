import { IResponseFilter, IFilterParam, IResonse } from './response/interface';
import { ViewResponseFilter } from './response/view.filter';
import { RedirectResponseFilter } from './response/redirect.filter';
import { FileResponseFilter } from './response/file.filter';
import { ExceptionResponseFilter } from './response/exception.filter';

export {
    IResponseFilter, IFilterParam, IResonse,

    ViewResponseFilter, RedirectResponseFilter, FileResponseFilter, ExceptionResponseFilter
}

export const viewFilter = new ViewResponseFilter();
export const redirectFilter = new RedirectResponseFilter();
export const exceptionFilter = new ExceptionResponseFilter();

/**
 * viewFilter, redirectFilter, exceptionFilter
 */
export const defaultFilters = [viewFilter, redirectFilter, exceptionFilter];
