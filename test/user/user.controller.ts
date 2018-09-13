import { Controller } from '../../src/controllers';

import { ListAction } from './list.action';
import { ShowAction } from './show.action';


@Controller({
    name : "user",
    path: '/user',
    actions: [ShowAction, ListAction]
})
export class UserController {

}