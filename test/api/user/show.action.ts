import { PathParam, Get, IAction, ViewResponse } from '../../../src/actions';

import { IntPipe, UserPipe, UserValidationPipe, IUser } from '../../common/pipes';


@Get()
export class ShowAction implements IAction {

    async action( @PathParam('userid', new IntPipe(), new UserPipe()) user: IUser) {

        return user;
    }
}