
import { BodyParam, QueryParam, Get, IAction, ViewResponse } from '../../src/actions';
import { InvalidMessageException } from '../../src/exceptions';


import { IntPipe } from '../common/pipes';


@Get({
    path: '/show'
})
export class ShowAction implements IAction {

    @QueryParam('id', new IntPipe())
    private id: number

    @QueryParam()
    private allQueryParams: { id: string }

    action() {
        if (this.id < 1) {
            throw new InvalidMessageException('not allow id param')
        }

        return new ViewResponse('load', {
            message: "hello",
            id: this.id
        });
    }

    onError(err: any, @QueryParam() id: string) {
        return new ViewResponse('load', {
            error: err,
            message: "hello",
            id: id
        });
    }
}