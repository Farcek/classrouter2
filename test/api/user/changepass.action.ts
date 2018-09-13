import { BodyParam, QueryParam, Post, IAction, PathParam } from '../../../src/actions';

import { UserPipe, UserValidationPipe, IUser } from '../../common/pipes';

import { Description, Property, Type } from "@napp/common"



@Description("usera")
export class UserDto implements IUser {
    @Property()
    id: number = 0;



    @Property({ name: "fullname" })
    name: string = "";
}

@Post({
    path: '/changepass'
})
export class ChangepassAction implements IAction {

    @Type(String)
    @QueryParam() qAll: any;
    @QueryParam("uid") uid: string;
    @QueryParam(new UserPipe()) user: UserDto

    @PathParam("userid", new UserPipe()) userid: UserDto
    async action(): Promise<UserDto> {

        return this.user;
    }
}