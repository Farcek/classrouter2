import { BodyParam, QueryParam, Post, IAction, ViewResponse } from '../../../src/actions';

import { UserPipe, UserValidationPipe, IUser } from '../../common/pipes';


@Post({
    path: '/update'
})
export class UpdateAction implements IAction {

    async action( @BodyParam(new UserPipe()) user: IUser) {
        user.name = "new name"
        // await user.save()
        return user;
    }
}