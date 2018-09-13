import { Controller } from '../../src/controllers';

import { UserController } from './user/user.controller';


@Controller({
    name : "api",
    path: '/api',
    controllers: [UserController]
})
export class ApiController {

}