import { BodyParam, QueryParam, Post, IAction, PathParam } from '../../../src/actions';

import { UserPipe, UserValidationPipe, IUser } from '../../common/pipes';

import { Description, Property, Type } from "@napp/common"
import { apiResponse, apiSecurityUse } from '../../../src';



@Description("usera")
export class UserDto implements IUser {
    @Property()
    id: number = 0;



    @Property({ name: "fullname", description: "enter fullname" })
    name: string = "";
}

@Description("error")
export class UserTodoDto implements IUser {
    @Property()
    id: number = 0;



    @Property({ name: "fullname", description: "enter fullname" })
    name: string = "";
}

@Post({
    path: '/changepass'
})

@apiSecurityUse("auth1")
export class ChangepassAction implements IAction {


    @Description("enter user id")
    @Type(String, true)
    @QueryParam("userids") uid: string[];


    @Description("rq payload")
    @Type(UserDto, true)
    @QueryParam(new UserPipe()) user: UserDto

    @PathParam("userid212121212", new UserPipe()) userid: UserDto

    @apiResponse(UserDto, { isArray: true, status : 203 })
    @apiResponse(Object, { isArray: true })
    @apiResponse(UserTodoDto, { status: 205 })
    async action(): Promise<UserDto> {

        return this.user;
    }
}