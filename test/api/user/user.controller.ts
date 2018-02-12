import { Controller } from '../../../src/controllers';
import { PathParam } from '../../../src/actions';

import { ChangepassAction } from './changepass.action';
import { UpdateAction } from './update.action';
import { ShowAction } from './show.action';


@Controller({
    path: '/user/:userid',
    actions: [ChangepassAction, UpdateAction, ShowAction]
})
export class UserController {

    
}