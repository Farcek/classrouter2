import { PathParam, Get, IAction,  apiSecurityUse } from '../../../src';

import { IntPipe, UserPipe,  IUser } from '../../common/pipes';



@Get() @apiSecurityUse("auth2")
export class ShowAction implements IAction {

    async action( @PathParam('userid', new IntPipe(), new UserPipe()) user: IUser) {

        return user;
    }
}