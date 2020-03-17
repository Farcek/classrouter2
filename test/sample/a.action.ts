import { Get, Action, QueryParam, HeaderParam, CookieParam, ErrorHandle, IntPipe } from "src";



@Get({ path: '/a-action', name: 'a-action' })
export class aAction {

    at = new Date();

    @QueryParam('id', new IntPipe(), { transform: (v: number) => { if (v === 0) throw new Error("id is `0`"); return v * 2 } })
    id: number = 0;

    @HeaderParam()
    headers: any;

    @Action({errorHandle : 'OnError'})
    actionOk(@QueryParam('name') name: string, @CookieParam() cookie: any) {
        if (name == 'error') {
            throw new Error();
        }

        return {
            n: 'a-action',
            id: this.id,
            at: this.at,
            name: name,

        }
    }



    OnError(err: any) {
        return {
            txt: 'OnError - ok',
            err
        }
    }
}