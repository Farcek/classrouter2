import { Get, IAction, ViewResponse } from '../../src/actions';

@Get()
export class FormAction implements IAction {
    async action() {
        return new ViewResponse('login.html', {

        });
    }
}