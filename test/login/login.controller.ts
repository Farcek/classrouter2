import { Controller } from '../../src/controllers';

import { FormAction } from './form.action';
import { LoginAction } from './login.action';


@Controller({
    name : "login",
    path: '/login',
    actions: [FormAction, LoginAction]
})
export class LoginController {

}