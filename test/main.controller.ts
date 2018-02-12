import { Controller } from '../src/controllers';
import { UserController } from './user/user.controller';
import { LoginController } from './login/login.controller';
import { ApiController } from './api/api.controller';


@Controller({
    controllers: [UserController, LoginController, ApiController]
})
export class MainController {

}