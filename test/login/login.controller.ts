import { Controller } from '../../src/controllers';

import { FormAction } from './form.action';
import { LoginAction } from './login.action';


@Controller({
    path: '/login',
    actions: [FormAction, LoginAction]
})
export class LoginController {

}