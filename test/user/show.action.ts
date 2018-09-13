
import { BodyParam, QueryParam, Get, IAction, ViewResponse, PathParam } from '../../src/actions';
import { InvalidMessageException } from '../../src/exceptions';


import { IntPipe } from '../common/pipes';

export class TestID{
    id = ""
}

@Get({
    path: '/show/:id'
})
export class ShowAction implements IAction {

    @QueryParam('id', new IntPipe())
    private id: number

    /**
     * param names
     */
    @PathParam('id', new IntPipe())
    private idPath: number 

    @QueryParam()
    private allQueryParams: TestID

    action() {
        if (this.id < 1) {
            throw new InvalidMessageException('not allow id param')
        }

        return new ViewResponse('load', {
            message: "hello",
            id: this.id
        });
    }

    onError(err: any) {
        return new ViewResponse('load', {
            error: err,
            message: "hello",
            id: this.id
        });
    }
}