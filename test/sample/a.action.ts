import { Get, Action, QueryParam, HeaderParam, CookieParam, ErrorHandle, IntPipe } from "src";


@Get({ path: '/a-action', name: 'a-action', errorHandle: 'OnError' })
export class aAction {


    @QueryParam('id', new IntPipe(), { transform: (v: number) => { if (v === 0) throw new Error("id is `0`"); return v * 2 } })
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
            name: name,
            cookie
        }
    }

    

    OnError(err: any) {
        return {
            txt: 'OnError - ok', 
            err
        }
    }
}