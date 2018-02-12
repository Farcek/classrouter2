import { Post, IAction, ViewResponse } from '../../src/actions';

@Post()
export class LoginAction implements IAction {
    async action() {
        return new ViewResponse('login.html', {});
    }
}