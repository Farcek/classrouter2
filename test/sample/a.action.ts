import { Get, Action, QueryParam, HeaderParam, CookieParam, ErrorHandle } from "src";

@Get({ path: '/a-action', name: 'a-action', errorHandle: 'OnError' })
export class aAction {


    @QueryParam('id', { transform: (v) => { if(v == 0) throw new Error("id is `0`");  return 1  } })
    id: number = 0;

    @HeaderParam()
    headers: any;

    @Action('OnError')
    actionOk(@QueryParam('name') name: string, @CookieParam() cookie: any) {
        if (name == 'error') {
            throw new Error();
        }
        return {
            n: 'a-action',
            id: this.id,
            headers: this.headers,
            name: name
        }
    }

    @ErrorHandle(Error)
    onError1(err: any, @QueryParam('name') name: string, @CookieParam() cookie: any) {
        return {
            err,
            n: 'error1',
            id: this.id,
            name, cookie
        }
    }

    @ErrorHandle(Error)
    onError2() {
        return {
            n: 'error2',
            id: this.id
        }
    }

    OnError(err: any) {
        return {
            txt : 'OnError - ok', err
        }
    }
}