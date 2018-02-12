import { BodyParam, QueryParam, Get, IAction, ViewResponse } from '../../src/actions';
import { InvalidMessageException } from '../../src/exceptions';


import { PagingPipe, IPaging } from '../common/pipes';


@Get({
    path: '/list'
})
export class ListAction implements IAction {

    @QueryParam(new PagingPipe())
    private paging: IPaging

    async action() {

        let users: any[] = [{ name: 'foo' }, { name: 'baa' }]

        // let users = await  UserModel.findByAll({
        //     limit: this.paging.limit,
        //     offset: this.paging.offset
        // })

        return new ViewResponse('load', {
            paging: this.paging,
            users: users
        });
    }
}