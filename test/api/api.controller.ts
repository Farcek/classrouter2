import { Controller } from '../../src/controllers';

import { UserController } from './user/user.controller';


@Controller({
    path: '/api',
    controllers: [UserController]
})
export class ApiController {

}