import { BodyParam, QueryParam, Post, IAction, ViewResponse } from '../../../src/actions';

import { UserPipe, UserValidationPipe, IUser } from '../../common/pipes';


@Post({
    path: '/changepass'
})
export class ChangepassAction implements IAction {

    async action( @BodyParam(new UserPipe()) user: IUser) {
        // user.pass ="new pass"
        // await user.save()
        return user;
    }
}